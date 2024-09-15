import apiUrl from "./baseurl";
import axios from "axios";
import { toast } from 'react-toastify';

const getCode = async (token, topic_id) => {
    // const response = await axios.get(apiUrl + "/module/" + topic_id + "/coding_round/", {headers: {Authorization: token}})
    // if (response.status === 200) {
    //     return response.data
    // }

    return await axios.get(apiUrl + "/module/" + topic_id + "/coding_round/", {headers: {Authorization: token}})
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

const evaluateCode = async (token, topic_id, code) => {
    // const response = await axios.post(apiUrl + "/module/" + topic_id + "/coding_round/evaluate", {code: code}, {headers: {Authorization: token}})
    // if (response.status === 200) {
    //     return response.data
    // }

    return await axios.post(apiUrl + "/module/" + topic_id + "/coding_round/evaluate", {code: code}, {headers: {Authorization: token}})
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

export { getCode, evaluateCode };