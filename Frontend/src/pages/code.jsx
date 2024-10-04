import { Grid2 as Grid, Box, Stack, Tab, Tabs } from '@mui/material';
import { useState, useLayoutEffect } from 'react';
import ProblemPanel from '../components/ProblemPanel';
import ChatBox from '../components/ChatBox';
import CodeEditor from '../components/CodeEditor';
import TestPanel from '../components/TestPanel';
import { getCode, evaluateCode } from '../apis/code';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";

const Code = () => {
    document.title = "Learn | Code"

    const [problem, setProblem] = useState({})
    const [tab, setTab] = useState(0)
    let selectedTopic = useSelector(state => state.topic.selectedTopic)
    const user = useSelector(state => state.user.value)
    const dispatch = useDispatch()

    const submitCode = async (code) => {
        const data = await evaluateCode(user.token, selectedTopic.id, code)
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
                String(tcase.expected_output),
                'Score:',
                `${String(data.score)}%`
            ].join("\n")
        }).join("\n\n")}`
        localStorage.setItem("trigger", trigger)
    }

    const handleChange = (event, newValue) => {
        setTab(newValue);
    };

    useLayoutEffect(() => {
        if (!user) {
            window.location.href = "/auth/signIn"
        }
        const getdata = async () => {
            const data = await getCode(user.token, selectedTopic.id)
            setProblem(data)
        }
        getdata()
    }, [])

    return (
        <>
            {window.innerWidth > 1000 ?
                <>
                    {Object.keys(problem).length && 
                        <Grid container spacing={1} sx={{py: "0.5rem"}}>
                            <Grid size={3} sx={{ border: 1, borderColor: '#aaa', borderWidth: '1px', borderRadius: '12px', height: '100%' }}>
                                <ProblemPanel problemStatement={problem.programming_question} />
                            </Grid>
                            <Grid size={5} sx={{height: '90vh'}}>
                                {/* <Grid container direction='row' columns={12} spacing={1} sx={{height: '100%', width: '100%'}}>
                                    <Grid item size={8} sx={{width: '100%'}}>   
                                        <CodeEditor codeTemplate={problem.template_code} onSubmit={submitCode} />
                                    </Grid>
                                    <Grid item size={4} sx={{ width: '100%'}}>
                                        <TestPanel testCases={problem.test_cases} />
                                    </Grid>
                                </Grid> */}
                                <Stack style={{ maxHeight: '100%', minHeight: '100%', height: '100%'}} spacing={1}>
                                    <Box sx={{ height: '60%', width: '100%'}}>
                                        <CodeEditor codeTemplate={problem.template_code} onSubmit={submitCode} />
                                    </Box>
                                    <Box sx={{ height: '40%', width: '100%'}}>
                                        <TestPanel testCases={problem.test_cases} />
                                    </Box>
                                </Stack>
                            </Grid>
                            <Grid size={4} sx={{ border: 1, borderColor: '#aaa', borderWidth: '1px', borderRadius: '12px' }}>
                                <ChatBox width={window.innerWidth * 0.25} height={window.innerHeight * 0.88} />
                            </Grid>
                        </Grid>
                    }
                </>
            : 
                <>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tab} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Description" />
                            <Tab label="Code" />
                            <Tab label="Chat" />
                        </Tabs>
                    </Box>
                    {
                        tab === 0 ? 
                            <ProblemPanel problemStatement={problem.programming_question} />
                        :
                            tab === 1 ?
                                <Stack spacing={2}>
                                    <Box sx={{ height: '50vh', width: '100%'}}>
                                        <CodeEditor codeTemplate={problem.template_code} onSubmit={submitCode} />
                                    </Box>
                                    <Box sx={{ height: '40vh', width: '100%'}}>
                                        <TestPanel testCases={problem.test_cases} />
                                    </Box>
                                </Stack>
                            : tab === 2 ?
                                <ChatBox width={window.innerWidth} height={window.innerHeight * 0.85} />
                            :
                                "How did you even get here? Go back to tabs 0-2"
                    }
                </>
            }
        </>
    )
}

export default Code;