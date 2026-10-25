import React, { useState } from "react";
import { useAsync } from "../hooks/useAsync";
import { Search } from "../search/search";
import { SearchResult } from "../search/models/search-result";
import { DataPointsViewer } from "../data-points-viewer/data-points-viewer";
import { TimeSeries } from "../time-series/time-series";
import { View, ViewType } from "../services/viewsService/viewsServiceModels";
import { viewsService } from "../services/viewsService/viewsService";
import "./landing-page.css";

interface SelectedViewsProps {
  selection: SearchResult;
  onViewsChanged: () => void;
}

const SelectedViews: React.FC<SelectedViewsProps> = ({ selection, onViewsChanged }) => {
  const {
    data: views,
    loading,
    error
  } = useAsync(() => viewsService.getViewsForSelection(selection));

  const renderView = (view: View) => {
    switch (view.viewType) {
      case ViewType.DataPoints:
        return (
          <DataPointsViewer
            key={view.id}
            entityType={view.entityType}
            entity={selection.entity}
            dataPointSet={view.dataPointSet}
            onViewsChanged={onViewsChanged}
          />
        );
      case ViewType.TimeSeries:
        return (
          <TimeSeries
            key={view.id}
            entityType={view.entityType}
            entity={selection.entity}
            dataPointName={view.dataPointName}
          />
        );
    }
  };

  return (
    <section className="landing-page__content" aria-label="Selected analysis">
      {loading && <p role="status">Loading analysis...</p>}
      {error && <p role="alert">Could not load views: {error.message}</p>}
      {views?.map(renderView)}
    </section>
  );
};

export const LandingPage: React.FC = () => {
  const [selectionRequest, setSelectionRequest] = useState<{
    result: SearchResult;
    requestId: number;
  } | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewsRevision, setViewsRevision] = useState(0);
  const selectedResult = selectionRequest?.result;

  const handleSelect = (result: SearchResult) => {
    setSelectionRequest((current) => ({
      result,
      requestId: (current?.requestId ?? 0) + 1
    }));
  };

  return (
    <main>
      <Search onSelect={handleSelect} />
      <div className={`landing-page__layout${sidebarCollapsed ? " landing-page__layout--sidebar-collapsed" : ""}`}>
        <aside className="landing-page__sidebar" aria-label="Data points">
          <div className="landing-page__sidebar-header">
            {!sidebarCollapsed && <h2>Data points</h2>}
            <button
              type="button"
              className="landing-page__sidebar-toggle"
              aria-label={sidebarCollapsed ? "Expand data points panel" : "Collapse data points panel"}
              aria-expanded={!sidebarCollapsed}
              aria-controls="landing-page-data-points"
              onClick={() => setSidebarCollapsed((isCollapsed) => !isCollapsed)}
            >
              {sidebarCollapsed ? ">" : "<"}
            </button>
          </div>
          <div
            id="landing-page-data-points"
            className="landing-page__sidebar-content"
            hidden={sidebarCollapsed}
          >
            {selectedResult
              ? (
                <DataPointsViewer
                  key={`${selectedResult.entityType}-${selectedResult.entity}`}
                  entityType={selectedResult.entityType}
                  entity={selectedResult.entity}
                  dataPointSet="CashFlow"
                  onViewsChanged={() => setViewsRevision((revision) => revision + 1)}
                />
              )
              : <p>Select a result to view its data points.</p>}
          </div>
        </aside>
        {selectionRequest
          ? (
            <SelectedViews
              key={`${selectionRequest.requestId}-${viewsRevision}`}
              selection={selectionRequest.result}
              onViewsChanged={() => setViewsRevision((revision) => revision + 1)}
            />
          )
          : (
            <section className="landing-page__content" aria-label="Selected analysis">
              <p>Select a result to explore its analysis.</p>
            </section>
          )}
      </div>
    </main>
  );
};
