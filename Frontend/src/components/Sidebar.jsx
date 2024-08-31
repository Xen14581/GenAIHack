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
                elevation={1}
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
                                        color:selectedTopic===index?"#002A47":"#000000",
                                        fontWeight:selectedTopic===index?"800":"400",
                                        
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
                <FormControl sx={{ m: 1, mt: 3, width: '90%' }}>
                <Select
                displayEmpty
                value={selectedTopic}
                onChange={(event)=>handleSelectTopic(event.target.value)}
                input={<OutlinedInput />}
                // MenuProps={{PaperProps: {style: {maxHeight: 48 * 4.5 + 8, width: 250}}}}
                inputProps={{ 'aria-label': 'Without label' }}
                >
                <MenuItem disabled value="">
                    <em>Placeholder</em>
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