import React, { useState } from "react";
import { Search } from "../company-search/company-search";
import { SearchResult } from "../company-search/models/search-result";

export const LandingPage: React.FC = () => {
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);

  return (
    <main>
      <h1>Public Analysis</h1>
      <p>Explore public company facts and time-series data.</p>
      <Search onSelect={setSelectedResult} />
      {selectedResult && <p role="status">Selected: {selectedResult.label}</p>}
    </main>
  );
};
