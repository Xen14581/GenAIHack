import Message from "./Message";
import { Box } from "@mui/material";
import {ReactComponent as InvertedLogo} from "../assets/Logo-rev.svg"

const MessagePanel = ({ chatHistory, width, height }) => {
    return (
        <Box sx={{
            display: 'flex', 
            justifyContent: 'flex-end', 
            height: '100%', 
            width: '100%',
            flexDirection: 'column', 
            overflow: "hidden", 
            py: 1,
            position: 'relative',
            // backgroundColor: '#eeeeee'
            }} 
        >
            {/* Background */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: 'center',
                    position: "absolute",
                    width: "100%",
                    height: '100%',
                    zIndex: 2,
                    backgroundColor: '#eee',
                    opacity: "0.25"
                }}
            >
                <InvertedLogo width="40%" height="40%" opacity="0.3" />
            </Box>
            {/* Chats */}
            <Box sx={{zIndex: 3,width: '100%', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column-reverse', overflowX: 'hidden'}}>
                {chatHistory?.map((message, index) => {
                    return <Message key={index} role={message.role} messages={message.parts} width={width} height={height} /> 
                })}
            </Box>
        </Box>
    )
}

export default MessagePanel