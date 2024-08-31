import React from "react";
import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

const Message = ({ role, message }) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: role === "assistant" ? "flex-start" : "flex-end",
      }}
    >
      <Box
        sx={{
          display: "flex",
          backgroundColor: role === "assistant" ? "#DEEFFF" : "#006CB8",
          border:
            role === "assistant" ? "1px solid #006CB8" : "1px solid #006CB8",
          borderRadius: "10px",
          pr: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{ color: role === "assistant" ? "black" : "white", pl: 2 }}
        >
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

export default Message;
