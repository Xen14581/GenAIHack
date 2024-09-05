import {useState, useEffect} from "react";
import { TextField, IconButton, Box, Stack, InputAdornment } from "@mui/material";
import MessagePanel from "./MessagePanel";
import StepperComponent from "./Stepper";
import { useSelector } from 'react-redux'
import getChatHistory from "../apis/chat";
import SendIcon from '@mui/icons-material/Send';

const ChatBox=()=>{
    const selectedTopic = useSelector(state => state.topic.selectedTopic)

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

    const handleSubmit = () => {
        if(!state.textValue) {
            return
        }
        setState(prev => {
            return {
                history: [...prev.history, {'role': 'user', 'parts': prev.textValue}],
                textValue: ''
            }
        })
        setState(prev => {
            return {
                history: [...prev.history, {'role': 'loading', 'parts': ''}],
                textValue: ''
            }
        })
    }

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            handleSubmit()
        }
    }

    useEffect(() => {
        const getdata = async () => {
            let data = await getChatHistory()
            setState(prev => {
            return {
                ...prev,
                history: data
            }
            })
        }
        getdata()
    }, [selectedTopic]) 

    return(
        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', height: '100%', px: 4, py: 1, maxHeight: '90vh' }}>
            <Box sx={{mt: 3}}>
                <StepperComponent />
            </Box>
            <MessagePanel chatHistory={[...state.history].reverse()} />
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