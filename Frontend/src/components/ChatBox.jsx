import {useState, useEffect} from "react";
import { TextField, IconButton, Box, Stack, InputAdornment } from "@mui/material";
import MessagePanel from "./MessagePanel";
import StepperComponent from "./Stepper";
import { useSelector } from 'react-redux'
import {getChatHistory, chat, stream} from "../apis/chat";
import SendIcon from '@mui/icons-material/Send';
import ChatInput from "./ChatInput";

const ChatBox=({width, height})=>{
    const selectedTopic = useSelector(state => state.topic.selectedTopic)
    const user = useSelector(state => state.user.value)

    const [state, setState] = useState({
        history: [],
        textValue: '',
        image: [],
        audioUrl: null
    })

    const handleSubmit = async (message = '') => {
        // if(message === '' && !state.textValue) {
        //     return
        // }
        // let query = state.textValue ? state.textValue : message
        // setState(prev => {
        //     return {
        //         ...prev,
        //         history: [...prev.history, {'role': 'user', 'parts': [query]}, {'role': 'loading', 'parts': [""]}],
        //         textValue: ''
        //     }
        // })
        // if (message !== '') {
        //     localStorage.removeItem('trigger')
        // }
        // await stream(user.token, selectedTopic.id, location === 'chat' ? 'module' : 'coding_round', query, setState)
        // setState(prev => {
        //     let history = prev.history
        //     history[history.length - 1].role = "model"
        //     return {
        //         ...prev,
        //         history: history,
        //     }
        // })

        // If message from coding round is triggered
        if (message !== "") {
            setState(prev => {
                return {
                    ...prev,
                    history: [...prev.history, {'role': 'user', 'parts': [message]}, {'role': 'loading', 'parts': [""]}],
                    textValue: ''
                }
            })
            localStorage.removeItem('trigger')
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
            let query = "Listen to this audio"
            if (state.textValue !== "") {
                query = state.textValue
            }
            console.log('audio sent')
            setState(prev => {
                let history = prev.history
                // history[history.length - 1].role = "model"
                return {
                    ...prev,
                    history: history,
                    audioUrl: null
                }
            })
        } 

        // If image is provided
        else if (state.image.length) {
            let query = "Listen to this audio"
            if (state.textValue !== "") {
                query = state.textValue
            }
            console.log('image sent')
            setState(prev => {
                let history = prev.history
                // history[history.length - 1].role = "model"
                return {
                    ...prev,
                    history: history,
                    image: []
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

    useEffect(() => {
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
            setState(prev => {
                return {
                    ...prev,
                    history: data,
                    textValue: '',
                    image: [],
                    audioUrl: ''
                }
            })
        }
        getdata()
    }, [selectedTopic]) 

    useEffect(() => {
        const getdata = async () => {
            let trigger = localStorage.getItem('trigger')
            if (trigger) {
                await handleSubmit(trigger)
            }
        }
        getdata()
    }, [localStorage.getItem("trigger")])

    return(
        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', height: '100%', px: 4, py: 1, maxHeight: height }}>
            <Box sx={{mt: 3}}>
                <StepperComponent />
            </Box>
            <MessagePanel chatHistory={[...state.history].reverse()} width={width} height={height} />
            <ChatInput state={state} setState={setState} handleSubmitChat={handleSubmit} />
        </Box>
    )
}

export default ChatBox;