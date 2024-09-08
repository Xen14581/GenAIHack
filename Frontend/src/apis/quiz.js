import apiUrl from "./baseurl";
import axios from "axios";

const getQuiz = async (token, topic_id) => {
    const response = await axios.get(apiUrl + "/module/" + topic_id + "/quiz/", {headers: {Authorization: token}})
    if (response.status === 200) {
        return response.data
    }
}

const evaluateQuiz = async(token, topic_id, answers) => {
    const response = await axios.post(apiUrl + "/module/" + topic_id + "/quiz/evaluate", answers, {headers: {Authorization: token}})
    if (response.status === 200) {
        return response.data
    }
}

export {getQuiz, evaluateQuiz};