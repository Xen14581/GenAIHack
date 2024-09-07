from flask import Blueprint, request, jsonify
from middleware.auth_middleware import token_required
from models import (
    Quiz,
    Question,
    ModuleSchema,
    ModuleEvaluationResult,
    QuestionResult,
    QuizResult,
    db,
)
import json
from utils.analytics import get_module_counts
# from .evaluator import evaluate_quiz

quiz_blueprint = Blueprint("quiz", __name__)


@quiz_blueprint.route("/", methods=["GET"], endpoint="get_quiz")
@token_required
def list_modules(user_id, module_id):
    # Query all modules
    module = ModuleSchema.query.get(module_id)
    if not module:
        return jsonify({"message": "Module not found"}), 404

    # Fetch the associated quiz
    quiz = Quiz.query.get(module.quiz_id)
    if not quiz:
        return jsonify({"message": "Quiz not found"}), 404

    # Prepare the quiz details
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

    return jsonify(quiz_data), 200


@quiz_blueprint.route("/create", methods=["POST"])
def create_quiz():
    data = request.json
    new_quiz = Quiz(title=data["title"], description=data["description"])
    db.session.add(new_quiz)
    db.session.commit()

    for q in data["quiz"]["questions"]:
        question = Question(
            text=q["text"],
            options=json.dumps(q["options"]),
            correct_answer=q["correct_answer"],
            quiz=new_quiz,
        )
        db.session.add(question)

    db.session.commit()
    return jsonify({"message": "Quiz created successfully"}), 201


# @quiz_blueprint.route("/evaluate", methods=["POST"])
# @token_required
# def evaluate_quiz(user_id, module_id):
#     data = request.json
#     # Implement the quiz evaluation logic here
#     # For example:
#     user_answers = data
#     module = ModuleSchema.query.get(module_id)
#     if not module:
#         return jsonify({"message": "Module not found"}), 404

#     # Fetch the quiz and its questions from the database
#     quiz = Quiz.query.get(module.quiz_id)
#     if not quiz:
#         raise ValueError("Quiz not found")

#     # Create a dictionary to map question IDs to their correct answers
#     correct_answers = {
#         question.id: question.correct_answer for question in quiz.questions
#     }
#     # Initialize the score
#     score = 0
#     total_questions = len(correct_answers)

#     # Check the user's answers
#     for answer in user_answers:
#         question_id = answer["id"]
#         user_answer = answer["answer"]

#         # Ensure the question ID exists in the quiz
#         if question_id not in correct_answers:
#             continue
#             # raise ValueError(f"Question with ID {question_id} not found in quiz")

#         # Compare the user's answer with the correct answer
#         if user_answer == correct_answers[question_id]:
#             score += 1
#             correct_answers.pop(question_id)

#     # Calculate the percentage score
#     percentage_score = (score / total_questions) * 100 if total_questions > 0 else 0

#     return {
#         "score": score,
#         "total_questions": total_questions,
#         "percentage_score": percentage_score,
#     }


@quiz_blueprint.route("/evaluate", methods=["POST"])
@token_required
def evaluate_quiz(user_id, module_id):
    data = request.json
    user_answers = data
    module = ModuleSchema.query.get(module_id)

    if not module:
        return jsonify({"message": "Module not found"}), 404

    # Fetch the quiz and its questions from the database
    quiz = Quiz.query.get(module.quiz_id)
    if not quiz:
        return jsonify({"message": "Quiz not found"}), 404

    # Create a dictionary to map question IDs to their correct answers
    correct_answers = {
        question.id: question.correct_answer for question in quiz.questions
    }
    if len(list(correct_answers.keys())) != len(user_answers):
        return jsonify({"message": "No of questions do not match"}), 404
    # Initialize the score
    score = 0
    total_questions = len(correct_answers)

    # Ensure the module evaluation result exists
    module_evaluation = ModuleEvaluationResult.query.filter_by(
        user_id=user_id, module_id=module_id
    ).first()

    if not module_evaluation:
        coding_round_count, quiz_question_count = get_module_counts(
                module_id=data["module_id"]
            )
        module_evaluation = ModuleEvaluationResult(
            user_id=user_id,
            module_id=module_id,
            coding_round_questions=coding_round_count,
            quiz_questions=quiz_question_count,
        )
        db.session.add(module_evaluation)
        db.session.commit()

    # Ensure the quiz result does not exist already
    quiz_result = QuizResult.query.filter_by(
        user_id=user_id, quiz_id=module.quiz_id
    ).first()

    if not quiz_result:
        quiz_result = QuizResult(
            user_id=user_id, quiz_id=module.quiz_id, score=0
        )
        db.session.add(quiz_result)
        db.session.commit()

    # Process each user answer
    for answer in user_answers:
        question_id = answer.get("id")
        user_answer = answer.get("answer")
        if question_id in correct_answers:
            is_correct = user_answer == correct_answers[question_id]
            if is_correct:
                score += 1
            question_result = QuestionResult.query.filter_by(
                quiz_result_id=quiz_result.id, question_id=question_id
            ).first()
            if not question_result:

                # Create QuestionResult
                question_result = QuestionResult(
                    quiz_result_id=quiz_result.id,
                    question_id=question_id,
                    selected_option=user_answer,
                    correct=is_correct,
                )
                db.session.add(question_result)

            else:
                question_result.selected_option = user_answer
                question_result.correct = is_correct

            db.session.commit()

            # Remove the question from correct answers to avoid double counting
            correct_answers.pop(question_id)

    # Update QuizResult with the score
    quiz_result.score = (score / total_questions) * 100 if total_questions > 0 else 0
    db.session.commit()

    # Update ModuleEvaluationResult with the score
    module_evaluation.quiz_score = score
    module_evaluation.quiz_percentage = quiz_result.score
    module_evaluation.quiz_questions=total_questions
    module_evaluation.overall_percentage = (module_evaluation.coding_round_percentage + quiz_result.score)/2
    db.session.commit()

    return jsonify(
        {
            "score": quiz_result.score,
            "total_questions": total_questions,
            "percentage_score": quiz_result.score,
        }
    )
