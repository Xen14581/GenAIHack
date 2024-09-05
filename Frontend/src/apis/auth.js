import apiUrl from "./baseurl";
import axios from "axios"


const login = async (data) => {
    let response = await axios.post(apiUrl + "/auth/login", data=data)
    if(response.status === 200) {
        return response.data
    } else {
        return {"Error": "Invalid credentials"}
    }
}

const register = async (data) => {
    let response = await axios.post(apiUrl + "/auth/register", data=data)
    if(response.status === 200) {
        return response.data
    } else {
        return {"Error": "Invalid credentials"}
    }
}

export { login, register };