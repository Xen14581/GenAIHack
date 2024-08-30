import * as React from 'react';
import router from "./routes"
import {
  RouterProvider,
} from "react-router-dom";
import Layout from './pages/layout';

export default function App() {
  return (
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  );
}
