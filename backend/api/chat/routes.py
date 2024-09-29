import traceback
from google.generativeai import GenerativeModel, upload_file
from flask import Blueprint, request, jsonify, Response, current_app as app
from middleware.auth_middleware import token_required
import json, os, datetime
from utils.chat import combine_history_and_messages, store_chat_history
from utils.analytics import get_module_counts
import utils.modules
from utils.modules import (
    generate_custom_visualization_on_user_data,
    generate_example_image,
)
from models import (
    ChatHistory,
    ModuleEvaluationResult,
    db,
)

chat_blueprint = Blueprint("chat", __name__)

ALLOWED_EXTENSIONS = {
    "mp3": "audio/mpeg",
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png",
}


def allowed_file(filename):
    """Check if the file has an allowed extension."""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@chat_blueprint.route("/stream", methods=["POST"], endpoint="stream_chat")
@token_required
def generate_text_stream(user_id):
    data = json.loads(request.form.get("data", "{}"))
    files = request.files.getlist("files")  # Get the list of files
    files_api = []
    for file in files:
        if file:
            if not allowed_file(file.filename):
                return (
                    jsonify(
                        {
                            "message": "File type not allowed. Only mp3 and jpg, jpeg are supported."
                        }
                    ),
                    400,
                )

            # Create a secure filename
            extension = file.filename.rsplit(".", 1)[1].lower()
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{timestamp}.{extension}"
            file_path = os.path.join(
                app.config.get("ASSETS_DIRECTORY"), "assets", str(user_id), filename
            )
            # Ensure the user directory exists
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            # Save the file
            file.save(file_path)
            files_api.append(
                {
                    "type": "audio" if extension == "mp3" else "image",
                    "file_path": "/assets" + str(file_path.split("assets")[1]),
                }
            )
    try:
        model: GenerativeModel = app.config.get(
            f"{data['type']}_{str(data['module_id'])}_model"
        )

        if model == None or not model:
            return (
                jsonify(
                    {"message": "Model not found for module. Does the module exist?"}
                ),
                400,
            )

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
        module_id = data["module_id"]
        chat_type = data["type"]
        chat_type = "module"
        message = data.get("message", None)
        if not len(files_api) and not message:
            return (
                jsonify({"message": "Atleast one is required of files and message"}),
                400,
            )
        chat_history: ChatHistory = ChatHistory.query.filter_by(
            user_id=user_id, module_id=module_id, type=chat_type
        ).first()
        if chat_history:
            pass
        else:
            chat_history = ChatHistory(
                user_id=user_id, module_id=module_id, type=chat_type, messages="[]"
            )
            db.session.add(chat_history)
            db.session.commit()
        gemini_message, db_message = combine_history_and_messages(
            chat_history, message, files_api
        )
        print(gemini_message)
        chat_history.messages = json.dumps(db_message)
        db.session.commit()
        assets_dir = app.config.get("ASSETS_DIRECTORY")

        def generate():
            model_response = []

            response = model.generate_content(gemini_message, stream=True)
            tool_call_response = None
            for chunk in response:
                if str(chunk.candidates[0].finish_reason.name) != "STOP":
                    model_response.append(
                        {
                            "type": "text",
                            "value": f"\n\nYour message was blocked due to **{chunk.candidates[0].finish_reason.name}** reasons. Please dont use **explicit**, **repeating** words or sentences to avoid this issue.",
                        }
                    )
                    yield "data: " + json.dumps(
                        {
                            "message": f"\n\nYour message was blocked due to **{chunk.candidates[0].finish_reason.name}** reasons. Please dont use **explicit**, **repeating** words or sentences to avoid this issue."
                        }
                    ) + "\n\n"
                # else:
                try:
                    if text := chunk.text:
                        if len(model_response) == 0:
                            model_response.append({"type": "text", "value": text})
                        else:
                            last_data = model_response[-1]
                            if last_data["type"] == "text":
                                model_response[-1]["value"] += text
                            else:
                                model_response.append({"type": "text", "value": text})

                        yield "data: " + json.dumps({"message": text}) + "\n\n"
                except Exception as e:
                    print(e)
                    pass
                try:
                    if tool_call := chunk.candidates[0].content.parts[0].function_call:
                        print("-" * 20, "TOOL_CALL", "-" * 20)
                        args = {key: val for key, val in tool_call.args.items()}
                        args.setdefault("user_id", user_id)
                        args.setdefault("assets_dir", assets_dir)

                        tool_call_response = {
                            "function_call": {"name": tool_call.name, "args": args}
                        }
                        # Retrieve the function from the module
                        func = getattr(utils.modules, tool_call.name)
                        # Call the function with arguments and capture the result
                        if tool_call.name == "generate_example_image":
                            result = generate_example_image(**args)

                        elif (
                            tool_call.name
                            == "generate_custom_visualization_on_user_data"
                        ):
                            result = generate_custom_visualization_on_user_data(**args)
                        else:
                            result = func(**args)

                        if result == None:
                            print("Got result none")
                            continue
                        if result[0] == "render":
                            model_response.append(
                                {
                                    "type": (
                                        "gif" if result[1].endswith(".gif") else "image"
                                    ),
                                    "value": result[1],
                                }
                            )
                            yield "data: " + json.dumps(
                                {
                                    "message": f"\n![{os.path.basename(result[1])}]({result[1]})\n"
                                }
                            ) + "\n\n"
                        if result[0] == "action":
                            yield "data: " + json.dumps({"action": result[1]}) + "\n\n"

                except Exception as e:
                    print(e)
                    pass

            if model_response != "":
                store_chat_history(
                    user_id,
                    module_id,
                    chat_type,
                    "model",
                    model_response,
                )

        return Response(generate(), mimetype="text/event-stream")
    except Exception as e:
        print(traceback.print_exc())
        return jsonify({"error": str(e)}), 500


