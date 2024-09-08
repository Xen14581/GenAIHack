import apiUrl from "./baseurl";
import axios from "axios";

const getCode = async (token, topic_id) => {
    const response = await axios.get(apiUrl + "/module/" + topic_id + "/coding_round/", {headers: {Authorization: token}})
    if (response.status === 200) {
        return response.data
    }
}

const evaluateCode = async (token, topic_id, code) => {
    const response = await axios.post(apiUrl + "/module/" + topic_id + "/coding_round/evaluate", {code: code}, {headers: {Authorization: token}})
    if (response.status === 200) {
        return response.data
    }
}

export { getCode, evaluateCode };