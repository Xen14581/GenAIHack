import React from "react";
import {Box,Typography} from  "@mui/material";
import Loader from "./Loader";
import Markdown from "react-markdown";

const Message = ({role, messages}) =>{
    return(
        <Box sx={{
            width:"100%",
            display: 'flex', 
            flexWrap: "wrap",
            justifyContent: role === 'user' ? 'end' : 'start',
            alignItems: 'start',
            px: 3,
            py: 0.5
            }}
        >
            <Box sx={{
                backgroundColor: role==="user" ? "#006CB8" : "#DEEFFF",
                border: role === "user" ? "1px solid #006CB8" : "1px solid #006CB8",
                borderRadius: "10px",
                ...[role === "loading" ? {width: '65%'} : {maxWidth: '65%'}][0],
                px: 1, 
                overflowWrap: 'break-word'
            }}>
                <Typography variant="p" sx={{ color: role === "user" ? "white" : "black" }} fontSize="100%">
                    {messages.map((message, index) => <Markdown key={index}>{message}</Markdown>)}
                </Typography> 
            </Box>
            {role === 'loading' && <Loader logoHeight="3vh" logoWidth="3vw" inverted />}
        </Box>
    )
}

export default Message;