import SideBar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";
import { useState, useEffect } from "react";

const CourseChat=()=>{

    const [chatHistory, setChatHistory] = useState([])

    useEffect(() => {
        setChatHistory([
            {'role': 'user', 'content': 'Hello'},
            {'role': 'assistant', 'content': 'hi'},
        ])
    }, [])

    return(
        <>
            <SideBar />
            <ChatBox chatHistory={chatHistory} />
        </>
        
    )
}

export default CourseChat