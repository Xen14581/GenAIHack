from .main import db


class ModuleSchema(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)
    description=db.Column(db.Text, nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey("quiz.id"), nullable=False)
    coding_round_id = db.Column(
        db.Integer, db.ForeignKey("coding_round.id"), nullable=False
    )
    prompt = db.Column(db.Text, nullable=False)

    quiz = db.relationship("Quiz", backref="modules")
    coding_round = db.relationship("CodingRound", backref="modules")
