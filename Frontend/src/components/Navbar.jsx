import {useState, useEffect, useRef} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';

import { ReactComponent as Logo } from '../assets/Logo-with-text.svg';

const navItems = [{name: 'Home', route: '/'}, {name: 'Learn', route: '/learn'}];

const Navbar = (props) => {
    const { children } = props;

    const location = window.location.pathname

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <CssBaseline />
            <Box sx={{ height: '5rem' }}>
                <AppBar component="nav" sx={{display: 'flex', alignItems: 'center', backgroundColor: 'transparent'}} elevation={0} >
                    <Box sx={{ width: '90%', backgroundColor: '#002A47', borderRadius: '0 0 23px 23px', zIndex: "1100", px: 1}}>
                        <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                            {/* Left Box - Possible Icon */}
                            <Box sx={{
                                display: 'flex', 
                                alignItems: 'center',
                            }}>
                                <Logo width="40%" height="40%" />
                            </Box>

                            {/* Right box, contains all tabs and profile icon */}
                            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
                                {/* Tabs */}
                                <List sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    {navItems.map((item,index)=>(
                                        <ListItem
                                            key={index}
                                            sx={{display: 'flex', flexDirection: 'column'}}
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
                                            <div style={{width: '100%', height: '0.3vh', backgroundColor:"#fff", opacity: item.route===location?'1':'0'}} />
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
            <Box sx={{ 
                height: "100%", 
                display: 'flex' 
            }}>
                {children}
            </Box>
        </Box>
    );
}

export default Navbar