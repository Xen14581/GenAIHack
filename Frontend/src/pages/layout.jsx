import NavBar from "../components/Navbar"
import { Box } from "@mui/material";

const Layout = (props) => {
  return (
    <Box sx={{pl: 8, pr: 8}}>
      <NavBar>
        {props?.children}
      </NavBar>
    </Box>
  )
};

export default Layout;