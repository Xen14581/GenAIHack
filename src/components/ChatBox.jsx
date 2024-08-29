import React from "react";
import { TextField, Button, Box, Paper,Stack } from "@mui/material";
import Message from "./Message";

const ChatBox=()=>{
    return(
        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', pl: 2, pr: 2}}>
            <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'flex-end', height: '100%'}} >
                <Message role={'assistant'} message={"Hello World"} />
            </Box>
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