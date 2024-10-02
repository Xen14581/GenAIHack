import { Stack, Box, Typography, Fab, Grid2 as Grid, Button } from "@mui/material";
import { useState } from "react";

const TestPanel = ({testCases}) => {
    const [state, setState] = useState({
        selected: 0,
        hover: ''
    })

    return (
        <Stack spacing={1} sx={{border:1, borderWidth: '1px', borderRadius: '15px', borderColor: '#aaa', height: '100%'}}>
            {/* Heading */}
            <Box sx={{height: '10%', px:2, backgroundColor: '#E4F1FF', borderRadius: '12px 12px 0 0'}}>
                <Box sx={{height: '100%', display: 'flex', justifyContent: 'space-between'}}>
                    <Typography sx={{display: 'flex', alignItems: 'center'}}>
                        Testcase
                    </Typography>
                </Box>
            </Box>
            
            {/* Test Case Buttons */}
            <Stack spacing={1} direction="row" sx={{px:2, height: '10%'}}>
                {testCases?.map((test, index) => {
                    return (
                        <Button 
                            variant="extended" 
                            size="small" 
                            key={index} 
                            disableRipple 
                            onClick={() => setState(prev => {return { ...prev, selected: index}})}
                            sx={{boxShadow: 'none', borderRadius: '8px', backgroundColor: state.selected === index ? '#E4F1FF' : 'transparent'}} 
                        >
                            Case {index + 1}
                        </Button>
                    )
                })}
            </Stack>

            {/* Test cases */}
            <Stack sx={{px: 2, overflowY: 'auto'}} spacing={1}>
                <Typography>
                    Input
                </Typography>
                <Typography sx={{backgroundColor: '#E4F1FF', borderRadius: '5px', px: 2, py: testCases?.[state.selected]?.user_output ? 0 : 1}}>
                    {String(testCases?.[state.selected]?.input)}
                </Typography>
                <Typography>
                    Expected Output
                </Typography>
                <Typography sx={{backgroundColor: '#E4F1FF', borderRadius: '5px', px: 2, py: testCases?.[state.selected]?.user_output ? 0 : 1}}>
                    {testCases?.[state.selected]?.expected_output}
                </Typography>
                {testCases?.[state.selected]?.user_output 
                ? (
                    <>
                        <Typography>
                            User Output
                        </Typography>
                        <Typography sx={{backgroundColor: '#E4F1FF', borderRadius: '5px', px: 2}}>
                            {testCases?.[state.selected]?.user_output}
                        </Typography>
                    </>
                ) : (
                    <></>
                )}
            </Stack>
        </Stack>
    )
}

export default TestPanel;