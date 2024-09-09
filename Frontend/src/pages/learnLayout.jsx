import SideBar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LearnLayout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if (window.location.pathname === "/learn") {
            navigate("/learn/chat") 
        }
    })
    return (
        <>
            <Box sx={{ height: window.innerWidth > 1000 ? '100%' : '10vh', width: window.innerWidth > 1000 ? 'min-content' : '100%' }}>
                <SideBar />
            </Box>
            <Box sx={{ height: window.innerWidth > 1000 ? '100%' : '80vh', width: '100%' }}>
                <Outlet />
            </Box>
        </>
    )
}

export default LearnLayout;