from .main import db


class TestCase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    input_params = db.Column(db.Text, nullable=False)  # JSON-encoded input
    expected_output = db.Column(db.String(255), nullable=False)
    coding_round_id = db.Column(
        db.Integer, db.ForeignKey("coding_round.id"), nullable=False
    )
    coding_round = db.relationship(
        "CodingRound", backref=db.backref("test_cases", lazy=True)
    )


class CodingRound(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    programming_question = db.Column(db.Text, nullable=False)
    template_code = db.Column(db.Text, nullable=False)
    prompt = db.Column(db.Text, primary_key=False)
