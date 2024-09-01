import * as React from 'react';
import router from "./routes"
import {
  RouterProvider,
} from "react-router-dom";
import './styles.css'

export default function App() {
  return (
    // <Layout>
      <RouterProvider router={router} />
    // </Layout>
  );
}
