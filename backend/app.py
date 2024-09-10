from flask import Flask
from dotenv import load_dotenv

load_dotenv()

from flask_cors import CORS
from config import Config
from models import db, ModuleSchema, CodingRound
from api import main_blueprint
from google.generativeai import GenerativeModel
from utils.modules import init_modules

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, resources={r"/*": {"origins": "*"}})

    db.init_app(app)

    with app.app_context():
        db.create_all()
        init_modules()

    app.register_blueprint(main_blueprint)

    @app.route("/", methods=["GET"])
    def server_status():
        return {"message": "Server is working"}, 200

    # @app.route('/protected', methods=['GET'])
    # @token_required
    # def protected_route(user_id):
    #     return jsonify({'message': f'Hello user {user_id}, this is a protected route.'}), 200

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", debug=False)
