import React from "react";
import { List,ListItem, CssBaseline, ListItemText, Paper, Box } from "@mui/material";
import { useState,useEffect } from "react";
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';



const SideBar=()=>{


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

    const [selectedTopic,setSelectedTopic]=useState("");
    const handleSelectTopic=(index)=>{
        console.log(index)
        setSelectedTopic(index);
    }

    return(
        <Box >
        <CssBaseline />
        {window.innerWidth > 1000 ? 
            <Paper 
                sx={{
                    width: '20vw', 
                    height: '100%', 
                    overflowY:"auto",  
                    paddingLeft: "2vw",
                }} 
                elevation={0}
                square
            >
                <List sx={{overflowY:"auto", maxHeight: "90vh"}}>
                    {
                        topics.map((topic,index)=>(
                            <ListItem
                            key={index}
                            >
                                <ListItemText 
                                    sx={{ cursor:"pointer" }}
                                    onClick={()=>handleSelectTopic(topic)}
                                    primaryTypographyProps = {{
                                        color:selectedTopic===topic?"#002A47":"#000000",
                                        fontWeight:selectedTopic===topic?"800":"400",
                                        
                                    }}
                                    primary={topic} 
                                />
                            </ListItem>
                        ))
                    }
                </List>
            </Paper>: 
            <Box 
                 sx={{
                     minWidth: '80vw', 
                     height: '100%', 
                     display: 'flex',
                     justifyContent: 'center'  
                 }} 
         
             >
                <FormControl variant="standard" sx={{ m: 1, mt: 3, width: '90%' }}>
                <Select
                displayEmpty
                variant="standard"
                value={selectedTopic}
                onChange={(event)=>handleSelectTopic(event.target.value)}
                input={<OutlinedInput />}
                inputProps={{ 'aria-label': 'Without label' }}
                >
                <MenuItem disabled value="">
                    <em>Select a Topic</em>
                </MenuItem>
                {topics.map((topic, index) => (
                    <MenuItem
                    key={index}
                    value={topic}

                    >
                    {topic}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
          </Box>
        }
        </Box>
    )

}

export default SideBar;