import { Stack } from "@mui/material";
import { useState } from "react";

const TestPanel = ({testCases}) => {
    return (
        <Stack>
            {String(testCases)}
        </Stack>
    )
}

export default TestPanel;