import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { blue } from '@mui/material/colors';
import { Grid2 } from '@mui/material';
import { ReactComponent as Logo } from '../assets/logos/Logo-with-text.svg';
import Hamburger from 'hamburger-react';
import { useState } from 'react';


const Navbar = (props) => {
    const { children } = props;

    const location = window.location.pathname
    const navItems = [{name: 'Home', route: '/'}, {name: 'Learn', route: '/learn'}, {name: 'Report Card', route: '/report-card'}, {name: 'Why Sage?', route:'/why-sage'}];
    const [isMenuOpen, setMenuOpen] = useState(false)
    console.log(location)

    return (
        <Box sx={{ height: '100vh', overflow: 'hidden' }}>
            <CssBaseline />
            <Box sx={{ maxHeight: '8vh', height: "8vh" ,}}>
                <AppBar component="nav" sx={{display: 'flex', alignItems: 'center', backgroundColor: 'transparent', maxHeight: "8vh"}} elevation={0} >
                    <Grid2 container sx={{minWidth: '90vw',maxWidth: '90vw', bgcolor:'#002A47', borderRadius: "0 0 23px 23px", display: 'flex', alignItems: 'center', p: 0, maxHeight: '8vh'}}>
                        {/* Logo */}
                        <Grid2 item sx={window.innerWidth > 1000? {height: '8vh', minWidth: '35%', maxWidth: '35%', padding: 0, display: 'flex', justifyContent: 'flex-start'} : 
                                        {height: '8vh', minWidth: '50%', maxWidth: '50%', padding: 0, display: 'flex', justifyContent: 'flex-start'}}>
                            {window.innerWidth > 1000? <Logo width="50%" height="100%" /> : <Logo width="70%" height="100%" />}
                        </Grid2>
                        {/* List or Menu */}
                        <Grid2 item sx={window.innerWidth > 1000 ? {height: '100%',minWidth: '55%', maxWidth: '55%', padding: 0} : 
                                        {height: '100%',minWidth: '35%', maxWidth: '35%', padding: 0, display: 'flex', justifyContent: 'flex-end'}} >
                            {/* Show smaller hamburger for small screens and a list for large screen */}
                            {window.innerWidth > 1000 ? 
                            <List sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0}}>
                                {navItems.map((item,index)=>(
                                    <ListItem
                                        key={index}
                                        sx={{display: 'flex', flexDirection: 'column'}}
                                    >
                                        <ListItemText 
                                            sx={{ cursor:"pointer", color: '#fff', textAlign:'center' }}
                                            // onClick={()=>handleSelectTopic(index)}
                                            primaryTypographyProps = {{
                                                color:item.route===location?"#fff":"#478BF2",
                                                fontWeight:"500",
                                                fontSize: '15px'
                                            }}
                                            primary={item.name} 
                                        />
                                    </ListItem>
                                ))}
                            </List> :      
                            <div>
                                <IconButton
                                    aria-label="more"
                                    id="long-button"
                                    aria-controls={open ? 'long-menu' : undefined}
                                    aria-expanded={open ? 'true' : undefined}
                                    aria-haspopup="true"
                                    onClick={handleClick}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu
                                    id="long-menu"
                                    MenuListProps={{
                                    'aria-labelledby': 'long-button',
                                    }}
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    slotProps={{
                                    paper: {
                                        style: {
                                        maxHeight: ITEM_HEIGHT * 4.5,
                                        width: '20ch',
                                        },
                                    },
                                    }}
                                >
                                    {options.map((option) => (
                                    <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
                                        {option}
                                    </MenuItem>
                                    ))}
                                </Menu>
                                </div>
}
                        </Grid2>
                        {/* Avatar */}
                        <Grid2 item sx={window.innerWidth > 1000 ? {width: '10%', height: '60%', display:'flex', justifyContent:'center'}:  
                                       {width: '15%', height: '60%', display:'flex', justifyContent:'flex-end', pr: 3}} >
                            <Avatar src="/broken-image.jpg" sx={window.innerWidth > 1000 ? { bgcolor: blue[600] , width: 35, height: 35} : { bgcolor: blue[600] , width: 30, height: 30}}/>
                        </Grid2>
                    </Grid2>
                </AppBar>
            </Box>
            <Box sx={{ height: { sm: '93vh', lg: '92vh'}, display: 'flex' }}>
                {children}
            </Box>
        </Box>
    );
}

export default Navbar