from flask import Blueprint, jsonify
from utils.analytics import calculate_percentile, get_module_counts
from middleware.auth_middleware import token_required
from models import LoginRecord, ModuleEvaluationResult, ModuleSchema

analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.route("/", methods=["GET"])
@token_required
def get_login_count(user_id):

    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({"error": "Invalid User ID"}), 400

    analytics = {}

    # Fetch all login records for the given user ID
    login_records = LoginRecord.query.filter_by(user_id=user_id).all()

    # Create a dictionary to count logins per day
    daily_counts = {}

    for record in login_records:
        day = record.timestamp.date()  # Get the date part of the timestamp
        if day not in daily_counts:
            daily_counts[day] = 0
        daily_counts[day] += 1

    # Convert the dictionary to a list of dicts for JSON response
    login_counts = [
        {"date": day.strftime("%Y-%m-%d"), "count": count}
        for day, count in daily_counts.items()
    ]

    analytics["logins"] = login_counts
    analytics["scores"] = {}
    modules = ModuleSchema.query.all()

    for module in modules:
        user_result: ModuleEvaluationResult | None = (
            ModuleEvaluationResult.query.filter_by(
                user_id=user_id, module_id=module.id
            ).first()
        )
        if user_result:
            percentile = calculate_percentile(
                user_result=user_result, module_id=module.id
            )
            analytics["scores"][module.title] = {
                "queriesAsked": user_result.no_queries_asked,
                "quizScore": user_result.quiz_score,
                "quizQuestions": user_result.quiz_questions,
                "codingProblemsSolved": user_result.coding_round_score,
                "codingProblems": user_result.coding_round_questions,
                "percentile": percentile,
                "percentileDistribution": {},
            }
        else:
            coding_round_count, quiz_question_count = get_module_counts(module.id)
            analytics["scores"][module.title] = {
                "queriesAsked": 0,
                "quizScore": 0,
                "quizQuestions": quiz_question_count,
                "codingProblemsSolved": 0,
                "codingProblems": coding_round_count,
                "percentile": 0,
                "percentileDistribution": {},
            }

    return jsonify(analytics)
