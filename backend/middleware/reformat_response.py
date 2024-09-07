from functools import wraps
from flask import jsonify, request


# Middleware decorator to reformat API responses
def reformat_response(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        # Call the original route handler
        response_data, status_code = func(*args, **kwargs)

        # Reformat the response
        reformatted_response = {"message": "Success", "data": response_data}

        # Return the reformatted response
        return jsonify(reformatted_response), status_code

    return wrapper
