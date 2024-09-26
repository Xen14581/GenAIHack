from flask import Blueprint, request, jsonify, current_app
from .coding_round.routes import coding_round_blueprint
from .quiz.routes import quiz_blueprint
from middleware.auth_middleware import token_required
from models import (
    ChatHistory,
    db,
    ModuleSchema,
    CodingRound,
    TestCase,
    Quiz,
    Question,
    CodingRoundResult,
    ModuleEvaluationResult,
    QuestionResult,
    QuizResult,
    TestCaseResult,
    LoginRecord,
)
import json
from google.generativeai import GenerativeModel
from utils.modules import (
    show_visualizations,
    generate_custom_visualization_on_user_data,
    generate_example_image,
)
from utils.analytics import calculate_percentile, get_module_counts

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
        module_list.append(
            {"id": module.id, "title": module.title, "description": module.description}
        )

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

        current_app.config.setdefault(
            f"module_{str(new_module.id)}_model",
            GenerativeModel(
                "gemini-1.5-flash",
                system_instruction=new_module.prompt,
                tools=[
                    generate_example_image,
                    generate_custom_visualization_on_user_data,
                ],
            ),
        )
        current_app.config.setdefault(
            f"coding_round_{str(new_module.id)}_model",
            GenerativeModel(
                "gemini-1.5-flash", system_instruction=new_coding_round.prompt
            ),
        )

        return (
            jsonify(
                {
                    "message": f"Module created successfully ModuleID: {new_module.id}, CodingRoundID: {coding_round_id}"
                }
            ),
            201,
        )
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
        "description": module.description,
    }

    return jsonify(module_data), 200


@module_blueprint.route(
    "/<int:module_id>", methods=["DELETE"], endpoint="module_delete"
)
@token_required
def module_delete(user_id, module_id):
    try:
        module: ModuleSchema = ModuleSchema.query.filter_by(id=module_id).first()

        if not module:
            return (
                jsonify(
                    {
                        "message": "OK",
                        "result": f"Module with id {str(module_id)} doesn't exist",
                    }
                ),
                400,
            )

        quiz: Quiz = Quiz.query.filter_by(id=module.quiz_id).first()
        questions: list[Question] = Question.query.filter_by(quiz_id=quiz.id).all()
        quiz_results: list[QuizResult] = QuizResult.query.filter_by(
            quiz_id=quiz.id
        ).all()
        question_results: list[QuestionResult] = []
        for quiz_result in quiz_results:
            onequizquestionresult = QuestionResult.query.filter_by(
                quiz_result_id=quiz_result.id
            ).all()
            question_results.extend(onequizquestionresult)

        coding_round: CodingRound = CodingRound.query.filter_by(
            id=module.coding_round_id
        ).first()
        test_cases: list[TestCase] = TestCase.query.filter_by(
            coding_round_id=coding_round.id
        ).all()
        coding_round_results: list[CodingRoundResult] = (
            CodingRoundResult.query.filter_by(coding_round_id=coding_round.id).all()
        )
        test_case_Results: list[TestCaseResult] = []
        for coding_round_result in coding_round_results:
            onecodingroundtestcaseresult = TestCaseResult.query.filter_by(
                coding_round_result_id=coding_round_result.id
            ).all()
            test_case_Results.extend(onecodingroundtestcaseresult)

        module_result: list[ModuleEvaluationResult] = (
            ModuleEvaluationResult.query.filter_by(module_id=module_id).all()
        )
        chat_history: list[ChatHistory] = ChatHistory.query.filter_by(
            module_id=module_id
        ).all()

        for entity in [
            *test_case_Results,
            *question_results,
            *quiz_results,
            *coding_round_results,
            *module_result,
            *chat_history,
            *test_cases,
            *questions,
            coding_round,
            quiz,
            module,
        ]:

            db.session.delete(entity)

        db.session.commit()
        current_app.config.pop(f"module_{str(module_id)}_model", None)
        current_app.config.pop(f"coding_round_{str(module_id)}_model", None)
        return (
            jsonify(
                {
                    "message": "OK",
                    "result": f"Deleted module: {module_id}",
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@module_blueprint.route(
    "/<int:module_id>/prompt", methods=["POST"], endpoint="change_prompt"
)
@token_required
def change_prompt(user_id, module_id):
    data = request.json
    module = ModuleSchema.query.get(module_id)
    if not module:
        return jsonify({"message": "Module not found"}), 404

    module.prompt = data["prompt"]
    db.session.commit()
    current_app.config.pop(f"module_{str(module_id)}_model")
    current_app.config.setdefault(
        f"module_{str(module_id)}_model",
        GenerativeModel(
            "gemini-1.5-flash",
            system_instruction=data["prompt"],
            tools=[generate_example_image, generate_custom_visualization_on_user_data],
        ),
    )
    return jsonify({"message": "Done"}), 200


@module_blueprint.route(
    "/<int:module_id>/progress", methods=["GET"], endpoint="get_progress"
)
@token_required
def get_progress(user_id, module_id):
    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({"error": "Invalid User ID"}), 400

    # analytics = {}
    # analytics["scores"] = {}
    module = ModuleSchema.query.get(module_id)

    user_result: ModuleEvaluationResult | None = ModuleEvaluationResult.query.filter_by(
        user_id=user_id, module_id=module.id
    ).first()
    if user_result:
        percentile = calculate_percentile(user_result=user_result, module_id=module.id)
        analytics = {
            "queriesAsked": user_result.no_queries_asked,
            "quizScore": user_result.quiz_score,
            "quizQuestions": user_result.quiz_questions,
            "codingProblemsSolved": user_result.coding_round_score,
            "codingProblems": user_result.coding_round_questions,
            "progress": user_result.progress,
            "percentile": percentile,
        }
    else:
        coding_round_count, quiz_question_count = get_module_counts(module.id)
        analytics = {
            "queriesAsked": 0,
            "quizScore": 0,
            "quizQuestions": quiz_question_count,
            "codingProblemsSolved": 0,
            "codingProblems": coding_round_count,
            "progress": "Chat",
            "percentile": 0,
        }
        user_result = ModuleEvaluationResult(
            user_id=user_id,
            module_id=module.id,
            no_queries_asked=0,
            coding_round_questions=coding_round_count,
            quiz_questions=quiz_question_count,
            progress="Chat",
        )
        db.session.add(user_result)
    db.session.commit()

    return jsonify(analytics)


@module_blueprint.route(
    "/<int:module_id>/progress", methods=["POST"], endpoint="set_progress"
)
@token_required
def set_progress(user_id, module_id):
    try:
        user_id = int(user_id)
        data = request.json
    except ValueError:
        return jsonify({"error": "Invalid User ID"}), 400

    module = ModuleSchema.query.get(module_id)

    user_result: ModuleEvaluationResult | None = ModuleEvaluationResult.query.filter_by(
        user_id=user_id, module_id=module.id
    ).first()
    if user_result:
        user_result.progress = data["progress"]

    else:
        coding_round_count, quiz_question_count = get_module_counts(module.id)
        user_result = ModuleEvaluationResult(
            user_id=user_id,
            module_id=data["module_id"],
            no_queries_asked=1,
            coding_round_questions=coding_round_count,
            quiz_questions=quiz_question_count,
            progress=data["progress"],
        )
        db.session.add(user_result)
    db.session.commit()
    return {"message": "Ok"}, 200
