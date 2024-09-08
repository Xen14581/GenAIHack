import React from "react";
import { Grid, Typography, Stack, Button } from "@mui/material";
import Infographic from "../assets/Infographic.png";
import DSACard from "../components/Card";

const HomePage = () => {
  return (
    <Stack
      spacing={15}
      direction="column"
      sx={{
        height: "100%",
        width: "100%",
        paddingTop: "20vh",
      }}
    >
      <Stack
        spacing={2}
        width={"100%"}
        direction="row"
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Stack spacing={3} direction="column" width={"50%"}>
          <Typography variant="h3">
            Discover Learning through{" "}
            <span style={{ color: "#002A47" }}>SAGE.AI</span>
          </Typography>
          <Typography>
            Use the power of guided questioning to discover paradigms of DSA
            from within
          </Typography>
          <Stack spacing={3} direction="row">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#006CB8",
                border: "1px solid #006CB8",
                width: "25%",
              }}
            >
              Explore
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "white",
                color: "#006CB8",
                border: "1px solid #006CB8",
                width: "25%",
              }}
            >
              Login
            </Button>
          </Stack>
        </Stack>
        <img src={Infographic} sx={{ width: "50%", height: "50%" }} />
      </Stack>
      <Stack
        direction="column"
        justifyContent={"center"}
        alignItems={"center"}
        width={"100%"}
        height={"50%"}
        flexWrap={"wrap"}
      >
        <Typography
          variant="h2"
          sx={{
            color: "#006CB8",
            fontWeight: "bold",
            fontFamily: "Montserrat",
          }}
        >
          DSA fundamentals
        </Typography>
      </Stack>
      <Stack
        gap={8}
        direction={"row"}
        flexWrap={"wrap"}
        width={"100%"}
        justifyContent={"center"}
      >
        <DSACard
          title={"Stack"}
          content={
            "Helps the student build thorough understanding about the various types and operations of stack"
          }
        />
        <DSACard
          title={"Queue"}
          content={
            "Helps the student build thorough understanding about the various types and operations on queue"
          }
        />
        <DSACard
          title={"Heap"}
          content={
            "Helps the student build thorough understanding about the various types and operations on heap"
          }
        />
        <DSACard
          title={"Tree"}
          content={
            "Helps the student build thorough understanding about the various traversals and types of trees"
          }
        />
        <DSACard
          title={"Graph"}
          content={
            "Helps the student build thorough understanding about the various traversals of graphs"
          }
        />
        <DSACard
          title={"Sorting algorithms"}
          content={
            "Helps the student build thorough understanding about the various types of sorting algorithms"
          }
        />
        <DSACard
          title={"Searching algorithms"}
          content={
            "Helps the student build thorough understanding about the various types of searcing algorithms"
          }
        />
      </Stack>
    </Stack>
  );
};

export default HomePage;
