import SideBar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";
import { Box } from "@mui/material";

const CourseChat=()=>{

    return(
        <>
            <Box sx={{ height: window.innerWidth > 1000 ? '100%' : '10vh' }}>
                <SideBar />
            </Box>
            <Box sx={{ height: window.innerWidth > 1000 ? '100%' : '80vh' }}>
                <ChatBox />
            </Box>
        </>
        
    )
}

export default CourseChat