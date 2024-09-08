import * as React from 'react';
import { Grid2, Divider, Paper } from '@mui/material';

// Imports for select
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// Imports for heatmap
import CalendarHeatmap from 'react-calendar-heatmap';
import '../styles.css'
import { getAnalytics } from '../apis/analytics';
import { useSelector } from 'react-redux';

const ReportCard=()=>{

    const [userObj, setObj] = React.useState({})
    const [state, setState] = React.useState({
        distinctConsistencyYears: [],
    })
    // set year
    const [yearConsistency, setYearConsistency] = React.useState(0);
    // change display list
    const [loginList, setList] = React.useState(null)
    const user = useSelector(state => state.user.value)

    React.useLayoutEffect(() => {
        const getdata = async () => {
            const data = await getAnalytics(user.token)
            setObj(data)
            let dyears = Array.from(new Set(data?.logins?.map(login => new Date(login.date).getFullYear()))).sort((a, b) => b - a)
            setState(prev=>{
                return {
                    ...prev,
                    distinctConsistencyYears: dyears
                }
            })
            setYearConsistency(dyears[0])
            setList(filterByYear(data?.logins, dyears[0]))
        }
        getdata()
    }, [])

    // Extract years from the dates, make them distinct, and sort in descending order
    // const distinctConsistencyYears = Array.from(new Set(userObj?.logins?.map(login => new Date(login.date).getFullYear()))).sort((a, b) => b - a)

    // Filter login by year
    const filterByYear = (logins, year) => {
        return logins?.filter(login => new Date(login.date).getFullYear() === year);
    }; 


    const handleChangeYear = (event) => {
        setYearConsistency(event.target.value);
        setList(filterByYear(userObj?.logins, event.target.value))
    };

    const getYearBefore = (year) => {
        const previous_year = String(parseInt(year, 10) - 1)
        return previous_year
    }

    // Set and Control the topic
    const [topic, setTopic] = React.useState("")
    const [topicMetadata, setTopicMetadata] = React.useState({})

    // Get topic metadata from userObj
    const filterByTopic = (obj, topic) => {
        return obj[topic]
    }

    // Set topic to view
    const handleChangeTopic = (event) => {
        setTopic(event.target.value)
        setTopicMetadata(filterByTopic(userObj?.scores, event.target.value))
    }
    

    return(
        <>
        {Object.keys(userObj).length && 
            <Grid2 container sx={{overflowX: "hidden", minWidth:"100%", maxWidth: "100%", padding: "5vh 2%", maxHeight:"90vh",  overflowY : "scroll"}} id="Report-Card-Page-Contaier">
                <Grid2 item container size={{xs:12}} alignContent={"flex-start"} sx={{overflowX: "hidden", height: "max-content"}} id ="Report-Card-Consistency-Container" spacing={4}>
                    <Grid2 item size={{xs: 12, md: 3}} sx={window.innerWidth > 1000? {overflowX: "hidden", color: "#002A47ff", maxHeight: "max-content", display: 'flex', alignItems:'center'} : {overflowX: "hidden", color: "#002A47ff", textAlign: "center", height: "max-content"}} id="Report-Card-Consistency-Item-Text">
                        Your consistency for the year
                    </Grid2>
                    <Grid2 item size={{xs: 12, md: 9}} sx={window.innerWidth > 1000? {overflowX: "hidden", color: "#002A47ff", maxHeight: "max-content"} : {overflowX: "hidden", color: "#002A47ff", textAlign: "center", height: "max-content"}} id="Report-Card-Consistency-Item-Text-Selector">
                        <FormControl sx={{ m: 1, minWidth: 250 }}>
                            <Select
                            value={yearConsistency}
                            onChange={handleChangeYear}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            >
                                {state?.distinctConsistencyYears.map((value, index) => {
                                    return(
                                        <MenuItem value={value} key={index}>{value}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                    </Grid2>
                    <Grid2 item size={{xs: 12}} sx={window.innerWidth > 1000? {overflowX: "hidden", color: "#002A47ff", maxHeight: "max-content"} : {overflowX: "hidden", color: "#002A47ff", textAlign: "center", height: "max-content"}} id="Report-Card-Consistency-Item-Text-Selector">
                        <CalendarHeatmap
                            startDate={new Date(`${getYearBefore(yearConsistency)}-12-31`)}
                            endDate={new Date(`${yearConsistency}-12-31`)}
                            values={loginList}
                            />
                    </Grid2>
                </Grid2>
                <Grid2 item container size={{xs:12}} alignContent={"flex-start"} sx={{overflowX: "hidden", }} id ="Report-Card-Topic-Container" spacing={0}>
                    <Grid2 item size={{xs: 12}} sx={window.innerWidth > 1000? {overflowX: "hidden", color: "#002A47ff", maxHeight: "max-content", padding: "3vh 0 "} : {padding: "1vh 0", overflowX: "hidden", color: "#002A47ff", textAlign: "center", height: "max-content"}} id="Report-Card-Consistency-Item-Text-Selector">
                        <Divider sx={{border : "1px solid #002A47"}}/>
                    </Grid2>
                    <Grid2 item size={{xs: 12, md: 3}} sx={window.innerWidth > 1000? {overflowX: "hidden", color: "#002A47ff", maxHeight: "max-content", display: 'flex', alignItems:'center'} : {overflowX: "hidden", color: "#002A47ff", textAlign: "center", height: "max-content"}} id="Report-Card-Consistency-Item-Text">
                        Your proficiency for the topic
                    </Grid2>
                    <Grid2 item size={{xs: 12, md: 9}} sx={window.innerWidth > 1000? {overflowX: "hidden", color: "#002A47ff", maxHeight: "max-content"} : {overflowX: "hidden", color: "#002A47ff", textAlign: "center", height: "max-content"}} id="Report-Card-Consistency-Item-Text-Selector">
                        <FormControl sx={{ m: 1, minWidth: 250 }}>
                            <Select
                                value={topic}
                                onChange={handleChangeTopic}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem disabled value="">
                                    <em>Choose topic</em>
                                </MenuItem>
                                {Object.keys(userObj?.scores).map((value, index) => {
                                    return(
                                        <MenuItem value={value} key={index}>{value}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                    </Grid2>
                    {Object.keys(topicMetadata).length === 0?
                        <>
                            <Grid2 item size={{xs: 12, md: 3}} sx={window.innerWidth > 1000? {overflowX: "hidden", color: "#002A47ff", maxHeight: "max-content", padding: "1%"} : {padding: "1%", overflowX: "hidden", color: "#002A47ff", textAlign: "center", height: "max-content"}} id="Report-Card-Consistency-Item-Text-Selector">
                                <h3>Choose a topic </h3>
                            </Grid2>
                        </> :  
                        <>
                            <Grid2 item size={{xs: 12, md: 4}} sx={window.innerWidth > 1000? {overflowX: "hidden", color: "#002A47ff", maxHeight: "100%", padding: "1%"} : {padding: "1%", overflowX: "hidden", color: "#002A47ff", textAlign: "center", height: "max-content"}} id="Report-Card-Consistency-Item-Text-Selector">
                                <Paper elevation={3} sx={{padding: "1vw 3vh", backgroundColor: "#0077FF24", fontColor: "#002A47", height: "100%"}}>
                                    <h2 style={{fontWeight:400}}>Queries Asked</h2>
                                    <h1>{topicMetadata?.queriesAsked}</h1>
                                </Paper>
                            </Grid2>
                            <Grid2 item size={{xs: 12, md: 4}} sx={window.innerWidth > 1000? {overflowX: "hidden", color: "#002A47ff", maxHeight: "100%", padding: "1%"} : {padding: "1%", overflowX: "hidden", color: "#002A47ff", textAlign: "center", height: "max-content"}} id="Report-Card-Consistency-Item-Text-Selector">
                                <Paper elevation={3} sx={{padding: "1vw 3vh", backgroundColor: "#0077FF24", fontColor: "#002A47",  height: "100%"}}>
                                    <h2 style={{fontWeight:400}}>Quiz Question Results</h2>
                                    <h1>{topicMetadata?.quizScore} of {topicMetadata?.quizQuestions}</h1>
                                </Paper>
                            </Grid2>
                            <Grid2 item size={{xs: 12, md: 4}} sx={window.innerWidth > 1000? {overflowX: "hidden", color: "#002A47ff", maxHeight: "100%", padding: "1%"} : {padding: "1%", overflowX: "hidden", color: "#002A47ff", textAlign: "center", height: "max-content"}} id="Report-Card-Consistency-Item-Text-Selector">
                                <Paper elevation={3} sx={{padding: "1vw 3vh", backgroundColor: "#0077FF24", fontColor: "#002A47",  height: "100%"}}>
                                    <h2 style={{fontWeight:400}}>Coding Problems Solved</h2>
                                    <h1>{topicMetadata?.codingProblemsSolved} of {topicMetadata?.codingProblems}</h1>
                                </Paper>
                            </Grid2>
                            <Grid2 item size={{xs: 12}} sx={window.innerWidth > 1000? {overflowX: "hidden", color: "#002A47ff", maxHeight: "100%", padding: "1%"} : {padding: "1%", overflowX: "hidden", color: "#002A47ff", textAlign: "center", height: "max-content"}} id="Report-Card-Consistency-Item-Text-Selector">
                                <Paper elevation={3} sx={{padding: "1vw 3vh", backgroundColor: "#0077FF24", fontColor: "#002A47",  height: "100%"}}>
                                    <h2 style={{fontWeight:400}}>Your Standing</h2>
                                    <h1>{topicMetadata?.percentile} <span style={{"fontWeight": 400}}> percentile</span></h1>
                                </Paper>
                            </Grid2>
                        </> 
                    }

                                
                </Grid2>
            </Grid2>
        }
        </>
    )
}

export default ReportCard 


