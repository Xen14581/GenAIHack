from unittest import result
from flask import Blueprint, request, jsonify, current_app
from models import (
    db,
    CodingRound,
    TestCase,
    ModuleSchema,
    CodingRoundResult,
    TestCaseResult,
    ModuleEvaluationResult,
)
from .executor import execute_code
import json, requests
from middleware.auth_middleware import token_required
from utils.analytics import get_module_counts
coding_round_blueprint = Blueprint("coding_round", __name__)


@coding_round_blueprint.route("/", methods=["GET"])
@token_required
def get_coding_round(user_id, module_id):

    module = ModuleSchema.query.get(module_id)
    if not module:
        return jsonify({"message": "Module not found"}), 404

    coding_round = CodingRound.query.get(module.coding_round_id)
    if coding_round is None:
        return jsonify({"message": "Coding round not found"}), 404

    test_cases = TestCase.query.filter_by(coding_round_id=coding_round.id).all()
    test_cases_list = [
        {"input": json.loads(tc.input_params), "expected_output": tc.expected_output}
        for tc in test_cases
    ]
    response = {
        "id": coding_round.id,
        "programming_question": coding_round.programming_question,
        "template_code": coding_round.template_code,
        "test_cases": test_cases_list,
        "prompt": coding_round.prompt,
    }

    return jsonify(response), 200


@coding_round_blueprint.route("/create", methods=["POST"])
def create_coding_round():
    data = request.json
    new_coding_round = CodingRound(
        programming_question=data["programming_question"],
        template_code=data["template_code"],
        prompt=data["prompt"],
    )
    db.session.add(new_coding_round)
    db.session.commit()

    for tc in data["test_cases"]:
        test_case = TestCase(
            input_params=json.dumps(tc["input"]),
            expected_output=tc["expected_output"],
            coding_round=new_coding_round,
        )
        db.session.add(test_case)

    db.session.commit()
    return jsonify({"message": "Coding round created successfully"}), 201


@coding_round_blueprint.route("/test", methods=["POST"], endpoint="test_coding_round")
@token_required
def test_coding_round(user_id, module_id):
    data = request.json
    code = data.get("code")
    input_params = data.get("input_params")
    module = ModuleSchema.query.get(module_id)
    if not module:
        return jsonify({"message": "Module not found"}), 404

    coding_round = CodingRound.query.get(module.coding_round_id)
    if coding_round is None:
        return jsonify({"message": "Coding round not found"}), 404

    # lambda_payload = {
    #     "language": "python",
    #     "code": code,
    #     "inputs": "\n".join([str(param) for param in input_params]) + "\n",
    # }
    try:
    #     response = requests.post(
    #         current_app.config["LAMBDA_FUNCTION_API_URL"],
    #         data=json.dumps(lambda_payload),
    #         headers={"Content-Type": "application/json"},
    #     )
    #     lambda_response = response.json()

        data = execute_code(code=code, input_params="\n".join([str(param) for param in input_params]) + "\n")
        return jsonify(data), 200
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500
    # return jsonify(lambda_response)


# @coding_round_blueprint.route(
#     "/evaluate", methods=["POST"], endpoint="evaluate_coding_round"
# )
# @token_required
# def evaluate_coding_round(user_id, module_id):
#     data = request.json
#     code = data.get("code")
#     module = ModuleSchema.query.get(module_id)
#     if not module:
#         return jsonify({"message": "Module not found"}), 404

#     coding_round = CodingRound.query.get(module.coding_round_id)
#     if coding_round is None:
#         return jsonify({"message": "Coding round not found"}), 404

#     test_cases = TestCase.query.filter_by(coding_round_id=coding_round.id).all()
#     test_cases_list = [
#         {"input": json.loads(tc.input_params), "expected_output": tc.expected_output}
#         for tc in test_cases
#     ]
#     # test_cases = data.get('test_cases')
#     results = []
#     for testcase in test_cases_list:
#         try:
#             result = execute_code(code, testcase["input"])
#             if not result.get("error", ""):
#                 if (
#                     result["result"].replace("\n", " ").strip()
#                     == testcase["expected_output"]
#                 ):
#                     testcase["pass"] = True
#                 else:
#                     testcase["pass"] = False

