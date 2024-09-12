import { useState, useLayoutEffect, useRef } from 'react';
import { Grid2 } from "@mui/material";
import {ReactComponent as Lock} from "../assets/quiz/locked.svg";
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux'
import {getQuiz, evaluateQuiz} from '../apis/quiz';
import StepperComponent from '../components/Stepper';

const Quiz=()=>{    
  document.title = "Learn | Quiz"
 
  const selectedTopic = useSelector(state => state.topic.selectedTopic)
  const user = useSelector(state => state.user.value)
  const scroll = useRef(null)
  
  const [quiz, setQuiz] = useState({})
  const [score, setScore] = useState({
    percentage_score:null,
    score:null,
    total_questions:null
  })

  const handleSelect = (option, q_idx) => {
    setQuiz(prev => {
      let questions = prev.questions
      questions[q_idx].chosen_answer = option
      return {
        ...prev,
        questions: questions
      }
    })
  }

  const submitQuiz = async () => {
    let answers = quiz.questions.map(question => {
      return {
        "answer": question.chosen_answer,
        "id": question.id,
        "text": question.text
      }
    })
    const scores = await evaluateQuiz(user.token, selectedTopic.id, answers)
    setScore(scores)
    scroll.current.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  useLayoutEffect(() => {
    const getdata = async () => {
      let data = await getQuiz(user.token, selectedTopic.id)
      setQuiz(data)
    }
    getdata()
  }, [selectedTopic])

  return(
    <>
      <Grid2 
        container 
        id="Quiz-Content-Container" 
        size = {12} 
        alignItems={quiz ? "flex-start" : "flex-start"} 
        sx={window.innerWidth < 1000 ? {
          height: 'max-content', 
          maxHeight: "92vh",
          overflow: 'hidden',
        } : {
          height: "100%", 
          maxHeight: "92vh", 
          overflow: 'hidden',
        }} 
        spacing={1}
      >
        {quiz?.questions ?
          <Grid2 
            container 
            item 
            ref={scroll}
            size={{xs: 12}} 
            sx={window.innerWidth > 1000 ? {
              display: 'flex', 
              justifyContent: 'center', 
              textAlign:'center', 
              color: '#002A47', 
              height: 'max-content', 
              maxHeight: "90vh", 
              overflowY:'scroll', 
              overflowX: 'hidden', 
              px: 4
            } : {
              display: 'flex', 
              justifyContent: 'center', 
              textAlign:'center', 
              color: '#002A47', 
              height: 'max-content', 
              maxHeight: "75vh", 
              overflowY:'scroll', 
              overflowX: 'hidden', 
              px: 4
            }}
          >
            <Grid2 item size={{xs: 12}} sx={window.innerWidth > 1000 ? {height: 'max-content', maxHeight: "10vh", scrollY: 'hidden', mt:4}: {height: "max-content", maxHeight: "10vh", padding: '5px', mt:4}}>
                <StepperComponent />
            </Grid2>
            <Grid2 item size={{xs: 12}} sx={window.innerWidth > 1000 ? {height: 'max-content', maxHeight: "5vh", scrollY: 'hidden', display: 'flex', justifyContent: 'center', flexDirection: 'column'}: {height: "max-content", maxHeight: "5vh", padding: '5px', display: 'flex', justifyContent: 'center'}}>
                <h3 style={{margin: 0}}>Passing Score: 80% </h3>
                <h4 style={{margin: 0}}>
                  {score.score 
                  ? score.score >= 80 
                    ? "Your score: " + score.score + "%!\nYou can move onto your coding practice now!" 
                    : "Your score: " + score.score + "%!\nLearn more and try again!"
                  : null}
                </h4>
            </Grid2>
            {quiz?.questions?.map((question, index)=>{
                return (
                  <Grid2 
                    container 
                    item 
                    key={index} 
                    spacing={0} 
                    size={{xs: 12}} 
                    sx={{display: 'flex', justifyContent: 'flex-start', textAlign:'left', color: '#478BF2'}}
                  >
                    <Grid2 item size={{xs: 12}}>
                      <h3>
                        {`Question ${index+1}: `}
                        <span style={{color: "#002A47", fontWeight: 400}}>
                          {question?.text}
                        </span>
                      </h3>
                    </Grid2>

                    {question?.options.map((option, op_index)=> {
                        return (
                          <Grid2 key={op_index} item size={{xs: 12, md: 6}} sx={{padding:"10px"}}>
                            <Button 
                              value={option} 
                              variant={question?.chosen_answer == option ? 'contained' :'outlined'} 
                              sx={{width: '100%'}} 
                              onClick={(e)=>{handleSelect(e.target.value, index)}}
                            >
                              {option}
                            </Button>
                          </Grid2>
                        )
                      })
                    }
                  </Grid2>
                )
              })
            }
            <Grid2 item size={{xs: 12}} sx={window.innerWidth > 1000 ? {height: 'max-content', maxHeight: "10vh", scrollY: 'hidden', mt:2}: {height: "max-content", maxHeight: "10vh", padding: '5px', mt:2}}>
              <Button 
                variant={'contained'} 
                sx={{width: '100%'}} 
                onClick={() => {submitQuiz()}}
              >
                Submit Quiz
              </Button>
            </Grid2>
          </Grid2>
        :
        <>
          <Grid2 item size={{xs: 12}} sx={{display: 'flex', justifyContent: 'center'}}>
            <Lock width={window.innerWidth > 1000? "50%": "80%"} height={window.innerWidth > 1000? "50%": "auto"}/>
          </Grid2>
          <Grid2 item size={{xs: 12}} sx={{display: 'flex', justifyContent: 'center', textAlign:'center', color: '#cc0000'}}>
            <h3>Quiz Locked</h3>
          </Grid2>
          <Grid2 item size={{xs: 12}} sx={{display: 'flex', justifyContent: 'center', textAlign:'center',  color: '#002A47'}}>
            <h5>We would reccomend you to first attempt learning the fundamental's of {selectedTopic.title} <a style={{color: "#"}} href='/home'>here</a>. </h5>
          </Grid2>
        </>
        }
      </Grid2>
    </>
  )
}

export default Quiz