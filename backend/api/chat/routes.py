from google.generativeai import GenerativeModel
from flask import Blueprint, request, jsonify, Response, current_app as app
from middleware.auth_middleware import token_required
from jsonschema import validate, ValidationError
import json, traceback
from utils.chat import message_appender, store_chat_history
from utils.analytics import get_module_counts
import utils.modules
from models import (
    ChatHistory,
    ModuleEvaluationResult,
    db,
)


schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "module_id": {"type": "number"},
        "type": {"type": "string", "enum": ["coding_round", "module"]},
        "message": {"type": "string"},
    },
    "required": ["module_id", "type", "message"],
    "additionalProperties": False,
}


chat_blueprint = Blueprint("chat", __name__)


@chat_blueprint.route("/", methods=["POST"], endpoint="generate_chat")
@token_required
def generate_text(user_id):
    data = request.get_json()
    try:
        validate(instance=data, schema=schema)
    except ValidationError as e:
        return jsonify({"message": "Invalid format", "error": str(e)}), 400

    try:
        model: GenerativeModel | None = app.config.get(
            f"{data['type']}_{str(data['module_id'])}_model"
        )
        if not model:
            return jsonify({"message": "Model not found for module. Does the module exist?"}), 400
        chat_result = ChatHistory.query.filter_by(
            user_id=user_id, module_id=data["module_id"], type=data["type"]
        ).first()
        module_result = ModuleEvaluationResult.query.filter_by(
            user_id=user_id, module_id=data["module_id"]
        ).first()
        if not module_result:
            coding_round_count, quiz_question_count = get_module_counts(
                module_id=data["module_id"]
            )
            module_result = ModuleEvaluationResult(
                user_id=user_id,
                module_id=data["module_id"],
                no_queries_asked=1,
                coding_round_questions=coding_round_count,
                quiz_questions=quiz_question_count,
            )
            db.session.add(module_result)
        else:
            module_result.no_queries_asked += 1
        db.session.commit()
        if not chat_result:
            response = model.generate_content(data["message"])
            for part in response.parts:
                if text := part.text:
                    print(text)
                if tool_call := part.function_call:
                    args = {key: val for key, val in tool_call.args.items()}
                    # Retrieve the function from the module
                    func = getattr(utils.modules, tool_call.name)
                    # Call the function with arguments and capture the result
                    result = func(**args)
                    print(result)
            chat_result = ChatHistory(
                user_id=user_id,
                module_id=data["module_id"],
                type=data["type"],
                messages=json.dumps(
                    [
                        {"role": "user", "parts": [data["message"]]},
                        {"role": "model", "parts": [response.text]},
                    ]
                ),
            )
            db.session.add(chat_result)
        else:
            message = message_appender(
                chat_history=list(json.loads(chat_result.messages)),
                new_message=data["message"],
                message_type="user",
            )
            response = model.generate_content(message)
            for part in response.parts:
                if text := part.text:
                    print(text)
                if tool_call := part.function_call:
                    args = {key: val for key, val in tool_call.args.items()}
                    # Retrieve the function from the module
                    func = getattr(utils.modules, tool_call.name)
                    # Call the function with arguments and capture the result
                    result = func(**args)
                    print(result)
            
                
            message = message_appender(
                chat_history=message, new_message=response.text, message_type="model"
            )
            chat_result.messages = json.dumps(message)
        db.session.commit()
        return jsonify({"response": response.text})
    except Exception as e:
        print(e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@chat_blueprint.route("/stream", methods=["POST"], endpoint="stream_chat")
@token_required
def generate_text_stream(user_id):
    data = request.get_json()
    try:
        validate(instance=data, schema=schema)
    except ValidationError as e:
        return jsonify({"message": "Invalid format", "error": str(e)}), 400
    try:
        model: GenerativeModel = app.config.get(
            f"{data['type']}_{str(data['module_id'])}_model"
        )
        
        if model == None or not model:
            return jsonify({"message": "Model not found for module. Does the module exist?"}), 400

        module_result = ModuleEvaluationResult.query.filter_by(
            user_id=user_id, module_id=data["module_id"]
        ).first()
        if not module_result:
            coding_round_count, quiz_question_count = get_module_counts(
                module_id=data["module_id"]
            )
            module_result = ModuleEvaluationResult(
                user_id=user_id,
                module_id=data["module_id"],
                no_queries_asked=1,
                coding_round_questions=coding_round_count,
                quiz_questions=quiz_question_count,
            )
            db.session.add(module_result)
        else:
            module_result.no_queries_asked += 1
        db.session.commit()

        def generate():
            module_id_backup = data["module_id"]
            chat_type = data["type"]
            message_sent = data["message"]
            string_response = ""
            message_to_be_sent = store_chat_history(
                user_id, module_id_backup, chat_type, "user", message_sent
            )
            response = model.generate_content(message_to_be_sent, stream=True)
            tool_call_response = None
            for chunk in response:
                try:
                    if text := chunk.text:
                        # print(text)
                        string_response += text
                        yield "data: " + json.dumps({"message": text}) + "\n\n"
                except Exception as e:
                    print(e)
                    pass
                try:
                    
                    if tool_call := chunk.candidates[0].content.parts[0].function_call:
                        
                        print("-"*20, "TOOL_CALL", "-"*20)

                        print(chunk)
                        args = {key: val for key, val in tool_call.args.items()}
                        
                        print(args)
                        tool_call_response = {
                            "function_call": {
                                "name": tool_call.name,
                                "args": args
                            }
                        }
                        # Retrieve the function from the module
                        func = getattr(utils.modules, tool_call.name)
                        # Call the function with arguments and capture the result
                        result = func(**args)
                        if result[0] == "render":
                            yield "data: " + json.dumps({"message": f"\n![{str(args)}]({result[1]})\n"}) + "\n\n"
                        if result[0] == "action":
                            yield "data: " + json.dumps({"action": result[1]}) + "\n\n"

                        
                except Exception as e:
                    print(e)
                    pass

            print(string_response)
            store_chat_history(
                user_id, module_id_backup, chat_type, "model", string_response
            )
            # if tool_call_response:
            #     store_chat_history(user_id, module_id_backup, chat_type, "model", tool_call_response)


        return Response(generate(), mimetype="text/event-stream")
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@chat_blueprint.route("/history", methods=["POST"], endpoint="history_chat")
@token_required
def get_chat_history(user_id):
    data = request.get_json()
    try:
        module_id = data["module_id"]
        type = data["type"]
    except ValidationError as e:
        return jsonify({"message": "Invalid format", "error": str(e)}), 400
    try:
        chat_result = ChatHistory.query.filter_by(
            user_id=user_id, module_id=module_id, type=type
        ).first()
        if not chat_result:
            return jsonify({"message": "OK", "result": []}), 200
        return (
            jsonify(
                {"message": "OK", "result": list(json.loads(chat_result.messages))}
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500
