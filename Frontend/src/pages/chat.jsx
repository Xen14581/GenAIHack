import SideBar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";
import { Box } from "@mui/material";

const CourseChat=()=>{
    document.title = "Learn | Chat"

    return <ChatBox width={window.innerWidth} height={window.innerHeight} />
}

export default CourseChat