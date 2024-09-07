from .main import db


class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(255), nullable=False)
    options = db.Column(db.Text, nullable=False)  # JSON-encoded list of options
    correct_answer = db.Column(db.String(255), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey("quiz.id"), nullable=False)
    quiz = db.relationship("Quiz", backref=db.backref("questions", lazy=True))


class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
