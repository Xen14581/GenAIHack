import * as React from 'react';
import SideBar from "../components/Sidebar";
import { Grid2 } from "@mui/material";
import {ReactComponent as Lock} from "../assets/quiz/locked.svg";
import Button from '@mui/material/Button';



const Quiz=()=>{    
    // Quiz object
    const topicDetails = {
        "topic_name" : "Stacks",
        "quiz": {
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

    const [answers, setAnswers] = React.useState(topicDetails?.quiz?.questions)
   
    // Returning template
    return(
        <>
        <Grid2 container id="Quiz-Main-Container" spacing={2} alignItems={window.innerWidth < 1000 ? "flex-start" : "center"} sx={{minWidth: "100%", height:"92vh", overflowX: 'hidden', overflowY: 'hidden'}}>
          <Grid2 container id="Quiz-Sidebar-Container" item size={{xs: 12, md:3}} sx={window.innerWidth < 1000 ? {display: 'flex', justifyContent: 'center', overflowX: 'hidden', overflowY: 'hidden'} : {overflowX: 'hidden', overflowY: 'hidden', padding: 0}}>
            <SideBar />
          </Grid2>
          <Grid2 container id="Quiz-Content-Container" item size = {{xs: 12, md:  9}} alignItems={topicDetails?.quiz ? "flex-start" : "flex-start"} sx={window.innerWidth < 1000 ? {height: 'max-content', maxHeight: "92vh", overflowY: 'hidden', overflowX: 'hidden'} : {height: "100%", maxHeight: "92vh", overflowY: 'hidden', overflowX: 'hidden'}} spacing={1}>
            {topicDetails?.quiz ?
            <>
              
              <Grid2 container item size={{xs: 12}} sx={window.innerWidth > 1000 ? {display: 'flex', justifyContent: 'center', textAlign:'center', color: '#002A47', height: 'max-content', maxHeight: "90vh", overflowY:'scroll', overflowX: 'hidden'}: {display: 'flex', justifyContent: 'center', textAlign:'center', color: '#002A47', height: 'max-content', maxHeight: "75vh", overflowY:'scroll', overflowX: 'hidden'}}>
              {answers.map((item, index)=>{
                  return(<Grid2 container item key={index}  spacing={0}  size={{xs: 12}} sx={{display: 'flex', justifyContent: 'flex-start', textAlign:'left', color: '#478BF2'}}>
                    <Grid2 item size={{xs: 12}}>
                    <h3>Question {index+1}: <span style={{color: "#002A47", fontWeight: 400}}>{item?.text}</span></h3>
                    </Grid2>
                    {item?.options.map((option, op_index)=> {
                      console.log(item?.chosen_answer, option)
                        return (
                          <Grid2 item size={{xs: 12, md: 6}} sx={{padding:"10px"}}>
                            <Button key={op_index} value={option} variant={item?.chosen_answer == option ? 'contained' :'outlined'} sx={{width: '100%'}} onClick={(e)=>{
                              var temp_answer = answers
                              const new_answer  = {...temp_answer[index], chosen_answer: e.target.value}
                              temp_answer[index] = new_answer
                              setAnswers(temp_answer)
                            }}>
                              {option}
                            </Button>
                          </Grid2>
                        )
                      }
                    )
                    }
                  </Grid2>)
              })
              }
              </Grid2>

            </>:
            <>
              <Grid2 item size={{xs: 12}} sx={{display: 'flex', justifyContent: 'center'}}>
                <Lock width={window.innerWidth > 1000? "50%": "80%"} height={window.innerWidth > 1000? "50%": "auto"}/>
              </Grid2>
              <Grid2 item size={{xs: 12}} sx={{display: 'flex', justifyContent: 'center', textAlign:'center', color: '#cc0000'}}>
                <h3>Quiz Locked</h3>
              </Grid2>
              <Grid2 item size={{xs: 12}} sx={{display: 'flex', justifyContent: 'center', textAlign:'center',  color: '#002A47'}}>
                <h5>We would reccomend you to first attempt learning the fundamental's of {topicDetails?.topic_name} <a style={{color: "#"}} href='/'>here</a>. </h5>
              </Grid2>

            </>

            }
          </Grid2>
        </Grid2>
        
        </>
        
    )
}

export default Quiz