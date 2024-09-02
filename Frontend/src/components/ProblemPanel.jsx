import {
    Select,
    Typography,
    Stack,
  } from "@mui/material";
  import Markdown from "react-markdown";
  
  const ProblemPanel = ({ problemStatement }) => {
    return (
      <Stack spacing={1} direction="column" padding={2}>
        {/* <Select fullWidth /> */}
        <Typography variant="h5" sx={{ color: "#006CB8" }}>
          Description :
        </Typography>
        <Markdown>{problemStatement}</Markdown>
        {/* <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "20%",
            overflowY: "auto",
            flexWrap: "wrap",
          }}
        >
          {testcases.map((testcase, index) => (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
              }}
            >
              <Typography sx={{ color: "#006CB8", fontWeight: "bold" }}>
                Sample test case {index + 1} :
              </Typography>
              <Typography>Input:</Typography>
              {testcase.input}
              <Typography>Output:</Typography>
              {testcase.expected_output}
            </Box>
          ))}
        </Box> */}
      </Stack>
    );
  };
  
  export default ProblemPanel;