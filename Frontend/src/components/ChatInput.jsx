import { TextField, InputAdornment, IconButton, Box, Stack } from "@mui/material"
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import DeleteIcon from '@mui/icons-material/Delete';
import {chat, stream} from "../apis/chat";
import { useSelector } from 'react-redux'
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { useState, useEffect, useLayoutEffect } from "react";

const ChatInput = ({state, setState, handleSubmitChat}) => {

    const [audio, setAudio] = useState({
        open: false,
        url: '', 
        size: 0
    })

    const recorderControls = useAudioRecorder(
        {
            noiseSuppression: true,
            echoCancellation: true,
        },
        (err) => console.table(err)
    )

    const handleInputChange = (e) => {
        setState(prev => {
            return {
                ...prev,
                textValue: e.target.value
            }
        })
    }

    const handleEnter = (e) => {
        if (e.key === 'Enter' && state.textValue !== "") {
            handleSubmitChat()
        }
    }

    const handleAudioOpen = () => {
        recorderControls.startRecording()
        setAudio(prev => {
            return {
                ...prev,
                open: true
            }
        })
    }

    const handleAudioClose = () => {
        recorderControls.stopRecording()
        setAudio(prev => {
            return {
                ...prev,
                open: false,
                url: null,
            }
        })
    }

    const addAudioElement = (blob) => {
        if (blob.size !== audio.size) {
            const newAudio = URL.createObjectURL(blob);
            setAudio(prev => {
                return {
                    ...prev,
                    url: newAudio,
                    size: blob.size
                }
            })
        }
    };

    const handleSendAudio = () => {
        // send to backend
        handleAudioClose()
    }

    let els = document.getElementsByClassName("audio-recorder-options")

    for (let item of els) {
        if (item.getAttribute('data-testid') === 'ar_cancel'){
            item.title = "Stop recording"
        }
    }

    return (
        <>
            {audio.open 
                ?
                    audio.url
                    ?
                        <Stack sx={{ width: "100%" }} spacing={2} direction='row'>
                            <IconButton onClick={handleAudioClose}>
                                <DeleteIcon />
                            </IconButton>
                            <audio src={audio.url} controls controlsList="nodownload" style={{width: '100%'}} />
                            <IconButton onClick={handleSendAudio}>
                                <SendIcon />
                            </IconButton>
                        </Stack>
                    :
                        <Box sx={{ width: "100%", display: 'flex', justifyContent: 'center'}}>
                            {/* {audio.url ? <audio src={audio.url} controls controlsList="nodownload" style={{width: '100%'}} /> : <></>} */}
                            {/* <Box> */}
                                <AudioRecorder
                                    onRecordingComplete={addAudioElement}
                                    downloadFileExtension="mp3"
                                    showVisualizer={true}
                                    recorderControls={recorderControls}
                                />
                                {/* <IconButton onClick={handleSendAudio}>
                                    <SendIcon />
                                </IconButton>
                            </Box> */}
                        </Box>
                :
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
                                    {state.textValue === "" 
                                    ? 
                                    <IconButton onClick={handleAudioOpen}>
                                        <MicIcon />
                                    </IconButton>
                                    :
                                    <IconButton onClick={() => handleSubmitChat()}>
                                        <SendIcon />
                                    </IconButton>
                                    }
                                </InputAdornment>
                            ),
                            },
                        }}
                    /> 
            }
        </>
    )
}

export default ChatInput;