import NavBar from "../components/Navbar"
import { Box } from "@mui/material";

const Layout = (props) => {
  return (
    <Box sx={window.innerWidth > 1000 ? {pl: "5vw", pr: "5vw", pt:'2vh', maxHeight: "98vh", overflow: "hidden"} : 
    {pl: "5vw", pr: "5vw", pt:'2vh',  maxHeight: "95vh", overflow: "hidden", display: "flex", alignItems: 'center', justifyContent:'center'}}>
      <NavBar>
        {props?.children}
      </NavBar>
    </Box>
  )
};

export default Layout;