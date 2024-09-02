import apiUrl from "./baseurl";

const getQuiz = async () => {
    return await new Promise((resolve, reject) => {
        resolve({
            "title": "Basics of stacks",
            "description": "Learn the basics of Python.",
            "questions": [
            {
                "text": "What is Python?",
                "options": ["Programming Language", "Snake", "Both"],
                "correct_answer": "Programming Language"
            },
            {
                "text": "What is a Stack",
                "options": ["Data Structure", "CSS element", "Both"],
                "correct_answer": "Data Structure"
            },
            {
                "text": "Programming Language in which DSA is tough to implemet?",
                "options": ["SQL", "Python", "Java"],
                "correct_answer": "Python"
            },{
                "text": "What is Python?",
                "options": ["Programming Language", "Snake", "Both"],
                "correct_answer": "Programming Language"
            },
            {
                "text": "What is a Stack",
                "options": ["Data Structure", "CSS element", "Both"],
                "correct_answer": "Data Structure"
            },
            {
                "text": "Programming Language in which DSA is tough to implemet?",
                "options": ["SQL", "Python", "Java"],
                "correct_answer": "Python"
            },{
                "text": "What is Python?",
                "options": ["Programming Language", "Snake", "Both"],
                "correct_answer": "Programming Language"
            },
            {
                "text": "What is a Stack",
                "options": ["Data Structure", "CSS element", "Both"],
                "correct_answer": "Data Structure"
            },
            {
                "text": "Programming Language in which DSA is tough to implemet?",
                "options": ["SQL", "Python", "Java"],
                "correct_answer": "Python"
            }
            ]
        })
    })
}

export default getQuiz;