import axios from "axios"
import apiUrl from "./baseurl"

const getTopics = async () => {
    let response = await axios.get(apiUrl + "/module/list")
    if (response.status === 200) {
        return response.data
    }
    // return [
    //     {
    //         "id": 1,
    //         "title": "Python Basics"
    //     },
    //     {
    //         "id": 2,
    //         "title": "Data Structures"
    //     },
    //     {
    //         "id": 3,
    //         "title": "Algorithms"
    //     },
    //     {
    //         "id": 4,
    //         "title": "Stacks"
    //     },
    //     {
    //         "id": 5,
    //         "title": "Queues"
    //     },
    //     {
    //         "id": 6,
    //         "title": "Arrays"
    //     },
    //     {
    //         "id": 7,
    //         "title": "Trees"
    //     },
    // ]
}

export { getTopics };