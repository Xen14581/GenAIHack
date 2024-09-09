import React, { useLayoutEffect, useRef } from "react";
import { Typography, Stack, Button, Divider, Grid2, Box } from "@mui/material";
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
    // Outer layer providing top and bottom padding
    <Stack
      spacing={8}
      direction="column"
      sx={{
        height: "min-content",
        width: "100%",
        py: window.innerWidth > 1000 ? "7vh" : '5vh',
      }}
    >

      {/* Infographic stack containing text and image */}
      <Stack
        spacing={2}
        width={"100%"}
        direction={window.innerWidth > 1000 ? "row" : "column-reverse"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        
        {/* Text stack */}
        <Stack spacing={3} direction="column" width={window.innerWidth > 1000 ? "50%" : "80%"}>
          <Box sx={{display: 'flex', justifyContent: window.innerWidth > 1000 ? 'flex-start' : 'center', flexDirection: 'column'}}>
          <Typography variant={window.innerWidth > 1000 ? "h3" : "h5"} sx={{textAlign: window.innerWidth > 1000 ? 'start' : 'center'}}>
            Discover Learning through{" "}
          </Typography>
          <span style={{ color: "#002A47", fontWeight: '600', fontSize: window.innerWidth > 1000 ? 40 : 40, textAlign: window.innerWidth > 1000 ? 'start' : 'center' }}>SAGE.AI</span>
          </Box>
          <Typography variant={window.innerWidth > 1000 ? "h5" : 'h6'} sx={{textAlign: window.innerWidth > 1000 ? 'start' : 'center'}}>
            Use the power of guided questioning to discover paradigms of DSA
            from within
          </Typography>
          <Stack spacing={3} direction="row" sx={{display: 'flex', flexDirection: 'row', justifyContent: window.innerWidth > 1000 ? 'start' : 'center'}}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#006CB8",
                border: "1px solid #006CB8",
                width: window.innerWidth > 1000 ? "25%" : '35%',
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
                width: window.innerWidth > 1000 ? "25%" : '35%',
              }}
              onClick={handleRedirect}
            >
              {user ? "Start Learning" : "Login"}
            </Button>
          </Stack>
        </Stack>
        
        {/* Image */}
        <img src={Infographic} style={{ width: window.innerWidth > 1000 ? "40%" : "90%", height: window.innerWidth > 1000 ? "40%" : "90%" }} />
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
          variant={window.innerWidth > 1000 ? "h4" : 'h4'}
          sx={{
            color: "#006CB8",
            fontWeight: "bold",
            fontFamily: "Montserrat",
            textAlign: window.innerWidth > 1000 ? 'start' : 'center'
          }}
        >
          Topics we will help you learn
        </Typography>
      </Stack>
      
      <Grid2 container columns={12} spacing={2} sx={{width: '100%', height: '50vh', display: 'flex', justifyContent: 'center'}}>
        {topics && topics.map((topic, idx) => 
          <Grid2 item size={window.innerWidth > 1000 ? 4 : 8} key={idx} sx={{height: '100%'}}>
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
