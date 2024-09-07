from .main import db
import json


class ChatHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    module_id = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(255), nullable=False)
    messages = db.Column(db.Text, nullable=False)  # JSON-encoded messages

    def set_messages(self, messages_list):
        self.messages = json.dumps(messages_list)

    def get_messages(self):
        return json.loads(self.messages)
