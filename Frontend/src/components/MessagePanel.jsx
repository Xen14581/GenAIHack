import Message from "./Message";
import { Box } from "@mui/material";
import {ReactComponent as InvertedLogo} from "../assets/Logo-rev.svg"

const MessagePanel = ({ chatHistory }) => {
    return (
        <Box sx={{
            display: 'flex', 
            justifyContent: 'flex-end', 
            height: '100%', 
            flexDirection: 'column', 
            overflow: "auto", 
            py: 3, 
            position: 'relative',
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
                    zIndex: -2
                }}
            >
                <InvertedLogo width="30%" height="30%" opacity="0.045" />
            </Box>
            {/* Chats */}
            {chatHistory.map((message, index) => {
                return <Message key={index} role={message.role} message={message.content} /> 
            })}
        </Box>
    )
}

export default MessagePanel