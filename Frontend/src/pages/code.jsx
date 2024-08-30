import { Grid2 as Grid, Box } from '@mui/material';

const Code = () => {
    return (
        <Grid container spacing={0} sx={{width: '100%', pb: "1rem"}}>
            <Grid size={3} sx={{ border: 1, borderColor: '#000', borderWidth: '1px'}}>
                size=8
            </Grid>
            <Grid size={6} sx={{ border: 1, borderColor: '#000', borderWidth: '1px'}}>
                <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                    <Box sx={{border: 1, borderColor: '#000', borderWidth: '1px', height: '60%'}}>
                        80
                    </Box>
                    <Box sx={{border: 1, borderColor: '#000', borderWidth: '1px', height: '40%'}}>
                        60
                    </Box>
                </div>
            </Grid>
            <Grid size={3} sx={{ border: 1, borderColor: '#000', borderWidth: '1px'}}>
                size=4
            </Grid>
        </Grid>
    )
}

export default Code;