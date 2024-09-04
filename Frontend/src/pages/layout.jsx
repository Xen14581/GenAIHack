import Navbar from "../components/Navbar";

const Layout = (props) => {
  return (
    // <Box sx={{mx: window.innerWidth > 1000 ? '5rem' : 0, overflowY: 'auto'}}>
      <Navbar>
        {props?.children}
      </Navbar>
    // </Box>
  )
};

export default Layout;