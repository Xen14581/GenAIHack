import {useState, useEffect, useLayoutEffect} from "react";
import { TextField, IconButton, Box, Stack, InputAdornment } from "@mui/material";
import MessagePanel from "./MessagePanel";
import StepperComponent from "./Stepper";
import { useSelector } from 'react-redux'
import {getChatHistory, chat, stream} from "../apis/chat";
import ChatInput from "./ChatInput";
import { useDispatch } from "react-redux";
import { setTopicProgress } from "../apis/progress";
import { updateTopic } from "../reducers/topicSlice";

function containsQuizForModel(data) {
    return data.some(item => {
      if (item.role === "model") {
        return item.parts.some(part => part.value.includes("quiz"));
      }
      return false;
    });
  }

const ChatBox=({width, height})=>{
    let selectedTopic = useSelector(state => state.topic.selectedTopic)
    const user = useSelector(state => state.user.value)
    // const currentActiveStep = useSelector(state => state.step.activeStep)
    const dispatch = useDispatch()

    const [state, setState] = useState({
        history: [],
        textValue: '',
        image: [],
        audioUrl: null
    })

    const handleSubmit = async (message = '') => {
        // If message from coding round is triggered
        if (message !== "") {
            setState(prev => {
                return {
                    ...prev,
                    history: [
                        ...prev.history, 
                        {
                            'role': 'user', 
                            'parts': [
                                {
                                    type: 'text', 
                                    value: message
                                }
                            ]
                        }, 
                        {
                            'role': 'loading', 
                            'parts': [
                                {
                                    type: 'text', 
                                    value: ''
                                }
                            ]
                        }
                    ],
                    textValue: ''
                }
            })
            await stream(user.token, selectedTopic.id, location === 'chat' ? 'module' : 'coding_round', message, setState)
            setState(prev => {
                let history = prev.history
                history[history.length - 1].role = "model"
                return {
                    ...prev,
                    history: history,
                }
            })
        } 

        // If audio is provided
        else if (state.audioUrl) {
            let query = "Listen to this audio for my response"
            if (state.textValue !== "") {
                query = state.textValue
            }
            setState(prev => {
                let audioBlob = prev.audioUrl
                return {
                    ...prev,
                    history: [
                        ...prev.history, 
                        {
                            'role': 'user', 
                            'parts': [
                                {
                                    type: 'text', 
                                    value: query
                                },
                                {
                                    type: 'audio', 
                                    value: URL.createObjectURL(audioBlob)
                                }
                            ]
                        }, 
                        {
                            'role': 'loading', 
                            'parts': [{
                                type: 'text', 
                                value: ''
                            }]
                        }
                    ],
                    textValue: '',
                    audioUrl: null,
                }
            })
            await stream(user.token, selectedTopic.id, location === 'chat' ? 'module' : 'coding_round', query, setState, null, state.audioUrl)
            setState(prev => {
                let history = prev.history
                history[history.length - 1].role = "model"
                return {
                    ...prev,
                    history: history,
                    audioUrl: null,
                    textValue: ''
                }
            })
        } 

        // If image is provided
        else if (state.image.length) {
            let query = "Lets look at this image"
            if (state.textValue !== "") {
                query = state.textValue
            }
            setState(prev => {
                let images = prev.image
                return {
                    ...prev,
                    history: [
                        ...prev.history, 
                        {
                            'role': 'user', 
                            'parts': [{
                                type: 'text', 
                                value: query
                            },
                            ...images.map(img => {
                                return {
                                    type: 'image', 
                                    value: URL.createObjectURL(img)
                                }
                            }) 
                            ]
                        }, 
                        {
                            'role': 'loading', 
                            'parts': [{
                                type: 'text', 
                                value: ''
                            }]
                        }
                    ],
                    textValue: '',
                    image: [],
                }
            })
            await stream(user.token, selectedTopic.id, location === 'chat' ? 'module' : 'coding_round', query, setState, state.image, null)
            setState(prev => {
                let history = prev.history
                history[history.length - 1].role = "model"
                return {
                    ...prev,
                    history: history,
                    image: [],
                    textValue: ''
                }
            })
        } 

        // If neither audio or image but only text is provided
        else if (state.textValue !== "") {
            let query = state.textValue
            setState(prev => {
                return {
                    ...prev,
                    history: [
                        ...prev.history, 
                        {
                            'role': 'user', 
                            'parts': [
                                {
                                    type: 'text', 
                                    value: query
                                }
                            ]
                        }, 
                        {
                            'role': 'loading', 
                            'parts': [
                                {
                                    type: 'text', 
                                    value: ''
                                }
                            ]
                        }
                    ],
                    textValue: ''
                }
            })
            if (message !== '') {
                localStorage.removeItem('trigger')
            }
            await stream(user.token, selectedTopic.id, location === 'chat' ? 'module' : 'coding_round', query, setState)
            setState(prev => {
                let history = prev.history
                history[history.length - 1].role = "model"
                return {
                    ...prev,
                    history: history,
                }
            })
        } 
        else {
            console.log('type or attach something first')
            return
        }
    }

    let location = window.location.pathname.split("/")
    location = location[location.length - 1]

    useLayoutEffect(() => {
        const getdata = async () => {
            let data = await getChatHistory(user.token, selectedTopic.id, location === 'chat' ? 'module' : 'coding_round')
            if (data.length >= 0) {
                data = [...data.reverse()]
                if (location === "chat") {
                    data.push({"role": "model", "parts": [{type:'text', value: `Hello I'm Sage, your personal learning partner and teaching assistant! I can see that you've shown an interest in learning about **${selectedTopic.title}** today so let's get on with it, shall we? As an addition, you can select any of the topics in the panel on the side at any point you feel like learning something new!`}]})
                } else {
                    data.push({"role": "model", "parts": [{type: 'text', value: `Great work on passing your quiz!\n\nNow let's get to work by writing a code for the problem statement given using all the knowledge you learned!\n\n Good luck and remember - you can ask me any queries you have anytime you feel stuck anywhere.`}]})
                }
                data = [...data.reverse()]
            }
            let activeStep = containsQuizForModel(data) ? 1 : 0
            if (activeStep > selectedTopic.progress) {
                let progress = await setTopicProgress(user.token, selectedTopic.id, "Quiz")
                if (progress.message === "Ok") {
                    dispatch(updateTopic([selectedTopic.id, {'progress': 1}]))
                    selectedTopic = {...selectedTopic, ...{progress: 1}}
                }
            }
            setState(prev => {
                return {
                    ...prev,
                    history: data,
                    textValue: '',
                    image: [],
                    audioUrl: ''
                }
            })

            let trigger = localStorage.getItem('triggerQuiz')
            if (trigger) {
                localStorage.removeItem('triggerQuiz')
                await handleSubmit(trigger)
            }
        }
        getdata()
    }, [selectedTopic])

    useLayoutEffect(() => {
        const getdata = async () => {
            let trigger = localStorage.getItem('trigger')
            if (trigger) {
                await handleSubmit(trigger)
                let score = parseFloat(trigger.split("\n").slice(-1)[0].replace("%", ""))
                if (score >= 80) {
                    let progress = await setTopicProgress(user.token, selectedTopic.id, "Complete")
                    if (progress.message === "Ok") {
                        dispatch(updateTopic([selectedTopic.id, {'progress': 'Complete'}]))
                        selectedTopic = {...selectedTopic, ...{progress: 3}}
                    }
                }
                localStorage.removeItem('trigger')
            }
        }
        getdata()
    }, [localStorage.getItem('trigger')])

    return(
        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', height: '100%', px: 4, py: 1, maxHeight: height }}>
            <Box sx={{pt: 3, pb: 1, width: '100%'}}>
                <StepperComponent active={selectedTopic?.progress} />
            </Box>
            <MessagePanel chatHistory={[...state.history].reverse()} width={width} height={height} />
            <ChatInput state={state} setState={setState} handleSubmitChat={handleSubmit} />
        </Box>
    )
}

export default ChatBox;