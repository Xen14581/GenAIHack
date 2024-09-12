import apiUrl from "./baseurl";
import axios from "axios"
import { toast } from 'react-toastify';

const login = async (data) => {
    return await axios.post(apiUrl + "/auth/login", data=data)
    .then(response => {
        return response.data
    })
    .catch(err => {
        console.error(err)
        toast.error(err.response.data.message)
        return {Error: err}
    })
}

const register = async (data) => {
    return await axios.post(apiUrl + "/auth/register", data=data)
    .then(response => {
        return response.data
    })
    .catch(err => {
        console.error(err)
        toast.error(err.response.data.message)
        return {Error: err}
    })
}

export { login, register };