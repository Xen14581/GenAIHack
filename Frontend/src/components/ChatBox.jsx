import React from "react";
import { TextField, Button, Box, Stack } from "@mui/material";
import MessagePanel from "./MessagePanel";

const ChatBox=({ chatHistory })=>{
    return(
        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', height: '100%', px: 2 }}>
            <MessagePanel chatHistory={chatHistory} />
            <Box sx={{marginTop:"auto",marginBottom:"5vh",width:'100%'}}>
                <Stack spacing={2} direction="row">
                    <TextField label="Message SAGE.AI" sx={{width:"85%"}}/>
                    <Button variant="outlined">Send</Button>
                    <Button variant="contained" disabled>Evaluate</Button>
                </Stack>
            </Box>
        </Box>
    )
}

export default ChatBox;