import React from 'react';
import { createRoot } from 'react-dom/client';
import {DataPoints} from "./components/ticker-data-points/ticker-datapoints"

const App = () => 
<div>
    <DataPoints />
</div>;

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
