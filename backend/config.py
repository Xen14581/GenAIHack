import os
import google.generativeai as genai


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI", "") # f"sqlite:///{current_wd}/database/sageai.db"
    LAMBDA_FUNCTION_API_URL = os.getenv("LAMBDA_FUNCTION_API_URL", "") # "http://localhost:9000/2015-03-31/functions/function/invocations"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "your_secret_key")
    genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))
