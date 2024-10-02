import React, { useLayoutEffect, useRef } from "react";
import { Typography, Stack, Button, Divider, Grid2, Box } from "@mui/material";
import Infographic from "../assets/Infographic.png";
import DSACard from "../components/Card";
import { useSelector, useDispatch } from 'react-redux'
import Carousel from 'react-material-ui-carousel'
import { setAllTopics, updateTopic } from "../reducers/topicSlice";
import { getTopics } from "../apis/topics";
import { getTopicProgress } from "../apis/progress";

const HomePage = () => {
  document.title = "Sage.AI | Home"

  const user = useSelector(state => state.user.value)
  const topics = useSelector(state => state.topic.topics)
  const dispatch = useDispatch()
  const aboutRef = useRef(null)
  const topicsRef = useRef(null)

  const pages = ["Sage", "usage", "carousel", "coming", "soon!"]

  const handleScrollToIntro = () => {
    aboutRef.current.scrollIntoView({behavior: 'smooth', block: 'start'})
  }

  const handleScrollToCourse = () => {
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
      let data = await getTopics()
      dispatch(setAllTopics(data))
      if (user) {
        data.map(async topic => {
          let progress = await getTopicProgress(user.token, topic.id)
          dispatch(updateTopic([topic.id, progress]))
        })
      }
    }
    getdata()
  }, [])

  return (
    // Outer layer providing top and bottom padding
    <Stack
      spacing={6}
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
              onClick={handleScrollToIntro}
            >
              About Sage
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "white",
                color: "#006CB8",
                border: "1px solid #006CB8",
                width: window.innerWidth > 1000 ? "30%" : '45%',
              }}
              onClick={handleScrollToCourse}
            >
              {user ? "Browse Courses" : "Login"}
            </Button>
          </Stack>
        </Stack>
        
        {/* Image */}
        <img src={Infographic} style={{ width: window.innerWidth > 1000 ? "40%" : "90%", height: window.innerWidth > 1000 ? "40%" : "90%" }} />
      </Stack>

      {/* <Stack 
        direction={window.innerWidth > 1000 ? "row" : 'column'} 
        sx={{
          width: '100%', 
          height: '65vh', 
          backgroundColor: "#C4E0FF", 
          borderRadius: window.innerWidth > 1000 ? '8px' : 0, 
          scrollMarginTop: "12vh",

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          
        }}
        ref={aboutRef}
      >
        Why sage
        <Carousel height="100%" duration={100} sx={{width: '100%', height: '100%'}}>
          {pages.map((item, idx) => 
            <Box key={idx} sx={{display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
              <Typography variant="h2" sx={{fontSize: '25', color: 'white'}}>
                {item}
              </Typography>
            </Box>
          )}
        </Carousel>
      </Stack> */}

      <Stack
        direction="column"
        justifyContent={"center"}
        alignItems={"center"}
        width={"100%"}
        height={"50%"}
        flexWrap={"wrap"}
        ref={topicsRef}
        sx={{scrollMarginTop: "12vh"}}
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
      
      <Box sx={{width: '100%', overflowX: 'auto', height: window.innerWidth > 1000 ? '55vh' : 'min-content'}}>
        <Stack 
          direction="row"  
          spacing={3} 
          sx={{
            width: 'max-content', 
            height: '100%', 
            // display: 'flex', 
            // justifyContent: 'center',
          }}
        >
          {topics && topics.map((topic, idx) => 
            // <Grid2 item size={window.innerWidth > 1000 ? 3 : 10} key={idx} sx={{height: '100%'}}>
              <DSACard
                key={idx}
                topic={topic}
              />
            // </Grid2>
          )}
        </Stack>
      </Box>
    </Stack>
  );
};

export default HomePage;
