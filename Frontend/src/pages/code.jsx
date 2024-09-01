import { Grid2 as Grid, Box } from '@mui/material';
import { useState, useLayoutEffect } from 'react';
import ProblemPanel from '../components/ProblemPanel';
import ChatBox from '../components/ChatBox';
import CodeEditor from '../components/CodeEditor';
import TestPanel from '../components/TestPanel';
import { Resizable } from 'react-resizable';

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
                }
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
        <Grid container spacing={1} sx={{width: '100%', pb: "1rem"}}>
            <Grid size={3} sx={{ borderRight: 1, borderColor: '#000', borderWidth: '1px' }}>
                <ProblemPanel problemStatement={problem.problemStatement} />
            </Grid>
            <Grid size={6} sx={{}}>
                <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                    <Box sx={{ height: '60%', width: '100%'}}>
                        <CodeEditor codeTemplate={problem.codeTemplate} />
                    </Box>
                    <Box sx={{ height: '40%'}}>
                        <TestPanel testCases={problem.testCases} />
                    </Box>
                </div>
            </Grid>
            <Grid size={3} sx={{ borderLeft: 1, borderColor: '#000', borderWidth: '1px' }}>
                <ChatBox chatHistory={problem.chatHistory} />
            </Grid>
        </Grid>
    )
}

export default Code;