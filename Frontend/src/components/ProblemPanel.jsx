import {
    Select,
    Typography,
    Stack,
    Box
  } from "@mui/material";
  import Markdown from "react-markdown";
  
  const ProblemPanel = ({ problemStatement }) => {
    return (
      <Stack spacing={1} direction="column" sx={{height: '100%', py: 2}}>
        {/* <Select fullWidth /> */}
        <Typography variant="h5" sx={{ color: "#006CB8", px: 2 }}>
          Description :
        </Typography>
        <Box sx={{overflowY: 'auto', px: 2}}>
          <Markdown>{problemStatement}</Markdown>
        </Box>
      </Stack>
    );
  };
  
  export default ProblemPanel;