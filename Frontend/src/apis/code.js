const response = {
    "programming_question": "Write a function that returns the square of a number.",
    "template_code": "def square(n):\n    # Your code here\n    pass",
    "test_cases": [
        {
            "input": [5],
            "expected_output": "25"
        },
        {
            "input": [0],
            "expected_output": "0"
        },
        {
            "input": [5],
            "expected_output": "25"
        },
        {
            "input": [0],
            "expected_output": "0"
        },
        {
            "input": [5],
            "expected_output": "25"
        },
        {
            "input": [0],
            "expected_output": "0"
        },
    ]
}

import apiUrl from "./baseurl";

const getCode = async () => {
    return await new Promise((resolve, reject) => {
        resolve(response)
    })
}

export default getCode;