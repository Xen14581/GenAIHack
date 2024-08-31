import SideBar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";
import { Grid2 } from "@mui/material";


const Quiz=()=>{

    // Quiz object
    const topicDetails = {
        "quiz": {
          "title": "Python Basics",
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
            }
          ]
        },
        "coding_round": {
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
            }
          ]
        }
      }
    
    // Returning template
    return(
        <>
        <Grid2 id="quiz-main-grid" container sx={{maxHeight: "92vh", }}>
            <Grid2 id="quiz-sidebar-container" item alignItems={window.innerWidth > 1000? "self-start": "center"} justifyContent={"center"} sx={{maxHeight: "90vh", overflowY: 'hidden'}} xs={12} md={6} lg={3}>            
                <SideBar />
            </Grid2>
            <Grid2 id="quiz-question-area-container" container item alignItems={"self-start"} justifyContent={"center"} sx={{ maxHeight: "90vh", overflowY: 'hidden'}} xs={12} md={6} lg={9}>            
                
            </Grid2>
        </Grid2>
        
        </>
        
    )
}

export default Quiz