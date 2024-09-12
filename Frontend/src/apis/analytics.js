import apiUrl from "./baseurl";
import axios from "axios";

const getAnalytics = async (token) => {
    const response = await axios.get(apiUrl + "/analytics/", {headers: {Authorization: token}})
    if (response.status === 200) {
        return response.data
    } else {
        localStorage.removeItem("user")
        window.location.href = "/home"
    }
}

export {getAnalytics}