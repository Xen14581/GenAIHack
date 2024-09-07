from flask import Blueprint, request, jsonify, current_app
from .coding_round.routes import coding_round_blueprint
from .quiz.routes import quiz_blueprint
from middleware.auth_middleware import token_required
from models import db, ModuleSchema, CodingRound, TestCase, Quiz, Question
import json
from google.generativeai import GenerativeModel

module_blueprint = Blueprint("module", __name__)

module_blueprint.register_blueprint(
    blueprint=coding_round_blueprint, url_prefix="/<int:module_id>/coding_round"
)
module_blueprint.register_blueprint(
    blueprint=quiz_blueprint, url_prefix="/<int:module_id>/quiz"
)


@module_blueprint.route("/list", methods=["GET"], endpoint="list_modules")
def list_quiz():
    # Query all modules
    modules = ModuleSchema.query.all()

    # Prepare a list of modules with their IDs and quiz titles
    module_list = []
    for module in modules:
        # quiz = Quiz.query.get(module.quiz_id)
        module_list.append({"id": module.id, "title": module.title, "description": module.description})

    return jsonify(module_list), 200


@module_blueprint.route("/create", methods=["POST"], endpoint="create_module")
@token_required
def create_module(user_id):
    # print(user_id)
    data = request.json
    if data.get("title", None) == None:
        return jsonify({"message": "Title is require to create a module"}), 400

    quiz_data = data.get("quiz")
    quiz_id = None
    if quiz_data:
        new_quiz = Quiz(title=quiz_data["title"], description=quiz_data["description"])
        db.session.add(new_quiz)
        db.session.commit()
        quiz_id = new_quiz.id

        for q in quiz_data["questions"]:
            question = Question(
                text=q["text"],
                options=json.dumps(q["options"]),
                correct_answer=q["correct_answer"],
                quiz_id=new_quiz.id,
            )
            db.session.add(question)

        db.session.commit()

    # Create the Coding Round
    coding_round_data = data.get("coding_round")
    coding_round_id = None
    if coding_round_data:
        new_coding_round = CodingRound(
            programming_question=coding_round_data["programming_question"],
            template_code=coding_round_data["template_code"],
            prompt=coding_round_data["prompt"],
        )
        db.session.add(new_coding_round)
        db.session.commit()
        coding_round_id = new_coding_round.id

        for tc in coding_round_data["test_cases"]:
            test_case = TestCase(
                input_params=json.dumps(tc["input"]),
                expected_output=tc["expected_output"],
                coding_round_id=new_coding_round.id,
            )
            db.session.add(test_case)

        db.session.commit()

    # Create the Module
    if quiz_id and coding_round_id:
        new_module = ModuleSchema(
            title=data.get("title"),
            quiz_id=quiz_id,
            description=data.get("description"),
            coding_round_id=coding_round_id,
            prompt=data.get("prompt"),
        )
        db.session.add(new_module)
        db.session.commit()
        
        current_app.config.setdefault(f"module_{str(new_module.id)}_model", GenerativeModel("gemini-1.5-flash", system_instruction=new_module.prompt))
        current_app.config.setdefault(f"coding_round_{str(new_module.id)}_model", GenerativeModel("gemini-1.5-flash", system_instruction=new_coding_round.prompt))

        return jsonify({"message": f"Module created successfully ModuleID: {new_module.id}, CodingRoundID: {coding_round_id}"}), 201
    else:
        return jsonify({"message": "Failed to create module"}), 400


@module_blueprint.route(
    "/<int:module_id>", methods=["GET"], endpoint="get_single_module"
)
@token_required
def get_module(user_id, module_id):
    module = ModuleSchema.query.get(module_id)
    if not module:
        return jsonify({"message": "Module not found"}), 404

    quiz = Quiz.query.get(module.quiz_id)
    coding_round = CodingRound.query.get(module.coding_round_id)

    if quiz:
        quiz_questions = [
            {
                "id": q.id,
                "text": q.text,
                "options": json.loads(q.options),
                "correct_answer": q.correct_answer,
            }
            for q in quiz.questions
        ]
        quiz_data = {
            "id": quiz.id,
            "title": quiz.title,
            "description": quiz.description,
            "questions": quiz_questions,
        }
    else:
        quiz_data = None

    if coding_round:
        coding_round_test_cases = [
            {
                "id": tc.id,
                "input": json.loads(tc.input_params),
                # "expected_output": tc.expected_output
            }
            for tc in coding_round.test_cases
        ]
        coding_round_data = {
            "id": coding_round.id,
            "programming_question": coding_round.programming_question,
            "template_code": coding_round.template_code,
            "test_cases": coding_round_test_cases,
            "prompt": coding_round.prompt,
        }
    else:
        coding_round_data = None

    module_data = {
        "id": module.id,
        "title": module.title,
        "quiz": quiz_data,
        "prompt": module.prompt,
        "coding_round": coding_round_data,
        "description": module.description
    }

    return jsonify(module_data), 200
