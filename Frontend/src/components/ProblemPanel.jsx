import {
  Grid2 as Grid,
  Box,
  Select,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import { useState, useEffect } from "react";
import Markdown from "react-markdown";

const ProblemPanel = ({ problemStatement, testcases }) => {
  return (
    <Stack spacing={2} direction="column" padding={2}>
      <Select fullWidth />
      <Typography variant="h4" sx={{ color: "#006CB8" }}>
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
