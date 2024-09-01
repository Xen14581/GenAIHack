import { Grid2 as Grid, Box, Stack } from '@mui/material';
import { useState, useLayoutEffect } from 'react';
import ProblemPanel from '../components/ProblemPanel';
import ChatBox from '../components/ChatBox';
import CodeEditor from '../components/CodeEditor';
import TestPanel from '../components/TestPanel';

const Code = () => {

    const [problem, setProblem] = useState({
        problemStatement: 'Test Statement',
        codeTemplate: '<h1>I ♥ react-monacoeditor</h1>',
        testCases: [],
        chatHistory: []
    })

    useLayoutEffect(() => {
        const response = {
            "programming_question": "Write a function that returns the square of a number.",
            "template_code": "def square(n):\n    # Your code here\n    pass",
            "test_cases": [
                {
                    "input": [5],
                    "expected_output": "25"
                },
                {
                    "input": [0],
                    "expected_output": "0"
                },
                {
                    "input": [5],
                    "expected_output": "25"
                },
                {
                    "input": [0],
                    "expected_output": "0"
                },
                {
                    "input": [5],
                    "expected_output": "25"
                },
                {
                    "input": [0],
                    "expected_output": "0"
                },
            ]
        }
        setProblem(prev => {
            return {
                ...prev,
                problemStatement: response.programming_question,
                codeTemplate: response.template_code,
                testCases: response.test_cases,
            }

        })
    }, [setProblem])

    return (
        <Grid container spacing={1} sx={{width: '100%', py: "0.5rem"}}>
            <Grid size={3} sx={{ border: 1, borderColor: '#aaa', borderWidth: '1px', borderRadius: '12px' }}>
                <ProblemPanel problemStatement={problem.problemStatement} />
            </Grid>
            <Grid size={6}>
                <Stack style={{ height: '100%'}} spacing={1}>
                    <Box sx={{ height: '60%', width: '100%'}}>
                        <CodeEditor codeTemplate={problem.codeTemplate} />
                    </Box>
                    <Box sx={{ height: '40%', width: '100%'}}>
                        <TestPanel testCases={problem.testCases} />
                    </Box>
                </Stack>
            </Grid>
            <Grid size={3} sx={{ border: 1, borderColor: '#aaa', borderWidth: '1px', borderRadius: '12px' }}>
                <ChatBox chatHistory={problem.chatHistory} />
            </Grid>
        </Grid>
    )
}

export default Code;