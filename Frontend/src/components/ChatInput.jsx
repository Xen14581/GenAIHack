import { TextField, InputAdornment, IconButton, Box, Stack } from "@mui/material"
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { useState, useRef } from "react";

const ChatInput = ({state, setState, handleSubmitChat}) => {

    const [audio, setAudio] = useState({
        open: false,
        size: 0
    })
    const [hover, setHover] = useState('')

    const inputRef = useRef(null)

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
            }
        })
        setState(prev => {
            return {
                ...prev,
                audioUrl: null
            }
        })
    }

    const addAudioElement = (blob) => {
        if (blob.size !== audio.size) {
            setAudio(prev => {
                return {
                    ...prev,
                    size: blob.size
                }
            })
            setState(prev => {
                return {
                    ...prev,
                    audioUrl: blob
                }
            })
        }
    };

    const handleSendAudio = () => {
        // send to backend
        handleAudioClose()
        handleSubmitChat()
    }

    const handleCapture = ({ target }) => {
        setState(prev => {
            return {
                ...prev,
                image: [
                    ...prev.image,
                    ...target.files
                ]
            }
        });
    };

    let els = document.getElementsByClassName("audio-recorder-options")

    if (els.length) {
        for (let item of els) {
            if (item.getAttribute('data-testid') === 'ar_cancel'){
                item.title = "Stop recording"
            }
        }
    }

    // Display logic

    if (audio.open && state.audioUrl) {
        return (
            <Stack sx={{ width: "100%" }} spacing={2} direction='row'>
                <IconButton onClick={handleAudioClose}>
                    <DeleteIcon />
                </IconButton>
                <audio src={URL.createObjectURL(state.audioUrl)} controls controlsList="nodownload" style={{width: '100%'}} />
                <IconButton onClick={handleSendAudio}>
                    <SendIcon />
                </IconButton>
            </Stack>
        )
    }

    if (audio.open && !state.audioUrl) {
        return (
            <Box sx={{ width: "100%", display: 'flex', justifyContent: 'center'}}>
                <AudioRecorder
                    onRecordingComplete={addAudioElement}
                    downloadFileExtension="mp3"
                    showVisualizer={true}
                    recorderControls={recorderControls}
                />
            </Box>
        )
    }
    
    return (
        <Stack sx={{height: state.image.length ? "28vh" : 'min-content'}} direction={'column-reverse'}>
            <TextField
                label="Message SAGE.AI"
                sx={{ width: "100%" }}
                value={state.textValue}
                onChange={handleInputChange}
                onKeyDown={handleEnter}
                slotProps={{
                    input: {
                    endAdornment: (
                        <>
                            {
                                state.textValue || state.image.length 
                                ? 
                                (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => handleSubmitChat()}>
                                            <SendIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                                : 
                                (
                                    <InputAdornment position="end">
                                        <input onChange={handleCapture} ref={inputRef} type="file" accept="image/*" multiple style={{display: 'none'}} />
                                        <IconButton onClick={() => {inputRef.current.click()}}>
                                            <AddPhotoAlternateIcon />
                                        </IconButton>
                                        <IconButton onClick={handleAudioOpen}>
                                            <MicIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        </>
                    ),
                    },
                }}
            />

            {state.image.length ?
                <Stack 
                    direction='row' 
                    spacing={2}
                    sx={{
                        height: '100%', 
                        borderTop: '1px solid #ccc', 
                        borderLeft: '1px solid #ccc', 
                        borderRight: '1px solid #ccc', 
                        borderRadius: '5px',
                        display: 'flex',
                        p: '2%',
                        alignItems: 'center'
                    }}
                >
                    {state.image.map((img, idx) => {
                        return (
                            <Box 
                                key={idx}
                                sx={{height: '60px', width: '60px', position: 'relative'}} 
                                onMouseOver={() => setHover(img.name)} 
                                onMouseOut={() => setHover("")} 
                                onClick={() => {
                                    setState(prev => {
                                        let newImgs = prev.image.filter(p => p.name !== img.name)
                                        return {
                                            ...prev,
                                            image: newImgs
                                        }
                                    })
                                }}
                            >
                                <img style={{height: '100%', width: '100%'}} alt="preview image" src={URL.createObjectURL(img)} />
                                {img.name === hover && 
                                    <Box 
                                        sx={{
                                            height: '100%', 
                                            width: '100%', 
                                            position: 'absolute', 
                                            top: 0, 
                                            left: 0, 
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Box 
                                            sx={{
                                                height: '100%', 
                                                width: '100%', 
                                                backgroundColor: 'black', 
                                                opacity: '20%'
                                            }}
                                        />
                                        <DeleteIcon sx={{color: 'white', position: 'absolute' }} />
                                    </Box>
                                }
                            </Box>
                        )
                    })}
                </Stack>
                :
                <></>
            }
            
        </Stack>
    )
}

export default ChatInput;