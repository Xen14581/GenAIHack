import {
    createBrowserRouter,
} from "react-router-dom";
import Example from "../pages/demo";
import Chat from "../pages/chat"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Chat />,
    },
]);

export default router