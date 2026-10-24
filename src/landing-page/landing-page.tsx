import React, { useState } from "react";
import { useAsync } from "../hooks/useAsync";
import { Search } from "../search/search";
import { SearchResult } from "../search/models/search-result";
import { DataPointsViewer } from "../data-points-viewer/data-points-viewer";
import { TimeSeries } from "../time-series/time-series";
import { LandingPageView, LandingPageViewType } from "./models/landing-page-view";
import { landingPageViewService } from "./services/landing-page-view-service";

interface SelectedViewsProps {
  selection: SearchResult;
}

const SelectedViews: React.FC<SelectedViewsProps> = ({ selection }) => {
  const {
    data: views,
    loading,
    error
  } = useAsync(() => landingPageViewService.getViewsForSelection(selection));

  const renderView = (view: LandingPageView) => {
    switch (view.type) {
      case LandingPageViewType.DataPoints:
        return <DataPointsViewer key={view.id} entity={view.entity} dataPointSet={view.dataPointSet} />;
      case LandingPageViewType.TimeSeries:
        return <TimeSeries key={view.id} entity={view.entity} dataPointName={view.dataPointName} />;
    }
  };

  return (
    <>
      {loading && <p role="status">Loading views...</p>}
      {error && <p role="alert">Could not load views: {error.message}</p>}
      {views?.map(renderView)}
    </>
  );
};

export const LandingPage: React.FC = () => {
  const [selectionRequest, setSelectionRequest] = useState<{
    result: SearchResult;
    requestId: number;
  } | null>(null);

  const handleSelect = (result: SearchResult) => {
    setSelectionRequest((current) => ({
      result,
      requestId: (current?.requestId ?? 0) + 1
    }));
  };

  return (
    <main>
      <Search onSelect={handleSelect} />
      {selectionRequest && (
        <SelectedViews
          key={selectionRequest.requestId}
          selection={selectionRequest.result}
        />
      )}
    </main>
  );
};
