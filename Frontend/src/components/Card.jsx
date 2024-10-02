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
import remarkGfm from 'remark-gfm'
import components from "./MarkdownComponents";

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
        p: window.innerWidth > 1000 ? 2 : 1,
        width: "100%",
        height: "50vh",
        border: "1px solid black",
        borderRadius: "10px",
      }}
    >
      <CardContent sx={{maxHeight: '80%'}}>
        <Typography
          variant={window.innerWidth > 1000 ? "h5" : "h6"}
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
            fontSize: window.innerWidth > 1000 ? 15 : 13,
            overflowY: 'auto'
          }}
        >
          <Markdown remarkPlugins={[remarkGfm]} components={components}>
            {content}
          </Markdown>
        </Typography>
      </CardContent>
      <CardActions sx={{display: 'flex', justifyContent: 'center', p: 0}}>
        <Button
          variant="contained"
          size={window.innerWidth > 1000 ? "medium" : 'small'}
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
