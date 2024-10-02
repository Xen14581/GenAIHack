import apiUrl from "./baseurl";
import axios from "axios";
import { toast } from 'react-toastify';

const getTopicProgress = async (token, topic_id) => {
    return await axios.get(apiUrl + "/module/" + topic_id + "/progress", {headers: {Authorization: token}})
    .then(response => {
        return response.data
    })
    .catch(err => {
        console.error(err)
        toast.error(err.response.data.message)
        localStorage.removeItem("user")
        window.location.href = "/home"
    })
}

const setTopicProgress = async (token, topic_id, progress) => {
    return await axios.post(apiUrl + "/module/" + topic_id + "/progress", {progress: progress}, {headers: {Authorization: token}})
    .then(response => {
        return response.data
    })
    .catch(err => {
        console.error(err)
        toast.error(err.response.data.message)
        localStorage.removeItem("user")
        window.location.href = "/home"
    })
}

export {getTopicProgress, setTopicProgress}