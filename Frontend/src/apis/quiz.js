import apiUrl from "./baseurl";
import axios from "axios";
import { toast } from 'react-toastify';

const getQuiz = async (token, topic_id) => {

    return await axios.get(apiUrl + "/module/" + topic_id + "/quiz/", {headers: {Authorization: token}})
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

const evaluateQuiz = async(token, topic_id, answers) => {

    return await axios.post(apiUrl + "/module/" + topic_id + "/quiz/evaluate", answers, {headers: {Authorization: token}})
    .then(response => {
        return response.data
    })
    .catch(err => {
        console.error(err)
        toast.error(err.response.data.message)
        // return {Error: err}
        localStorage.removeItem("user")
        window.location.href = "/home"
    })
}

export {getQuiz, evaluateQuiz};