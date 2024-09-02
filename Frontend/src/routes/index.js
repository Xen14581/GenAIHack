import {
    createBrowserRouter,
} from "react-router-dom";
import Chat from "../pages/chat"
import Code from "../pages/code";
import Quiz from "../pages/quiz"
import LearnLayout from "../pages/learnLayout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <>Homepage</>,
    },
    {
        path: "/learn",
        element: <LearnLayout />,
        children: [
            {
                path: '/learn/chat',
                element: <Chat />
            },
            {
                path: "/learn/quiz",
                element: <Quiz />
            }
        ]
    },
    {
        path: "/learn/code",
        element: <Code />,
    },
    {
        path: "/report",
        element: <>Report Card</>
    }
]);

export default router