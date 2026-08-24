import React from 'react';
import { createRoot } from 'react-dom/client';
import { TimeSeriesChart } from "./components/time-series-chart/time-series-chart";

const App = () => 
<h1>
    Hello from React! change the code but it doesnt reload?????? now????now??????yeah!!! is it still working????
    <TimeSeriesChart />
</h1>;

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
