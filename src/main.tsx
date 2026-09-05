import React from 'react';
import { createRoot } from 'react-dom/client';
import {DataPoints} from "./components/ticker-data-points/ticker-datapoints"
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import ReactDOM from "react-dom/client";

// const App = () => 
// <div>
//     <DataPoints />
// </div>;

// const container = document.getElementById('root');
// if (container) {
//   const root = createRoot(container);
//   root.render(<App />);
// }

const router = createBrowserRouter([
  {
    path: "/",
    element: <div><DataPoints /></div>
  },
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <RouterProvider router={router} />,
);
