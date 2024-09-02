import {
    createBrowserRouter,
} from "react-router-dom";
import Example from "../pages/demo";
import Chat from "../pages/chat"
import Code from "../pages/code";
import Quiz from "../pages/quiz"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Chat />,
    },
    {
        path: "/learn/code",
        element: <Code />,
    },
    {
        path: "/learn/quiz/",
        element: <Quiz />,
    },
]);

export default router