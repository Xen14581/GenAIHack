import React from "react";
import {
  TextField,
  Button,
  Box,
  Paper,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Message from "./Message";
import Loader from "./Loader";
import { useState } from "react";
import { ReactComponent as Logo } from "../assets/Logo-rev.svg";
import arrow from "../assets/right-arrow.png";

const ChatBox = () => {
  const [chats, setChats] = useState(["Hello I am sage. Ask me anything"]);
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    setChats(() => [...chats, value]);
  };

  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  return (
    //main Box
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        pl: 2,
        pr: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflowY: "auto",
          justifyContent: "flex-end",
          py: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "fixed",
            width: "65%",
            pb: 20,
          }}
        >
          <Logo width="25%" height="25%" opacity="0.045" />
        </Box>
        {chats.map((msg, index) => (
          <Message role={index % 2 == 0 ? "assistant" : "user"} message={msg} />
        ))}
      </Box>
      <Box sx={{ marginTop: "auto", marginBottom: "5vh", width: "100%" }}>
        <Stack spacing={2} direction="row">
          <TextField
            label="Message SAGE.AI"
            sx={{ width: "100%" }}
            value={value}
            onChange={handleInputChange}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <img
                        src={arrow}
                        style={{ width: 30, height: 30 }}
                        onClick={handleSubmit}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>
      </Box>
    </Box>
  );
};

export default ChatBox;
