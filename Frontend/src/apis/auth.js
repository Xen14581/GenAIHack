import apiUrl from "./baseurl";
import axios from "axios"

const login = async (data) => {
    return await axios.post(apiUrl + "/login", data=data)
}

export default login;