@chat_blueprint.route("/history", methods=["POST"], endpoint="history_chat")
@token_required
def get_chat_history(user_id):
    data = request.get_json()
    module_id = data["module_id"]
    type = data["type"]
    type = "module"

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


@chat_blueprint.route("/history", methods=["DELETE"], endpoint="history_chat_delete")
@token_required
def delete_chat_history(user_id):
    data = request.get_json()

    module_id = data["module_id"]
    type = data["type"]
    type = "module"
    try:
        chat_result: ChatHistory = ChatHistory.query.filter_by(
            user_id=user_id, module_id=module_id, type=type
        ).first()

        if not chat_result:
            return jsonify({"message": "OK", "result": []}), 200
        db.session.delete(chat_result)
        db.session.commit()
        return (
            jsonify(
                {
                    "message": "OK",
                    "result": f"Deleted chat history of user: {user_id}, module: {module_id}, type: {type}",
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# @chat_blueprint.route("/", methods=["POST"], endpoint="generate_chat")
# @token_required
# def generate_text(user_id):
#     data = request.get_json()
#     try:
#         validate(instance=data, schema=schema)
#     except ValidationError as e:
#         return jsonify({"message": "Invalid format", "error": str(e)}), 400

#     try:
#         model: GenerativeModel | None = app.config.get(
#             f"{data['type']}_{str(data['module_id'])}_model"
#         )
#         if not model:
#             return jsonify({"message": "Model not found for module. Does the module exist?"}), 400
#         chat_result = ChatHistory.query.filter_by(
#             user_id=user_id, module_id=data["module_id"], type=data["type"]
#         ).first()
#         module_result = ModuleEvaluationResult.query.filter_by(
#             user_id=user_id, module_id=data["module_id"]
#         ).first()
#         if not module_result:
#             coding_round_count, quiz_question_count = get_module_counts(
#                 module_id=data["module_id"]
#             )
#             module_result = ModuleEvaluationResult(
#                 user_id=user_id,
#                 module_id=data["module_id"],
#                 no_queries_asked=1,
#                 coding_round_questions=coding_round_count,
#                 quiz_questions=quiz_question_count,
#             )
#             db.session.add(module_result)
#         else:
#             module_result.no_queries_asked += 1
#         db.session.commit()
#         if not chat_result:
#             response = model.generate_content(data["message"])
#             for part in response.parts:
#                 if text := part.text:
#                     print(text)
#                 if tool_call := part.function_call:
#                     args = {key: val for key, val in tool_call.args.items()}
#                     # Retrieve the function from the module
#                     func = getattr(utils.modules, tool_call.name)
#                     # Call the function with arguments and capture the result
#                     result = func(**args)
#                     print(result)
#             chat_result = ChatHistory(
#                 user_id=user_id,
#                 module_id=data["module_id"],
#                 type=data["type"],
#                 messages=json.dumps(
#                     [
#                         {"role": "user", "parts": [data["message"]]},
#                         {"role": "model", "parts": [response.text]},
#                     ]
#                 ),
#             )
#             db.session.add(chat_result)
#         else:
#             message = message_appender(
#                 chat_history=list(json.loads(chat_result.messages)),
#                 new_message=data["message"],
#                 message_type="user",
#             )
#             response = model.generate_content(message)
#             for part in response.parts:
#                 if text := part.text:
#                     print(text)
#                 if tool_call := part.function_call:
#                     args = {key: val for key, val in tool_call.args.items()}
#                     # Retrieve the function from the module
#                     func = getattr(utils.modules, tool_call.name)
#                     # Call the function with arguments and capture the result
#                     result = func(**args)
#                     print(result)


#             message = message_appender(
#                 chat_history=message, new_message=response.text, message_type="model"
#             )
#             chat_result.messages = json.dumps(message)
#         db.session.commit()
#         return jsonify({"response": response.text})
#     except Exception as e:
#         print(e)
#         traceback.print_exc()
#         return jsonify({"error": str(e)}), 500
