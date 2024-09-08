import React, { useLayoutEffect, useRef } from "react";
import { Typography, Stack, Button, Divider, Grid2 } from "@mui/material";
import Infographic from "../assets/Infographic.png";
import DSACard from "../components/Card";
import { useSelector, useDispatch } from 'react-redux'
import { setAllTopics } from "../reducers/topicSlice";
import { getTopics } from "../apis/topics";

const HomePage = () => {
  const user = useSelector(state => state.user.value)
  const topics = useSelector(state => state.topic.topics)
  const dispatch = useDispatch()
  const topicsRef = useRef(null)

  const handleScroll = () => {
    topicsRef.current.scrollIntoView({behavior: 'smooth', block: 'start'})
  }

  const handleRedirect = () => {
    if (user) {
      window.location.href = "/learn/chat"
    } else {
      window.location.href = "/auth/signIn"
    }
  }

  useLayoutEffect(() => {
    const getdata = async () => {
      const data = await getTopics()
      dispatch(setAllTopics(data))
    }
    getdata()
  }, [])

  return (
    <Stack
      spacing={8}
      direction="column"
      sx={{
        height: "min-content",
        width: "100%",
        py: "7vh",
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
          <Typography variant="h5">
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
              onClick={handleScroll}
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
              onClick={handleRedirect}
            >
              {user ? "Start Learning" : "Login"}
            </Button>
          </Stack>
        </Stack>
        <img src={Infographic} sx={{ width: "50%", height: "50%" }} />
      </Stack>

      <Divider />

      <Stack
        direction="column"
        justifyContent={"center"}
        alignItems={"center"}
        width={"100%"}
        height={"50%"}
        flexWrap={"wrap"}
        ref={topicsRef}
      >
        <Typography
          variant="h2"
          sx={{
            color: "#006CB8",
            fontWeight: "bold",
            fontFamily: "Montserrat",
          }}
        >
          DSA FUNDAMENTALS
        </Typography>
      </Stack>
      
      <Grid2 container columns={12} spacing={2} sx={{width: '100%', height: '50vh', display: 'flex', justifyContent: 'center'}}>
        {topics && topics.map((topic, idx) => 
          <Grid2 item size={4} key={idx} sx={{height: '100%'}}>
            <DSACard
              topic={topic}
            />
          </Grid2>
        )}
      </Grid2>
    </Stack>
  );
};

export default HomePage;
