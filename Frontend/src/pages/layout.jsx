import Navbar from "../components/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Layout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (window.location.pathname === "/") {
        navigate("/home") 
    }
  })

  return (
    // <Box sx={{mx: window.innerWidth > 1000 ? '5rem' : 0, overflowY: 'auto'}}>
      <Navbar>
        <Outlet />
      </Navbar>
    // </Box>
  )
};

export default Layout;