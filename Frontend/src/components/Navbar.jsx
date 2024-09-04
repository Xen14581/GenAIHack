import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import { blue } from '@mui/material/colors';
import { Grid2 } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Logout from '@mui/icons-material/Logout';
import Divider from '@mui/material/Divider';
import { ReactComponent as Logo } from '../assets/Logo-with-text.svg';

// For menu
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import { BorderColor } from '@mui/icons-material';

import { useSelector, useDispatch } from 'react-redux'
import { removeUserData } from '../reducers/userSlice';

// Menu style
const StyledMenu = styled((props) => (
    <Menu
      elevation={5}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  ))(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 200,
      backgroundColor: "#002A47",
      border: "2px solid #ffffff",
      color: '#ffffff',
      boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      '& .MuiMenu-list': {
        padding: '4px 0',
      },
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        '&:active': {
        //   backgroundColor: alpha(
        //     theme.palette.primary.main,
        //     theme.palette.action.selectedOpacity,
            
        //   ),
        },
      },
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[300],
      }),
    },
  }));

const Navbar = (props) => {
    const { children } = props;

    let user = useSelector(state => state.user.value)
    const dispatch = useDispatch()

    const [state, setState] = React.useState({
        redirect: false,
        page: ""
    })

    const location = window.location.pathname
    const navItems = [{name: 'Home', route: '/'}, {name: 'Learn', route: '/learn/chat'}, {name: 'Report Card', route: '/report-card'}, {name: 'Why Sage?', route:'/why-sage'}];

    const matchLocation = (location, route) => {
        let locSlice = "/" + location.split("/")[1]
        let routeSlice = "/" + route.split("/")[1]
        if (locSlice.length == routeSlice.length && locSlice == routeSlice) {
            return true;
        } else if (routeSlice !== "/" && locSlice.startsWith(routeSlice)) {
            return true;
        } else {
            return false;
        }
    }

    const [avatarEl, setAvatarEl] = React.useState(null);
    const avatarMenuOpen = Boolean(avatarEl);

    const handleClick = (event) => {
        setAvatarEl(event.currentTarget);
    };

    //   Menu Controller
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleOpenClose = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = (e) => {
        if(e.target.id === "logout") {
            dispatch(removeUserData())
            window.location.href = "/"
        }
        setAvatarEl(null);
    };

    React.useLayoutEffect(() => {
        if (user || location.startsWith("/auth")) {
            setState(prev => { return {...prev, redirect: true} })
        }
    }, [user, window.location])

    React.useEffect(() => {
        if(state.page !== "") {
            window.location.href = state.page
        }
    }, [state.page])

    return (
        <Box 
            sx={{ 
                height: '100vh', overflow: location === "/" ? 'auto' : 'hidden' , px: window.innerWidth > 1000 ? '5rem' : 0
            }}
        >
            <CssBaseline />
            {state.redirect 
            ? <>{children}</> 
            : <>
                <Box 
                    sx={{ 
                        maxHeight: '8vh', height: "8vh",
                    }}
                >
                    <AppBar 
                        component="nav" 
                        elevation={0}
                        sx={{display: 'flex', alignItems: 'center', backgroundColor: 'transparent', maxHeight: "8vh"}}  
                    >
                        <Grid2 
                            container 
                            sx={{
                                minWidth: '90vw',
                                maxWidth: '90vw', 
                                bgcolor:'#002A47',
                                borderRadius: "0 0 23px 23px",
                                display: 'flex',
                                alignItems: 'center',
                                p: 0,
                                maxHeight: '8vh'
                            }}
                            columns={20}
                        >
                            {/* Logo */}
                            <Grid2 
                                size={window.innerWidth > 1000 ? 3 : 10}
                                sx={
                                    window.innerWidth > 1000 ? {
                                        height: '8vh', 
                                        // minWidth: '35%', 
                                        // maxWidth: '35%', 
                                        padding: 0, 
                                        display: 'flex', 
                                        justifyContent: 'flex-start', 
                                        justifyContent: 'center', 
                                        alignItems: 'center'
                                    } : {
                                        height: '8vh', 
                                        // minWidth: '50%', 
                                        // maxWidth: '50%', 
                                        padding: 0, 
                                        display: 'flex', 
                                        justifyContent: 'flex-start', 
                                        alignItems: 'center'
                                    }
                                }
                            >
                                {/* {window.innerWidth > 1000 
                                    ? <Logo width="50%" height="60%" /> 
                                    : <Logo width="70%" height="100%" />
                                } */}
                                <Logo width="60%" height="60%" />
                            </Grid2>

                            {/* List or Menu */}
                            <Grid2 
                                size={"grow"}
                                sx={
                                window.innerWidth > 1000 
                                ? {height: '100%', 
                                    // minWidth: '55%', maxWidth: '55%', 
                                    padding: 0} 
                                : {height: '100%', 
                                    // minWidth: '35%', maxWidth: '35%', 
                                    padding: 0, display: 'flex', justifyContent: 'flex-end', }} >
                                {/* Show smaller hamburger for small screens and a list for large screen */}
                                {window.innerWidth > 1000 ? 
                                    <List sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: 0}}>
                                        {navItems.map((item,index)=>(
                                            <ListItem
                                                key={index}
                                                sx={{display: 'flex', flexDirection: 'column', maxWidth: 'fit-content'}}
                                                onClick={() => {setState(prev => {return {...prev, page: item.route}})}}
                                            >
                                                <ListItemText 
                                                    sx={{ cursor:"pointer", color: '#fff', textAlign:'center' }}
                                                    // onClick={()=>handleSelectTopic(index)}
                                                    primaryTypographyProps = {{
                                                        color:matchLocation(location, item.route)?"#fff": blue[500],
                                                        fontWeight:"500",
                                                        fontSize: '15px'
                                                    }}
                                                    primary={item.name} 
                                                />
                                                {/* Underline */}
                                                <div style={{
                                                    width: '100%', 
                                                    height: '0.3vh', 
                                                    backgroundColor:"#fff", 
                                                    opacity: matchLocation(location, item.route)?'1':'0'
                                                }} />
                                            </ListItem>
                                        ))}
                                    </List> 
                                : 
                                <>
                                    <Button
                                        id="demo-customized-button"
                                        aria-controls={open ? 'demo-customized-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        variant="text"
                                        disableElevation
                                        onClick={handleOpenClose}
                                        sx={{ color: "#ffffff"}}
                                    >
                                        {window.innerWidth > 500 ? "Options" : <MenuIcon sx = {{fontSize: "40px"}}/>}
                                    </Button>
                                    <StyledMenu
                                        id="demo-customized-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={() => {setState(prev => {return {...prev, page: item.route}})}}
                                    >
                                        {navItems.map((item, index) => {
                                            return (<MenuItem key={index} id={item.name} onClick={() => {setState(prev => {return {...prev, page: item.route}})}} disableRipple>
                                            {item.name}
                                            </MenuItem>)
                                        })}
                                    </StyledMenu>
                                </>                                     
                                }
                            </Grid2>

                            {/* Avatar */}
                            <Grid2 
                                size={window.innerWidth > 1000 ? 2 : 3}
                                sx={
                                    window.innerWidth > 1000 
                                    ? {
                                        // width: '10%', 
                                        height: '60%', display:'flex', justifyContent:'center'
                                    } : {
                                        // width: '15%', 
                                        height: '60%', display:'flex', justifyContent:'flex-end', pr: 3
                                    }
                                } 
                            >
                                <IconButton
                                    onClick={handleClick}
                                    size="small"
                                    // sx={{ ml: 2 }}
                                    aria-controls={avatarMenuOpen ? 'account-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={avatarMenuOpen ? 'true' : undefined}
                                >
                                    <Avatar src="/broken-image.jpg" sx={window.innerWidth > 1000 ? { bgcolor: blue[600] , width: 35, height: 35} : { bgcolor: blue[600] , width: 30, height: 30}}/>
                                </IconButton>
                                <Menu
                                    anchorEl={avatarEl}
                                    id="account-menu"
                                    open={avatarMenuOpen}
                                    onClose={handleClose}
                                    onClick={handleClose}
                                    slotProps={{
                                    paper: {
                                        elevation: 0,
                                        sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                        '&::before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: 'background.paper',
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                        },
                                    },
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <MenuItem id="profile" onClick={handleClose}>
                                        <Avatar /> Profile
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem id="logout" onClick={handleClose}>
                                        <ListItemIcon>
                                            <Logout fontSize="small" />
                                        </ListItemIcon>
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </Grid2>
                        </Grid2>
                    </AppBar>
                </Box>
                <Box sx={{ height: { sm: '93vh', lg: '92vh'}, display: 'flex', flexDirection: window.innerWidth > 1000 ? 'row' : 'column' }}>
                    {children}
                </Box>
                </>
            }
        </Box>
    );
}

export default Navbar