import React, { useState } from "react";
import { useAsync } from "../hooks/useAsync";
import { Search } from "../search/search";
import { SearchResult } from "../search/models/search-result";
import { DataPointsViewer } from "../data-points-viewer/data-points-viewer";
import { TimeSeries } from "../time-series/time-series";
import { LandingPageView, LandingPageViewType } from "./models/landing-page-view";
import { landingPageViewService } from "./services/landing-page-view-service";
import "./landing-page.css";

interface SelectedViewsProps {
  selection: SearchResult | null;
  collapsed: boolean;
  onToggleSidebar: () => void;
}

const SelectedViews: React.FC<SelectedViewsProps> = ({
  selection,
  collapsed,
  onToggleSidebar
}) => {
  const {
    data: views,
    loading,
    error
  } = useAsync(() => selection
    ? landingPageViewService.getViewsForSelection(selection)
    : Promise.resolve([]));

  const dataPointViews = views?.filter(
    (view): view is Extract<LandingPageView, { type: LandingPageViewType.DataPoints }> =>
      view.type === LandingPageViewType.DataPoints
  );
  const timeSeriesViews = views?.filter(
    (view): view is Extract<LandingPageView, { type: LandingPageViewType.TimeSeries }> =>
      view.type === LandingPageViewType.TimeSeries
  );

  return (
    <div className={`landing-page__layout${collapsed ? " landing-page__layout--sidebar-collapsed" : ""}`}>
      <aside className="landing-page__sidebar" aria-label="Data points">
        <div className="landing-page__sidebar-header">
          {!collapsed && <h2>Data points</h2>}
          <button
            type="button"
            className="landing-page__sidebar-toggle"
            aria-label={collapsed ? "Expand data points panel" : "Collapse data points panel"}
            aria-expanded={!collapsed}
            aria-controls="landing-page-data-points"
            onClick={onToggleSidebar}
          >
            {collapsed ? ">" : "<"}
          </button>
        </div>
        <div
          id="landing-page-data-points"
          className="landing-page__sidebar-content"
          hidden={collapsed}
        >
          {loading && selection && <p role="status">Loading data points...</p>}
          {error && <p role="alert">Could not load views: {error.message}</p>}
          {!selection && <p>Select a result to view its data points.</p>}
          {dataPointViews?.map((view) => (
            <DataPointsViewer
              key={view.id}
              entity={view.entity}
              dataPointSet={view.dataPointSet}
            />
          ))}
        </div>
      </aside>
      <section className="landing-page__content" aria-label="Selected analysis">
        {loading && selection && <p role="status">Loading analysis...</p>}
        {error && <p role="alert">Could not load views: {error.message}</p>}
        {!selection && <p>Select a result to explore its analysis.</p>}
        {timeSeriesViews?.map((view) => (
          <TimeSeries
            key={view.id}
            entity={view.entity}
            dataPointName={view.dataPointName}
          />
        ))}
      </section>
    </div>
  );
};

export const LandingPage: React.FC = () => {
  const [selectionRequest, setSelectionRequest] = useState<{
    result: SearchResult;
    requestId: number;
  } | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSelect = (result: SearchResult) => {
    setSelectionRequest((current) => ({
      result,
      requestId: (current?.requestId ?? 0) + 1
    }));
  };

  return (
    <main>
      <Search onSelect={handleSelect} />
      <SelectedViews
        key={selectionRequest?.requestId ?? "empty"}
        selection={selectionRequest?.result ?? null}
        collapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((isCollapsed) => !isCollapsed)}
      />
    </main>
  );
};
