import {
    createBrowserRouter,
} from "react-router-dom";
import Chat from "../pages/chat"
import Code from "../pages/code";
import Quiz from "../pages/quiz"
import LearnLayout from "../pages/learnLayout";
import SignIn from "../pages/signin";
import SignUp from "../pages/signup";
import AuthLayout from "../pages/authLayout";
import HomePage from "../pages/home";
import Layout from "../pages/layout";
import ReportCard from "../pages/report_card";

const router = createBrowserRouter([
    // Auth routes
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            {
                path: '/auth/signIn',
                element: <SignIn />,
            },
            {
                path: '/auth/signUp',
                element: <SignUp />,
            }
        ]
    },

    // Navbar sites
    {
        path: "/",
        element: <Layout />,
        children: [
            
            // Home page
            {
                path: "/home",
                element: <HomePage />
            },

            // Sidebar sites
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

            // Non sidebar sites
            {
                path: "/learn/code",
                element: <Code />,
            },
            {
                path: "/report-card",
                element: <ReportCard />
            }
        ]
    },
]);

export default router