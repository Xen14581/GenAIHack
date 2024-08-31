import Message from "./Message";
import { Box } from "@mui/material";

const MessagePanel = ({ chatHistory }) => {
    return (
        <Box sx={{display: 'flex', justifyContent: 'flex-end', height: '100%', flexDirection: 'column'}} >
            {chatHistory.map((message, index) => {
                return <Message id={index} role={message.role} message={message.content} /> 
            })}
        </Box>
    )
}

export default MessagePanel