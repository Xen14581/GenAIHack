import NavBar from "../components/Navbar"
import { Box } from "@mui/material";

const Layout = (props) => {
  return (
    <Box sx={{px: window.innerWidth > 1000 ? '5rem' : 0}}>
      <NavBar>
        {props?.children}
      </NavBar>
    </Box>
  )
};

export default Layout;