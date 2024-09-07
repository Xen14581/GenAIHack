from flask import current_app
import requests, json


def execute_code(code, input_params):
    lambda_payload = {
        "language": "python",
        "code": code,
        "inputs": "\n".join([str(param) for param in input_params]) + "\n",
    }
    try:
        response = requests.post(
            current_app.config["LAMBDA_FUNCTION_API_URL"],
            data=json.dumps(lambda_payload),
            headers={"Content-Type": "application/json"},
        )
        lambda_response = response.json()

    except requests.RequestException as e:
        return {"error": str(e)}

    return lambda_response
