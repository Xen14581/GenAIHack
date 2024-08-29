import React from "react";
import { useState,useEffect } from "react";
import {Box,Typography} from  "@mui/material";

const Message = ({role, message}) =>{
    return(
        <>
        <Box sx={{width:"100%", display: 'flex', justifyContent: role === 'assistant' ? 'start' : 'end'}}>
            <Box sx={{color:role==="assistant"?"#DEEFFF":"#006CB8"}}>
                <Typography variant="h2">
                    {message}
                </Typography> 
            </Box>
        </Box>
        </>
    )
}

export default Message;