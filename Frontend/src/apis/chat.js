import apiUrl from "./baseurl";
import axios from "axios"

const getChatHistory = async (token, topic_id, type) => {
    return await axios.post(
        apiUrl + "/chat/history", 
        {"module_id": topic_id, "type": type}, 
        {headers: {Authorization: token}}
    ).then(response => {
        return response.data.result
    }).catch(() => {
        localStorage.removeItem("user")
        window.location.href = "/auth/signIn"
    });
}

const chat = async (token, topic_id, type, message) => {
    const response = await axios.post(apiUrl + "/chat/", {module_id: topic_id, type: type, message: message}, {headers: {Authorization: token}})
    if (response.status === 200) {
        return response.data.result
    } else {
        localStorage.removeItem("user")
        window.location.href = "/auth/signIn"
    }
}

const stream = async (token, topic_id, type, message, setState) => {
    try {
        const resp = await fetch(apiUrl + "/chat/stream", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify({
                "module_id": topic_id,
                "type": type,
                "message": message
            })
        });

        const reader = resp.body.getReader();
        const decoder = new TextDecoder("utf-8");

        let buffer = ""

        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                break;
            }

            const chunk = decoder.decode(value, {stream: true});
            buffer += chunk;

            while (buffer.includes("\n\n")) {
                const newlineindex = buffer.indexOf("\n\n")
                const chunk_part = buffer.slice(0, newlineindex)
                buffer = buffer.slice(newlineindex + 1)
                const chunk_part_r = chunk_part.trim().replace("data: ", "")

                if (chunk_part_r) {
                    try {
                        let chunk_part_json = JSON.parse(chunk_part_r);
                        setState(prevState => { 
                            let history = prevState.history
                            history[history.length - 1].parts[0] += chunk_part_json.message
                            return { 
                                ...prevState, 
                                history: history
                            }
                        });
                    } catch (error) {
                        console.error("Error parsing JSON: ", error)
                    } 
                }
            }
        }
    } catch (err) {
        console.error("Error", err)
    }
}

export {getChatHistory, chat, stream};  