import React from "react";
import {Box,Typography, Avatar} from  "@mui/material";
import { blue } from "@mui/material/colors";
import Loader from "./Loader";
import {ReactComponent as InvertedLogo} from "../assets/Logo-rev.svg"
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import components from "./MarkdownComponents";

const Message = ({role, messages, width, height}) =>{
    return(
        <Box sx={{
            width:"100%",
            display: 'flex', 
            flexWrap: "wrap",
            justifyContent: 'center',
            alignItems: 'start',
            px: width > 1000 ? 2 : 0,
            py: 0.5
            }}
        >
            <Box sx={{
                // backgroundColor: role==="user" ? "#006CB8" : "#DEEFFF",
                // border: role === "user" ? "1px solid #006CB8" : "1px solid #006CB8",
                // borderRadius: "10px",
                width: '100%',
                px: width > 1000 ? 1 : 0, 
                overflowWrap: 'break-word',
                display: 'flex'
            }}>
                {
                    !messages.filter(msg => msg.value?.startsWith("Student Code:") || msg.value?.startsWith("Quiz Score:")).length
                    ?
                        <Box sx={{
                            minWidth: width > 1000 ? '8%' : width * 0.1, 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'flex-start',
                            mt: window.innerWidth > 1000 ? '0.8em' : '0.5vh'
                        }}>
                            {
                                role === "user" ? 
                                    <Avatar src="/broken-image.jpg" sx={width > 1000 ? { bgcolor: blue[600] , width: '28px', height: '28px'} : { bgcolor: blue[600] , width: 30, height: 30}}/> 
                                : role === 'loading' ? 
                                    <Loader logoHeight="28px" logoWidth="28px" inverted /> 
                                : 
                                    <InvertedLogo width={"28px"} height={"28px"} />
                            }
                        </Box>
                    :
                        <></>
                }
                <Box sx={{display: 'flex', width: '100%', flexDirection: 'column'}}>
                    {
                        messages.map((message, index) => {
                            return (
                                <Box key={index} sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    {
                                        message.value?.startsWith("Student Code:")
                                        ?
                                            <p style={{textAlign: 'center', width: '100%', fontSize: '14px', fontWeight: '700'}}>Code submitted</p>
                                        : 
                                        message.value?.startsWith("Quiz Score:")
                                        ?
                                            <p style={{textAlign: 'center', width: '100%', fontSize: '14px', fontWeight: '700'}}>Quiz submitted</p>
                                        : 
                                            ["Listen to this audio for my response", "Lets look at this image"].includes(message.value)
                                            ?
                                            <></>
                                            :
                                            <Box sx={{display: 'flex', width: '100%', overflowWrap: 'break-word'}}>
                                                {/* <Box sx={{minWidth: width > 1000 ? '8%' : width * 0.1, display: 'flex', justifyContent: 'center', mt: window.innerWidth > 1000 ? '0.8em' : '0.5vh'}}>
                                                    {role === "user" ? <Avatar src="/broken-image.jpg" sx={width > 1000 ? { bgcolor: blue[600] , width: '28px', height: '28px'} : { bgcolor: blue[600] , width: 30, height: 30}}/> : role === 'loading' ? <Loader logoHeight="28px" logoWidth="28px" inverted /> : <InvertedLogo width={"28px"} height={"28px"} />}
                                                </Box> */}
                                                <Typography variant="p" sx={{width: '100%'}} >
                                                    {
                                                        message.type === "text" 
                                                        ? 
                                                        <Markdown remarkPlugins={[remarkGfm]} components={components} key={index} style={{overflowWrap: 'break-word', width: '100%'}}>
                                                            {message.value}
                                                        </Markdown>
                                                        : message.type === "audio" 
                                                            ? 
                                                            <audio src={message.value} controls controlsList="nodownload" style={{width: '100%'}} />
                                                            : ["image", "gif"].includes(message.type)
                                                                ? 
                                                                <img src={message.value} style={{height: window.innerWidth * 0.2, width: window.innerWidth * 0.2 }} />
                                                                : 
                                                                JSON.stringify(message)
                                                    }
                                                </Typography> 
                                            </Box>
                                    }
                                </Box>
                            )
                        })
                    }
                </Box>
            </Box>
        </Box>
    )
}

export default Message;