import React from "react";
import { Drawer,List,ListItem, CssBaseline, ListItemText, Paper, Box } from "@mui/material";
import { useState,useEffect } from "react";

const SideBar=()=>{

    const [allTopics, setTopics] = useState([])
    const [selectedTopic,setSelectedTopic]=useState("");

    useEffect(() => {
        setTopics([
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
        ]);
    }, [])

    const handleSelectTopic=(index)=>{
        setSelectedTopic(index);
    }

    return(
        <Box>
            <CssBaseline />
            <Paper 
                sx={{
                    width: '20vw', 
                    height: '100%', 
                    pl: 2, 
                    pt: 1,
                }} 
                elevation={0}
                square
            >
                <Box sx={{
                    borderRight: 1,
                    borderRightColor: '#006CB8', 
                    borderRightWidth: '1px',
                    height: '98%', 
                }}>
                    <List sx={{overflowY:"auto"}}>
                        {
                            allTopics.map((topic,index)=>(
                                <ListItem
                                key={index}
                                sx={{display: 'flex', flexDirection: 'column'}}
                                >
                                    <ListItemText 
                                        // sx={{
                                        //     color:selectedTopic===index?"#002A47":"#000000",
                                        //     fontWeight:selectedTopic===index?"800":"600",
                                        // }} 
                                        sx={{ cursor:"pointer", width: '100%' }}
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
                </Box>
            </Paper>
        </Box>
    )

}

export default SideBar;