#         except:
#             print("Error in executing api")
#     return jsonify(results), 200


@coding_round_blueprint.route(
    "/evaluate", methods=["POST"], endpoint="evaluate_coding_round"
)
@token_required
def evaluate_coding_round(user_id, module_id):
    data = request.json
    code = data.get("code")
    print(code)
    module = ModuleSchema.query.get(module_id)

    if not module:
        return jsonify({"message": "Module not found"}), 404

    coding_round = CodingRound.query.get(module.coding_round_id)
    if coding_round is None:
        return jsonify({"message": "Coding round not found"}), 404

    test_cases = TestCase.query.filter_by(coding_round_id=coding_round.id).all()
    test_cases_list = [
        {
            "id": tc.id,
            "input": "\n".join([str(param) for param in list(json.loads(tc.input_params))]) + "\n",
            "expected_output": tc.expected_output,
        }
        for tc in test_cases
    ]
    print(test_cases_list)
    # Initialize the score
    score = 0
    total_test_cases = len(test_cases_list)

    module_evaluation = ModuleEvaluationResult.query.filter_by(
        user_id=user_id, module_id=module_id
    ).first()

    if not module_evaluation:
        
        coding_round_count, quiz_question_count = get_module_counts(
                module_id=module_id
            )
        module_evaluation = ModuleEvaluationResult(
            user_id=user_id,
            module_id=module_id,
            coding_round_questions=coding_round_count,
            quiz_questions=quiz_question_count,
        )
        db.session.add(module_evaluation)
        db.session.commit()

    # Ensure CodingRoundResult record exists
    coding_round_result = CodingRoundResult.query.filter_by(
        user_id=user_id, coding_round_id=coding_round.id
    ).first()
    if not coding_round_result:
        coding_round_result = CodingRoundResult(
            user_id=user_id, coding_round_id=coding_round.id, score=0
        )
        db.session.add(coding_round_result)
        db.session.commit()

    # Process each test case
    results = []
    for testcase in test_cases_list:
        try:
            result = execute_code(code, testcase["input"])
            passed = False
            if not result.get("error", ""):
                if (
                    result["result"].replace("\n", " ").strip()
                    == testcase["expected_output"]
                ):
                    passed = True

            # Create TestCaseResult

            test_case_result = TestCaseResult.query.filter_by(
                coding_round_result_id=coding_round_result.id,
                test_case_id=testcase["id"],
            ).first()
            if not test_case_result:
                test_case_result = TestCaseResult(
                    coding_round_result_id=coding_round_result.id,
                    test_case_id=testcase[
                        "id"
                    ],  # Assuming test_case.id corresponds to index + 1
                    passed=passed,
                    user_output=result["result"].replace("\n", " ").strip(),
                )
                db.session.add(test_case_result)

            else:
                test_case_result.passed = passed
                test_case_result.user_output = (
                    result["result"].replace("\n", " ").strip()
                )

            db.session.commit()

            # Update score
            if passed:
                score += 1

            results.append(
                {
                    "input": testcase["input"],
                    "expected_output": testcase["expected_output"],
                    "user_output": result["result"].replace("\n", " ").strip(),
                    "pass": passed,
                }
            )

        except Exception as e:
            print(f"Error in executing code: {e}")
            results.append(
                {
                    "input": testcase["input"],
                    "expected_output": testcase["expected_output"],
                    "user_output": "",
                    "pass": False,
                }
            )

    # Update CodingRoundResult with the score
    coding_round_result.score = (
        (score / total_test_cases) * 100 if total_test_cases > 0 else 0
    )
    module_evaluation.coding_round_score = score
    module_evaluation.coding_round_percentage = coding_round_result.score
    module_evaluation.coding_round_questions=total_test_cases
    module_evaluation.overall_percentage = (coding_round_result.score + module_evaluation.quiz_percentage)/2
    db.session.commit()
    return (
        jsonify(
            {
                "results": results,
                "score": coding_round_result.score,
                "total_test_cases": total_test_cases,
                "percentage_score": coding_round_result.score,
            }
        ),
        200,
    )
