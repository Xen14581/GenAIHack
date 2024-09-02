import { useState, useEffect } from 'react';
import { Grid2 } from "@mui/material";
import {ReactComponent as Lock} from "../assets/quiz/locked.svg";
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux'
import getQuiz from '../apis/quiz';

const Quiz=()=>{       
  const selectedTopic = useSelector(state => state.topic.value)
  
  const [quiz, setQuiz] = useState({})

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

  useEffect(() => {
    const getdata = async () => {
      let data = await getQuiz()
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
                              onClick={(e)=>{handleSelect(e.target.value, index)
                                // var temp_answer = answers
                                // const new_answer  = {...temp_answer[index], chosen_answer: e.target.value}
                                // temp_answer[index] = new_answer
                                // setAnswers(temp_answer)
                              }}
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
            <h5>We would reccomend you to first attempt learning the fundamental's of {selectedTopic} <a style={{color: "#"}} href='/'>here</a>. </h5>
          </Grid2>
        </>
        }
      </Grid2>
    </>
  )
}

export default Quiz