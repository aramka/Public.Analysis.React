import {DataPointsViewer} from "./data-points-viewer/data-points-viewer"
import {TimeSeries} from "./time-series/time-series"
import {LandingPage} from "./landing-page/landing-page"
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import ReactDOM from "react-dom/client";


const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage
  },
  {
    path: "/:entity/:dataPointSet",
    Component: DataPointsViewer
  },
  {
    path: "/:entity/:dataPointName/time-series",
    Component:TimeSeries
  }
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <RouterProvider router={router} />,
);
