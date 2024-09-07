from .main import db


class ModuleEvaluationResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    module_id = db.Column(db.Integer, db.ForeignKey("module_schema.id"), nullable=False)
    
    quiz_score = db.Column(
        db.Integer, nullable=False,default=0
    )
    quiz_questions = db.Column(
        db.Integer, nullable=False,default=0
    )
    quiz_percentage = db.Column(
        db.Float, nullable=False,default=0
    )
    coding_round_score = db.Column(
        db.Integer, nullable=False, default=0
    )
    coding_round_questions = db.Column(
        db.Integer, nullable=False, default=0
    )
    coding_round_percentage = db.Column(
        db.Float, nullable=False,default=0
    )
    
    overall_percentage=db.Column(
        db.Float, nullable=False, default=0
    )
    no_queries_asked = db.Column(
        db.Integer, nullable=False, default=0
    )

    user = db.relationship(
        "User", backref=db.backref("module_evaluation_results", lazy=True)
    )
    module = db.relationship(
        "ModuleSchema", backref=db.backref("evaluation_results", lazy=True)
    )


class CodingRoundResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    coding_round_id = db.Column(
        db.Integer, db.ForeignKey("coding_round.id"), nullable=False
    )
    score = db.Column(
        db.Float, nullable=False
    )  # or db.Integer, depending on how you store scores

    user = db.relationship(
        "User", backref=db.backref("coding_round_results", lazy=True)
    )
    coding_round = db.relationship(
        "CodingRound", backref=db.backref("results", lazy=True)
    )


class TestCaseResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    coding_round_result_id = db.Column(
        db.Integer, db.ForeignKey("coding_round_result.id"), nullable=False
    )
    test_case_id = db.Column(db.Integer, db.ForeignKey("test_case.id"), nullable=False)
    passed = db.Column(db.Boolean, nullable=False)  # whether the test case was passed
    user_output = db.Column(db.Text, nullable=False)  # user's output for the test case

    coding_round_result = db.relationship(
        "CodingRoundResult", backref=db.backref("test_case_results", lazy=True)
    )
    test_case = db.relationship(
        "TestCase", backref=db.backref("test_case_results", lazy=True)
    )


class QuizResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey("quiz.id"), nullable=False)
    score = db.Column(
        db.Float, nullable=False
    )  # or db.Integer, depending on how you store scores

    user = db.relationship("User", backref=db.backref("quiz_results", lazy=True))
    quiz = db.relationship("Quiz", backref=db.backref("results", lazy=True))


class QuestionResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quiz_result_id = db.Column(
        db.Integer, db.ForeignKey("quiz_result.id"), nullable=False
    )
    question_id = db.Column(db.Integer, db.ForeignKey("question.id"), nullable=False)
    selected_option = db.Column(
        db.String(255), nullable=False
    )  # User's selected option
    correct = db.Column(
        db.Boolean, nullable=False
    )  # whether the selected option was correct

    quiz_result = db.relationship(
        "QuizResult", backref=db.backref("question_results", lazy=True)
    )
    question = db.relationship(
        "Question", backref=db.backref("question_results", lazy=True)
    )
