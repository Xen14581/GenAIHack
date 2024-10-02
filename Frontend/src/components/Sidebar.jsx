import React from "react";
import { List,ListItem, CssBaseline, ListItemText, Paper, Box, Divider, Stack } from "@mui/material";
import { useState,useEffect } from "react";
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSelector, useDispatch } from 'react-redux'
import { setTopic, updateTopic } from "../reducers/topicSlice";
import {getTopicProgress} from "../apis/progress";

const SideBar=()=>{

    let selectedTopic = useSelector(state => state.topic.selectedTopic)
    const topics = useSelector(state => state.topic.topics)
    const user = useSelector(state => state.user.value)
    const dispatch = useDispatch()
    
    const handleSelectTopic=(topic)=>{
        dispatch(setTopic(topic))
    }

    useEffect(() => {
        const getdata = async () => {
            if (![0,1,2,3,4].includes(selectedTopic.progress)) {
                let progress = await getTopicProgress(user.token, selectedTopic.id)
                dispatch(updateTopic([selectedTopic.id, progress]))
            }
        }
        getdata()
    }, [selectedTopic])

    return(
        <Box sx={{height: '100%', py: window.innerWidth > 1000 ? 3 : 0}}>
            <CssBaseline />
            {window.innerWidth > 1000 ? 
                <Paper 
                    sx={{
                        width: '17vw', 
                        height: '100%', 
                        overflowY:"auto",  
                        paddingLeft: "1vw",
                        borderRight: 1,
                        borderRightWidth: '1px',
                        borderRightColor: '#000'
                    }} 
                    elevation={0}
                    square
                >
                    <Stack sx={{maxHeight: "100%", width: '100%', overflowY:"auto",}}>
                        {
                            topics.map((topic,index)=>(
                                <Box key={index}>
                                    <List>
                                        <ListItem
                                        sx={{
                                            // border: selectedTopic.title === topic.title ? '1px solid #222' : '1px solid #aaa', 
                                            // my: '0.2vh', 
                                            width: '98%',
                                            cursor: 'pointer',
                                            // borderRadius: '8px'
                                        }}
                                        onClick={()=>handleSelectTopic(topic)}
                                        secondaryAction={
                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                <CheckCircleIcon fontSize="small" color="success" sx={{opacity: topic.progress >= 4 ? 1 : 0}} />
                                            </Box>
                                        }
                                        >
                                            <ListItemText 
                                                sx={{ cursor:"pointer" }}
                                                primaryTypographyProps = {{
                                                    color: selectedTopic.title === topic.title ? "#002A47" : "#000000",
                                                    fontWeight: selectedTopic.title === topic.title ? "800" : "400",
                                                    
                                                }}
                                                primary={topic.title} 
                                            />
                                        </ListItem>
                                    </List>
                                    <Divider />
                                </Box>
                            ))
                        }
                    </Stack>
                </Paper>
                : 
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
                    value={selectedTopic.title}
                    // onChange={(e)=>handleSelectTopic(e.target.value)}
                    input={<OutlinedInput />}
                    inputProps={{ 'aria-label': 'Without label' }}
                    >
                        <MenuItem disabled value="">
                            <em>Select a Topic</em>
                        </MenuItem>
                        {topics.map((topic, index) => (
                            <MenuItem
                                key={index}
                                value={topic.title}
                                onClick={() => handleSelectTopic(topic)}
                            >
                                {topic.title}
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