import SideBar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";
import { Grid2 } from "@mui/material";

const Quiz=()=>{
    return(
        <>
        <Grid2 container>
            <Grid2 item alignItems={"self-start"} justifyContent={"center"} sx={{height: "100vh", overflowY: 'scroll'}} md={6} lg={3}>            
                <SideBar />
            </Grid2>
            <Grid2 item alignItems={"self-start"} justifyContent={"center"} sx={{height: "100vh", overflowY: 'scroll'}} md={6} lg={9}>            
                
            </Grid2>
        </Grid2>
        
        </>
        
    )
}

export default Quiz