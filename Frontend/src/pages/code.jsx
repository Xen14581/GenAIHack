import { Grid2 as Grid, Box, Stack } from '@mui/material';
import { useState, useLayoutEffect } from 'react';
import ProblemPanel from '../components/ProblemPanel';
import ChatBox from '../components/ChatBox';
import CodeEditor from '../components/CodeEditor';
import TestPanel from '../components/TestPanel';
import getCode from '../apis/code';

const Code = () => {
    const [problem, setProblem] = useState({})

    useLayoutEffect(() => {
        const getdata = async () => {
            const data = await getCode()
            setProblem(data)
        }
        getdata()
    }, [problem])

    return (
        <>
            {Object.keys(problem).length && 
                <Grid container spacing={1} sx={{width: '100%', py: "0.5rem"}}>
                    <Grid size={3} sx={{ border: 1, borderColor: '#aaa', borderWidth: '1px', borderRadius: '12px' }}>
                        <ProblemPanel problemStatement={problem.programming_question} />
                    </Grid>
                    <Grid size={6}>
                        <Stack style={{ height: '100%'}} spacing={1}>
                            <Box sx={{ height: '60%', width: '100%'}}>
                                <CodeEditor codeTemplate={problem.template_code} />
                            </Box>
                            <Box sx={{ height: '40%', width: '100%'}}>
                                <TestPanel testCases={problem.test_cases} />
                            </Box>
                        </Stack>
                    </Grid>
                    <Grid size={3} sx={{ border: 1, borderColor: '#aaa', borderWidth: '1px', borderRadius: '12px' }}>
                        <ChatBox chatHistory={problem.chatHistory} />
                    </Grid>
                </Grid>
            }
        </>
    )
}

export default Code;