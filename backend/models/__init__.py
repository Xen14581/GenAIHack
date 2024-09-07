from .user import User, LoginRecord
from .module_schema import ModuleSchema
from .coding_round import CodingRound, TestCase  # Import other models here
from .chat_history import ChatHistory
from .quiz import Question, Quiz
from .evaluation_model import (
    ModuleEvaluationResult,
    QuizResult,
    QuestionResult,
    CodingRoundResult,
    TestCaseResult,
)

from .main import db

__all__ = [
    "db",
    "User",
    "LoginRecord",
    "ModuleSchema",
    "CodingRound",
    "ChatHistory",
    "TestCase",
    "Question",
    "Quiz",
    "ModuleEvaluationResult",
    "QuizResult",
    "QuestionResult",
    "CodingRoundResult",
    "TestCaseResult",
]
