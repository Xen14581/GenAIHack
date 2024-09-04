import {
    createBrowserRouter,
} from "react-router-dom";
import Example from "../pages/demo";
import Chat from "../pages/chat"
import Quiz from "../pages/quiz"
import ReportCard from "../pages/report_card"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Chat />,
    },
    {
        path: "/learn/quiz/",
        element: <Quiz />,
    },
    {
        path: "/report",
        element: <ReportCard />,
    },
]);

export default router