import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CardHeader,
} from "@mui/material";

const DSACard = ({ title, content }) => {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        maxWidth: "25%",
        maxHeight: "100%",
        border: "1px solid black",
        borderRadius: "10px",
        "&:hover": {
          backgroundColor: "#006CB8",
          "& *": {
            color: "white",
          },
          "& Button": {
            backgroundColor: "white",
            color: "#006CB8",
          },
        },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "5",
        }}
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
          variant="h6"
          sx={{
            wordBreak: "break-word",
            whiteSpace: "normal",
            color: "#006CB8",
            overflowWrap: "wrap",
            marginBottom: "2vh",
          }}
        >
          {content}
        </Typography>
        <Button
          variant="contained"
          sx={{
            width: "70%",
            justifyContent: "start",
            backgroundColor: "#006CB8",
          }}
        >
          Chat
        </Button>
      </CardContent>
    </Card>
  );
};

export default DSACard;
