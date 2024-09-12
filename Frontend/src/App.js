import * as React from 'react';
import router from "./routes"
import {
  RouterProvider,
} from "react-router-dom";
import './styles.css'
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}
