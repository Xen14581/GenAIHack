import apiUrl from "./baseurl";
import axios from "axios"

const getMessage = async (data) => {
    return await axios.post(apiUrl + "/login", data=data)
}

export default getMessage;  