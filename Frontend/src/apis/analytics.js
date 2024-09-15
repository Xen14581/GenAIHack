import apiUrl from "./baseurl";
import axios from "axios";
import { toast } from 'react-toastify';

const getAnalytics = async (token) => {
    // const response = await axios.get(apiUrl + "/analytics/", {headers: {Authorization: token}})
    // if (response.status === 200) {
    //     return response.data
    // } else {
    //     localStorage.removeItem("user")
    //     window.location.href = "/home"
    // }

    return await axios.get(apiUrl + "/analytics/", {headers: {Authorization: token}})
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

export {getAnalytics}