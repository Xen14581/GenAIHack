from flask import request, jsonify
from utils.auth import decode_token


def token_required(f):
    def decorator(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"message": "Token is missing!"}), 403

        user_id = decode_token(token)
        if isinstance(user_id, str):
            return jsonify({"message": user_id}), 403

        return f(user_id, *args, **kwargs)

    return decorator
