import json, os, sqlite3


def message_appender(chat_history: list, new_message: str, message_type: str) -> str:
    valid_message_types = ["user", "model"]

    # Check if the provided message_type is valid
    if message_type not in valid_message_types:
        raise ValueError(
            f"Invalid message_type: {message_type}. Must be one of {valid_message_types}."
        )

    json_chat_history = chat_history

    json_chat_history.append({"role": message_type, "parts": [new_message]})
    return json_chat_history




def store_chat_history(
    user_id, module_id, chat_type, role, message
):
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
                {"role": role, "parts": [message]},
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
        updated_messages = message_appender(list(json.loads(existing_messages)), message, role)
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
