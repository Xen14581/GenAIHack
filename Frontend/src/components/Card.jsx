import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CardHeader,
  Stack,
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
        border: "0.5px solid black",
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
      <CardContent>
        <Stack
          spacing={3}
          direction="column"
          justifyContent={"center"}
          alignItems={"flex-start"}
          height={"100%"}
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
            variant="h7"
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
              width: "80%",
              justifyContent: "start",
              backgroundColor: "#006CB8",
            }}
          >
            Chat
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DSACard;
