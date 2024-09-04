import apiUrl from "./baseurl";
import axios from "axios"


const login = async (data) => {
    let response = await axios.post(apiUrl + "/login", data=data)
    // let response = {
    //     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjU0NzM4MjEsImlhdCI6MTcyNTM4NzQyMSwic3ViIjoxfQ.8tppGooXFoPOSY00HuKg5UaHKll0PSW0LNchveE2M0g",
    //     status: 200
    // }
    return response;
}

export { login };