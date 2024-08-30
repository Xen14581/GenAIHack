import NavBar from "../components/Navbar"
import { Box } from "@mui/material";

const Layout = (props) => {
  return (
    <Box sx={{px: '5rem'}}>
      <NavBar>
        {props?.children}
      </NavBar>
    </Box>
  )
};

export default Layout;