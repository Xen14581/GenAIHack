from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from models import db, User, LoginRecord
from utils.auth import encode_token, decode_token

auth_bp = Blueprint("auth", __name__)
bcrypt = Bcrypt()


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if User.query.filter_by(username=username).first():
        return jsonify({"message": "User already exists."}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    user = User.query.filter_by(username=username).first()
    token = encode_token(user.id)
    login_record = LoginRecord(user_id=user.id)
    db.session.add(login_record)
    db.session.commit()

    return (
        jsonify(
            {
                "message": "User created successfully.",
                "username": username,
                "token": token,
            }
        ),
        200,
    )


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password, password):
        token = encode_token(user.id)
        login_record = LoginRecord(user_id=user.id)
        db.session.add(login_record)
        db.session.commit()
        return jsonify({"token": token, "username": username}), 200
    else:
        return jsonify({"message": "Invalid credentials."}), 401
