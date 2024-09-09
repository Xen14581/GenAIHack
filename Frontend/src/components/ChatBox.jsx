import {useState, useEffect} from "react";
import { TextField, IconButton, Box, Stack, InputAdornment } from "@mui/material";
import MessagePanel from "./MessagePanel";
import StepperComponent from "./Stepper";
import { useSelector } from 'react-redux'
import {getChatHistory, chat, stream} from "../apis/chat";
import SendIcon from '@mui/icons-material/Send';

const ChatBox=({width, height})=>{
    const selectedTopic = useSelector(state => state.topic.selectedTopic)
    const user = useSelector(state => state.user.value)

    const [state, setState] = useState({
        history: [],
        textValue: ''
    })
    
    const handleInputChange = (e) => {
        setState(prev => {
            return {
                ...prev,
                textValue: e.target.value
            }
        })
    }

    const handleSubmit = async (message = '') => {
        if(message === '' && !state.textValue) {
            return
        }
        let query = state.textValue ? state.textValue : message
        setState(prev => {
            return {
                history: [...prev.history, {'role': 'user', 'parts': [query]}, {'role': 'loading', 'parts': [""]}],
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

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            handleSubmit()
        }
    }

    let location = window.location.pathname.split("/")
    location = location[location.length - 1]

    useEffect(() => {
        const getdata = async () => {
            let data = await getChatHistory(user.token, selectedTopic.id, location === 'chat' ? 'module' : 'coding_round')
            if (data.length >= 0) {
                data = [...data.reverse()]
                data.push({"role": "model", "parts": [`Hello I'm Sage, your personal learning partner and teaching assistant! I can see that you've shown an interest in learning about **${selectedTopic.title}** today so let's get on with it, shall we? As an addition, you can select any of the topics in the panel on the side at any point you feel like learning something new!`]})
                data = [...data.reverse()]
            }
            setState(prev => {
                return {
                    ...prev,
                    history: data
                }
            })
            let trigger = localStorage.getItem('trigger')
            if (trigger) {
                await handleSubmit(trigger)
            }
        }
        getdata()
    }, [selectedTopic, localStorage.getItem("trigger")]) 

    return(
        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', height: '100%', px: 4, py: 1, maxHeight: '90vh' }}>
            <Box sx={{mt: 3}}>
                <StepperComponent />
            </Box>
            <MessagePanel chatHistory={[...state.history].reverse()} width={width} height={height} />
            <Box sx={{width:'100%'}}>
                <Stack spacing={2} direction="row">
                    <TextField
                        label="Message SAGE.AI"
                        sx={{ width: "100%" }}
                        value={state.textValue}
                        onChange={handleInputChange}
                        onKeyDown={handleEnter}
                        slotProps={{
                            input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleSubmit}>
                                        {/* <img
                                        src={arrow}
                                        style={{ width: 30, height: 30 }}
                                        onClick={handleSubmit}
                                        /> */}
                                        <SendIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            },
                        }}
                    />
                </Stack>
            </Box>
        </Box>
    )
}

export default ChatBox;