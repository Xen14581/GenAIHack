from models import (
    ModuleEvaluationResult,
    ModuleSchema,
    CodingRound,
    Question,
    Quiz,
    TestCase,
)


def calculate_percentile(user_result, module_id):
    # Retrieve the user's overall percentage

    user_percentage = user_result.overall_percentage

    # Retrieve all results for the given module_id
    all_results = ModuleEvaluationResult.query.filter_by(module_id=module_id).all()

    # Extract percentages
    percentages = [result.overall_percentage for result in all_results]

    # Sort percentages
    sorted_percentages = sorted(percentages)

    # Calculate the rank of the user's percentage
    rank = sum(p < user_percentage for p in sorted_percentages) + 1
    percentile = (rank / len(sorted_percentages)) * 100

    return percentile


def get_module_counts(module_id):
    # Fetch the module schema
    module: ModuleSchema = ModuleSchema.query.get(module_id)
    if not module:
        return None, None

    coding_round = CodingRound.query.filter_by(id=module.coding_round_id).first()
    coding_round_count = TestCase.query.filter_by(
        coding_round_id=coding_round.id
    ).count()
    # Count quiz questions
    quiz = Quiz.query.filter_by(id=module.quiz_id).first()
    quiz_question_count = Question.query.filter_by(quiz_id=quiz.id).count()

    return coding_round_count, quiz_question_count
