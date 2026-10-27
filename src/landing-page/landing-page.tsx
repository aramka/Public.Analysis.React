import React, { useState } from "react";
import { Search } from "../search/search";
import { SearchResult } from "../search/models/search-result";
import { DataPointsViewer } from "../data-points-viewer/data-points-viewer";
import { LandingPageViews } from "./landing-page-views";
import "./landing-page.css";

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
            <LandingPageViews
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
