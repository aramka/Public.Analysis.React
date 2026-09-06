import {TickerConcepts} from "./ticker-concepts/ticker-concepts"
import {TimeSeries} from "./time-series/time-series"
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import ReactDOM from "react-dom/client";


const router = createBrowserRouter([
  {
    path: "/:ticker",
    Component:TickerConcepts
  },
  {
    path: "/:ticker/:concept/time-series",
    Component:TimeSeries
  }
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <RouterProvider router={router} />,
);
