import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
// import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

const drawerWidth = 240;
const navItems = [{name: 'Home', route: '/'}, {name: 'Learn', route: '/learn'}];

const Navbar = (props) => {
    const { children } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const location = window.location.pathname

    console.log(location)

    return (
        <Box sx={{ height: '100vh', overflow: 'hidden' }}>
            <CssBaseline />
            <Box sx={{ height: '8vh' }}>
                <AppBar component="nav" sx={{display: 'flex', alignItems: 'center', backgroundColor: 'transparent'}} elevation={0} >
                    <Box sx={{ width: '90%', backgroundColor: '#002A47', borderRadius: '0 0 23px 23px', zIndex: "1100"}}>
                        <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                            {/* Left Box - Possible Icon */}
                            <Box></Box>

                            {/* Right box, contains all tabs and profile icon */}
                            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
                                {/* Tabs */}
                                <List sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    {navItems.map((item,index)=>(
                                        <ListItem
                                            key={index}
                                        >
                                            <ListItemText 
                                                sx={{ cursor:"pointer", color: '#fff' }}
                                                // onClick={()=>handleSelectTopic(index)}
                                                primaryTypographyProps = {{
                                                    color:item.route===location?"#fff":"#478BF2",
                                                    fontWeight:"700",
                                                }}
                                                primary={item.name} 
                                            />
                                        </ListItem>
                                    ))}
                                </List>

                                {/* Profile Icon */}
                                <Box sx={{p:1}}><Avatar src="/broken-image.jpg" /></Box>                                
                            </Box>
                        </Toolbar>
                    </Box>
                </AppBar>
            </Box>
            {/* <nav>
                <Drawer
                container={container}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                >
                {drawer}
                </Drawer>
            </nav> */}
            <Box sx={{ height: { sm: '93vh', lg: '92vh'}, display: 'flex' }}>
                {children}
            </Box>
        </Box>
    );
}

export default Navbar