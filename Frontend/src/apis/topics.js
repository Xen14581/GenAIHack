import axios from "axios"
import apiUrl from "./baseurl"
import { toast } from 'react-toastify';

const getTopics = async () => {
    // let response = await axios.get(apiUrl + "/module/list")
    // if (response.status === 200) {
    //     return response.data
    // }

    return await axios.get(apiUrl + "/module/list")
    .then(response => {
        return response.data
    })
    .catch(err => {
        console.error(err)
        toast.error(err.response.data.message)
        // return {Error: err}
        // localStorage.removeItem("user")
        // window.location.href = "/home"
    })
}

export { getTopics };