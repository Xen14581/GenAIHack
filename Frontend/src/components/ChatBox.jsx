import {useState, useEffect} from "react";
import { TextField, Button, Box, Stack } from "@mui/material";
import MessagePanel from "./MessagePanel";
import {ReactComponent as InvertedLogo} from "../assets/Logo-rev.svg"

const ChatBox=()=>{
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
        setState(prev => {
            return {
                history: [...prev.history, {'role': 'user', 'content': prev.textValue}],
                textValue: ''
            }
        })
    }

    useEffect(() => {
        const response = [
            {'role': 'user', 'content': 'Hello'},
            {'role': 'assistant', 'content': `hi Warning: The property was originally a nonstandard and unprefixed Microsoft extension called word-wrap, and was implemented by most browsers with the same name. It has since been renamed to overflow-wrap, with word-wrap being an alias.`},
            {'role': 'user', 'content': 'Hello'},
            {'role': 'assistant', 'content': `hi Warning: The property was originally a nonstandard and unprefixed Microsoft extension called word-wrap, and was implemented by most browsers with the same name. It has since been renamed to overflow-wrap, with word-wrap being an alias.`},
            {'role': 'user', 'content': 'Hello'},
            {'role': 'assistant', 'content': `hi Warning: The property was originally a nonstandard and unprefixed Microsoft extension called word-wrap, and was implemented by most browsers with the same name. It has since been renamed to overflow-wrap, with word-wrap being an alias.`},
            {'role': 'user', 'content': 'Hello'},
            {'role': 'assistant', 'content': `hi Warning: The property was originally a nonstandard and unprefixed Microsoft extension called word-wrap, and was implemented by most browsers with the same name. It has since been renamed to overflow-wrap, with word-wrap being an alias.`},
            {'role': 'user', 'content': 'Hello'},
            {'role': 'assistant', 'content': `hi Warning: The property was originally a nonstandard and unprefixed Microsoft extension called word-wrap, and was implemented by most browsers with the same name. It has since been renamed to overflow-wrap, with word-wrap being an alias.`},
            {'role': 'user', 'content': 'Hello'},
            {'role': 'assistant', 'content': `hi Warning: The property was originally a nonstandard and unprefixed Microsoft extension called word-wrap, and was implemented by most browsers with the same name. It has since been renamed to overflow-wrap, with word-wrap being an alias.`},
            {'role': 'user', 'content': 'Hello'},
            {'role': 'assistant', 'content': `hi Warning: The property was originally a nonstandard and unprefixed Microsoft extension called word-wrap, and was implemented by most browsers with the same name. It has since been renamed to overflow-wrap, with word-wrap being an alias.`},
            {'role': 'user', 'content': 'Hello'},
            {'role': 'assistant', 'content': `hi Warning: The property was originally a nonstandard and unprefixed Microsoft extension called word-wrap, and was implemented by most browsers with the same name. It has since been renamed to overflow-wrap, with word-wrap being an alias.`},
        ]
        setState(prev => {
            return {
                ...prev,
                history: response
            }}
        )
    }, [])

    

    return(
        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', height: '100%', px: 4, py: 1, maxHeight: '90vh' }}>
            <MessagePanel chatHistory={state.history} />
            <Box sx={{width:'100%'}}>
                <Stack spacing={2} direction="row">
                    {/* <TextField label="Message SAGE.AI" sx={{width:"100%"}}/>
                    <Button variant="outlined">Send</Button>
                    <Button variant="contained" disabled>Evaluate</Button> */}
                    <TextField
                        label="Message SAGE.AI"
                        sx={{ width: "100%" }}
                        value={state.textValue}
                        onChange={handleInputChange}
                        // slotProps={{
                        //     input: {
                        //     endAdornment: (
                        //         <InputAdornment position="end">
                        //             <IconButton>
                        //                 <img
                        //                 src={arrow}
                        //                 style={{ width: 30, height: 30 }}
                        //                 onClick={handleSubmit}
                        //                 />
                        //             </IconButton>
                        //         </InputAdornment>
                        //     ),
                        //     },
                        // }}
                    />
                </Stack>
            </Box>
        </Box>
    )
}

export default ChatBox;