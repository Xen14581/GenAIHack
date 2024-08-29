import React from "react";
import { Drawer,List,ListItem, CssBaseline, ListItemText, Paper, Box } from "@mui/material";
import { useState,useEffect } from "react";

const SideBar=()=>{

    const [selectedTopic,setSelectedTopic]=useState("");

    const topics=[
        "Data Structures",
        "Linear Data Structures",
        "Non-Linear Data Structures",
        "Arrays",
        "Linked List",
        "Stack",
        "Queues",
        "Sorting - Introduction",
        "Bubble Sort",
        "Quick Sort",
        "Queues",
    ];

    const handleSelectTopic=(index)=>{
        setSelectedTopic(index);
    }

    return(
        <Box>
        <CssBaseline />
        {/* <Drawer
        variant="permanent"
        sx={{
        width:"20vw"
        }}
        > */}
        <Paper 
            sx={{
                width: '20vw', 
                height: '100%', 
                overflowY:"auto", 
                pl: 2, 
                borderRight: 1,
                borderRightColor: '#006CB8', 
                borderRightWidth: '1px',
                // borderRightStyle
            }} 
            elevation={1}
            square
        >
            <List sx={{overflowY:"auto"}}>
                {
                    topics.map((topic,index)=>(
                        <ListItem
                        key={index}
                        >
                            <ListItemText 
                                // sx={{
                                //     color:selectedTopic===index?"#002A47":"#000000",
                                //     fontWeight:selectedTopic===index?"800":"600",
                                // }} 
                                sx={{ cursor:"pointer" }}
                                onClick={()=>handleSelectTopic(index)}
                                primaryTypographyProps = {{
                                    color:selectedTopic===index?"#002A47":"#000000",
                                    fontWeight:selectedTopic===index?"800":"400",
                                    
                                }}
                                primary={topic} 
                            />
                        </ListItem>
                    ))
                }
            </List>
        </Paper>
        {/* </Drawer> */}
        </Box>
    )

}

export default SideBar;