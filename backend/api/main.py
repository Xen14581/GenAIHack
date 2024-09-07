from flask import Blueprint
from .auth.routes import auth_bp
from .module.routes import module_blueprint
from .chat.routes import chat_blueprint
from .analytics.routes import analytics_bp

main_blueprint = Blueprint("main", __name__)

main_blueprint.register_blueprint(auth_bp, url_prefix="/auth")
main_blueprint.register_blueprint(module_blueprint, url_prefix="/module")
main_blueprint.register_blueprint(chat_blueprint, url_prefix="/chat")
main_blueprint.register_blueprint(analytics_bp, url_prefix="/analytics")
