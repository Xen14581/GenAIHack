import json, os, sqlite3, time, pathlib
from IPython.display import Image
from flask import current_app
from models import ChatHistory
from ffmpy import FFmpeg
import google.generativeai as genai


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
                print("GIF TYPE HISTORY")
                gif_mp4 = part["value"].split(".gif")[0].strip() + ".mp4"
                print(gif_mp4)
                if not os.path.exists(
                    current_app.config.get("ASSETS_DIRECTORY") + gif_mp4
                ):
                    print("Running ffmpeg")
                    ff = FFmpeg(
                        inputs={
                            current_app.config.get("ASSETS_DIRECTORY")
                            + part["value"]: None
                        },
                        outputs={
                            current_app.config.get("ASSETS_DIRECTORY") + gif_mp4: None
                        },
                    )
                    ff.run()

                try:
                    print
                    if not part.get("file_api", None):
                        raise Exception("Uploading the file first time")
                    file_api = genai.get_file(part["file_api"])
                except Exception as e:
                    print(e)
                    print("inexception")
                    file_api = genai.upload_file(
                        path=current_app.config.get("ASSETS_DIRECTORY") + gif_mp4,
                        mime_type="video/mp4",
                        display_name=os.path.basename(gif_mp4),
                    )
                while True:
                    print("state:", str(file_api.state))
                    if str(file_api.state) == "2":
                        break
                    else:
                        time.sleep(5)
                        file_api = genai.get_file(file_api.name)
                        print("INWHILE FILE_API", file_api)

                new_db_message["parts"].append(
                    {"type": "gif", "value": part["value"], "file_api": file_api.name}
                )
                new_gemini_message["parts"].append(file_api)

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

            if part["type"] == "gif":
                print("GIF TYPE Latest chat")
                gif_mp4 = part["value"].split(".gif")[0].strip() + ".mp4"
                print(gif_mp4)
                if not os.path.exists(
                    current_app.config.get("ASSETS_DIRECTORY") + gif_mp4
                ):
                    print("Running ffmpeg")
                    ff = FFmpeg(
                        inputs={
                            current_app.config.get("ASSETS_DIRECTORY")
                            + part["value"]: None
                        },
                        outputs={
                            current_app.config.get("ASSETS_DIRECTORY") + gif_mp4: None
                        },
                    )
                    ff.run()
                print("RAN FFMPEg")
                try:
                    if not part.get("file_api", None):
                        raise Exception("Uploading the file first time")
                    file_api = genai.get_file(part["file_api"])
                except:
                    file_api = genai.upload_file(
                        path=current_app.config.get("ASSETS_DIRECTORY") + gif_mp4,
                        mime_type="video/mp4",
                        display_name=os.path.basename(gif_mp4),
                    )
                while True:
                    print("state:", str(file_api.state))
                    if str(file_api.state) == "2":
                        break
                    else:
                        time.sleep(5)
                        file_api = genai.get_file(file_api.name)
                        print("INWHILE in latest FILE_API", file_api)

                latest_db_message["parts"].append(
                    {"type": "gif", "value": part["value"], "file_api": file_api.name}
                )
                latest_gemini_message["parts"].append(file_api)

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
