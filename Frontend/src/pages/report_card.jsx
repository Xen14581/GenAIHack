import * as React from 'react';
import { Grid2 } from '@mui/material';

// Imports for select
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


const ReportCard=()=>{

    // Set and control year for consistency segment
    var today = new Date();
    const [year, setYear] = React.useState(String(today.getFullYear()));

    const handleChangeYear = (event) => {
        setYear(event.target.value);
    };

    // Set and Control the 
  
    return(
        <Grid2 container sx={{overflowX: "hidden", width:"max-content", maxWidth: "100%", padding: "8vh 2%"}} id="Report-Card-Page-Contaier">
            <Grid2 item container size={{xs:12}} sx={{overflowX: "hidden", width:"max-content", maxWidth: "100%"}} id ="Report-Card-Consistency-Container" spacing={4}>
                <Grid2 item size={{xs: 12, md: 6}} sx={window.innerWidth > 1000? {overflowX: "hidden", width:"max-content", maxWidth: "100%", color: "#002A47ff"} : {overflowX: "hidden", width:"max-content", maxWidth: "100%", color: "#002A47ff", textAlign: "center"}} id="Report-Card-Consistency-Item-Text-Selector">
                    Your consistency for the year
                </Grid2>
                <Grid2 item size={{xs: 12, md: 6}} sx={window.innerWidth > 1000? {overflowX: "hidden", width:"max-content", maxWidth: "100%", color: "#002A47ff"} : {overflowX: "hidden", width:"max-content", maxWidth: "100%", color: "#002A47ff", textAlign: "center"}} id="Report-Card-Consistency-Item-Text-Selector">
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <Select
                        value={year}
                        onChange={handleChangeYear}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                </Grid2>
            </Grid2>
        </Grid2>
        
    )
}

export default ReportCard 


