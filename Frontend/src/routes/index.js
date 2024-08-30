import {
    createBrowserRouter,
} from "react-router-dom";
import Example from "../pages/demo";
import Chat from "../pages/chat"
import Code from "../pages/code";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Chat />,
    },
    {
        path: "/code",
        element: <Code />,
    }
]);

export default router