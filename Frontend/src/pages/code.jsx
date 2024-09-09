import { Grid2 as Grid, Box, Stack } from '@mui/material';
import { useState, useLayoutEffect } from 'react';
import ProblemPanel from '../components/ProblemPanel';
import ChatBox from '../components/ChatBox';
import CodeEditor from '../components/CodeEditor';
import TestPanel from '../components/TestPanel';
import { getCode, evaluateCode } from '../apis/code';
import { useSelector } from 'react-redux';

const Code = () => {
    const [problem, setProblem] = useState({})
    const selectedTopic = useSelector(state => state.topic.selectedTopic)
    const user = useSelector(state => state.user.value)

    const submitCode = async (code) => {
        const data = await evaluateCode(user.token, selectedTopic.id, code)
        console.log(data)
        setProblem(prev => {
            return {
                ...prev,
                test_cases: data.results
            }
        })
        let trigger = `Student Code:\n${code}\nTest Cases:\n\n${data.results.map(tcase => {
            return [
                'Input:', 
                String(tcase.input), 
                'Student Code Output:', 
                String(tcase.user_output), 
                'Expected Output:', 
                String(tcase.expected_output)
            ].join("\n")
        }).join("\n\n")}`
        localStorage.setItem("trigger", trigger)
    }

    useLayoutEffect(() => {
        const getdata = async () => {
            const data = await getCode(user.token, selectedTopic.id)
            setProblem(data)
        }
        getdata()
    }, [])

    console.log(problem.test_cases)

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
                                <CodeEditor codeTemplate={problem.template_code} onSubmit={submitCode} />
                            </Box>
                            <Box sx={{ height: '40%', width: '100%'}}>
                                <TestPanel testCases={problem.test_cases} />
                            </Box>
                        </Stack>
                    </Grid>
                    <Grid size={3} sx={{ border: 1, borderColor: '#aaa', borderWidth: '1px', borderRadius: '12px' }}>
                        <ChatBox />
                    </Grid>
                </Grid>
            }
        </>
    )
}

export default Code;