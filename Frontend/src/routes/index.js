import {
    createBrowserRouter,
    Outlet,
} from "react-router-dom";
import Chat from "../pages/chat"
import Code from "../pages/code";
import Quiz from "../pages/quiz"
import LearnLayout from "../pages/learnLayout";
import SignUp from "../pages/signup";
import AuthLayout from "../pages/authLayout";
import HomePage from "../pages/home";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            {
                path: '/auth/signIn',
                element: <SignUp />,
            }
        ]
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
        path: "/report-card",
        element: <>Report Card</>
    }
]);

export default router