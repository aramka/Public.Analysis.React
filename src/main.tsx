import {TickerFacts} from "./ticker-facts/ticker-facts"
import {TimeSeries} from "./time-series/time-series"
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import ReactDOM from "react-dom/client";


const router = createBrowserRouter([
  {
    path: "/:ticker/:statement",
    Component:TickerFacts
  },
  {
    path: "/:ticker/:dataSetName/:dataPointName/time-series",
    Component:TimeSeries
  }
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <RouterProvider router={router} />,
);
