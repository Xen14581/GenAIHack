import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CardHeader,
  CardActions
} from "@mui/material";
import { setTopic } from "../reducers/topicSlice";
import { useDispatch, useSelector } from "react-redux";
import Markdown from "react-markdown";

const DSACard = ({ topic }) => {
  const user = useSelector(state => state.user.value)
  const dispatch = useDispatch()

  const handleClick = () => {  
    dispatch(setTopic(topic))
    if (user) {
      window.location.href = "/learn/chat"
    } else {
      window.location.href = "/auth/signIn"
    }
  }

  let title = topic.title;
  let content = topic.description

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        justifyContent: 'space-between',
        p: 2,
        width: "100%",
        height: "100%",
        border: "1px solid black",
        borderRadius: "10px",
      }}
    >
      <CardContent
        sx={{padding: "5" }}
      >
        <Typography
          variant="h4"
          sx={{
            wordBreak: "break-word",
            whiteSpace: "normal",
            color: "#006CB8",
            overflowWrap: "wrap",
            color: "#006CB8",
            fontWeight: "bold",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="span"
          sx={{
            wordBreak: "break-word",
            whiteSpace: "normal",
            color: "#006CB8",
            overflowWrap: "wrap",
            marginBottom: "2vh",
            fontSize: 18
          }}
        >
          <Markdown>
          {"This module includes:\n1. Introduction to Stack\n2. Stack Operations\n3. Quiz\n4. Code"}
          </Markdown>
        </Typography>
      </CardContent>
      <CardActions sx={{display: 'flex', justifyContent: 'center'}}>
        <Button
          variant="contained"
          size="large"
          sx={{
            width: "90%",
            justifyContent: "start",
            backgroundColor: "#006CB8",
          }}
          // endIcon={}
          onClick={handleClick}
        >
          Start Learning
        </Button>
      </CardActions>
    </Card>
  );
};

export default DSACard;
