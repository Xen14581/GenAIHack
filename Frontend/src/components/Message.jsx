import React from "react";
import { useState,useEffect } from "react";
import {Box,Typography} from  "@mui/material";
import Loader from "./Loader";

const Message = ({role, message}) =>{
    return(
        <Box sx={{
            width:"100%",
            display: 'flex', 
            flexWrap: "wrap",
            justifyContent: role === 'assistant' ? 'start' : 'end',
            px: 3,
            }}
        >
            <Box sx={{
                backgroundColor:role==="assistant"?"#DEEFFF":"#006CB8",
                border: role === "assistant" ? "1px solid #006CB8" : "1px solid #006CB8",
                borderRadius: "10px",
                maxWidth: '65%',
                px: 1, 
                overflowWrap: 'break-word'
            }}>
                <Typography variant="p" sx={{ color: role === "assistant" ? "black" : "white" }} fontSize="100%">
                    {message}
                </Typography> 
            </Box>
        </Box>
    )
}

export default Message;