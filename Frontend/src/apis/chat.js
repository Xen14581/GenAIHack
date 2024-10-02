import apiUrl from "./baseurl";
import axios from "axios"
import { toast } from 'react-toastify';

const getChatHistory = async (token, topic_id, type) => {
    return await axios.post(
        apiUrl + "/chat/history", 
        {"module_id": topic_id, "type": type}, 
        {headers: {Authorization: token}}
    ).then(response => {
        return response.data.result
    }).catch(err => {
        console.error(err)
        toast.error(err.response.data.message)
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

const stream = async (token, topic_id, type, message, setState, images=null, audio=null) => {
    const formdata = new FormData()
    formdata.append("data", JSON.stringify({
        "module_id": topic_id,
        "type": type,
        "message": message
    }))
    if (images) {
        [...images].forEach(img => {
            formdata.append("files", img);
        });
    }
    if (audio) {
        formdata.append("files", audio, 'audio.mp3')
    }
    try {
        const resp = await fetch(apiUrl + "/chat/stream", {
            method: 'POST',
            headers: {
                Authorization: token
            },
            body: formdata
        });

        if (resp.status >= 400) {
            throw(new Error(resp.statusText))
        }

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
                            history[history.length - 1].parts[0].value += chunk_part_json.message
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
        toast.error(err.message)
        console.error("Error", err)
    }
}

export {getChatHistory, chat, stream};  