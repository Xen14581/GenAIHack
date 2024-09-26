import json, os, sqlite3
from IPython.display import Image
from flask import current_app
from models import ChatHistory
import pathlib


def message_appender(chat_history: list, new_message: list, message_type: str) -> str:
    valid_message_types = ["user", "model"]

    # Check if the provided message_type is valid
    if message_type not in valid_message_types:
        raise ValueError(
            f"Invalid message_type: {message_type}. Must be one of {valid_message_types}."
        )

    json_chat_history = chat_history

    json_chat_history.append({"role": message_type, "parts": new_message})
    return json_chat_history


def combine_history_and_messages(
    chat_history: ChatHistory, current_message: str | None = None, files: list = []
):
    chat_history_messages = json.loads(chat_history.messages)
    gemini_format = []
    dbstore_format = []

    for message in chat_history_messages:
        new_gemini_message = {"role": message["role"], "parts": []}
        new_db_message = {"role": message["role"], "parts": []}
        for part in message["parts"]:
            if part["type"] == "text":
                new_db_message["parts"].append({"type": "text", "value": part["value"]})
                new_gemini_message["parts"].append(part["value"])
            if part["type"] == "image":
                new_db_message["parts"].append(
                    {"type": "image", "value": part["value"]}
                )
                image = Image(
                    filename=current_app.config.get("ASSETS_DIRECTORY") + part["value"]
                )
                new_gemini_message["parts"].append(image)
            if part["type"] == "audio":
                new_db_message["parts"].append(
                    {"type": "audio", "value": part["value"]}
                )

                sound = pathlib.Path(
                    current_app.config.get("ASSETS_DIRECTORY") + part["value"]
                ).read_bytes()

                new_gemini_message["parts"].append(
                    {"mime_type": "audio/mp3", "data": sound},
                )

            if part["type"] == "gif":
                new_db_message["parts"].append({"type": "gif", "value": part["value"]})
                gif = pathlib.Path(
                    current_app.config.get("ASSETS_DIRECTORY") + part["value"]
                ).read_bytes()

                new_gemini_message["parts"].append(
                    {"mime_type": "video/mp4", "data": gif},
                )

        gemini_format.append(new_gemini_message)
        dbstore_format.append(new_db_message)

    if current_message or len(files):
        latest_db_message = {"role": "user", "parts": []}
        latest_gemini_message = {"role": "user", "parts": []}

        if current_message:
            latest_db_message["parts"].append(
                {"type": "text", "value": current_message}
            )
            latest_gemini_message["parts"].append(current_message)

        for file in files:
            if file["type"] == "audio":
                latest_db_message["parts"].append(
                    {"type": "audio", "value": file["file_path"]}
                )

                sound = pathlib.Path(
                    current_app.config.get("ASSETS_DIRECTORY") + file["file_path"]
                ).read_bytes()

                latest_gemini_message["parts"].append(
                    {"mime_type": "audio/mp3", "data": sound},
                )

            if file["type"] == "image":
                latest_db_message["parts"].append(
                    {"type": "image", "value": file["file_path"]}
                )
                image = Image(
                    filename=current_app.config.get("ASSETS_DIRECTORY")
                    + file["file_path"]
                )
                latest_gemini_message["parts"].append(image)

            if file["type"] == "gif":
                latest_db_message["parts"].append(
                    {"type": "image", "value": file["file_path"]}
                )
                image = Image(
                    filename=current_app.config.get("ASSETS_DIRECTORY")
                    + file["file_path"]
                )
                latest_gemini_message["parts"].append(image)
        dbstore_format.append(latest_db_message)
        gemini_format.append(latest_gemini_message)
    return gemini_format, dbstore_format


def store_chat_history(user_id, module_id, chat_type, role, message: list):
    conn = sqlite3.connect(
        os.getenv("SQLALCHEMY_DATABASE_URI", "").replace("sqlite:///", "")
    )
    cursor = conn.cursor()
    select_query = """
    SELECT id, messages FROM chat_history
    WHERE user_id = ? AND module_id = ? AND type = ?
    """
    cursor.execute(select_query, (user_id, module_id, chat_type))
    chat_result = cursor.fetchone()
    if not chat_result:
        messages = json.dumps(
            [
                {"role": role, "parts": message},
            ]
        )
        insert_query = """
        INSERT INTO chat_history (user_id, module_id, type, messages)
        VALUES (?, ?, ?, ?)
        """
        cursor.execute(insert_query, (user_id, module_id, chat_type, messages))
        return_messages = message
    else:
        chat_id, existing_messages = chat_result
        updated_messages = message_appender(
            list(json.loads(existing_messages)), message, role
        )
        return_messages = updated_messages

        update_query = """
            UPDATE chat_history
            SET messages = ?
            WHERE id = ?
            """
        cursor.execute(update_query, (json.dumps(updated_messages), chat_id))

    conn.commit()

    # # Close the connection
    cursor.close()
    conn.close()
    return return_messages
