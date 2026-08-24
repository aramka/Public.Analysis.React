import React from 'react';
import { createRoot } from 'react-dom/client';
import { TimeSeriesChart } from "./components/time-series-chart/time-series-chart";

const App = () => 
<div>
    <TimeSeriesChart />
</div>;

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
