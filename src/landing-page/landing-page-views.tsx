import React from "react";
import { useAsync } from "../hooks/useAsync";
import { SearchResult } from "../search/models/search-result";
import { DataPointsViewer } from "../data-points-viewer/data-points-viewer";
import { TimeSeries } from "../time-series/time-series";
import { View, ViewType } from "../services/viewsService/viewsServiceModels";
import { viewsService } from "../services/viewsService/viewsService";
import { ViewActions } from "../view-actions/view-actions";

interface LandingPageViewsProps {
  selection: SearchResult;
  onViewsChanged: () => void;
}

export const LandingPageViews: React.FC<LandingPageViewsProps> = ({ selection, onViewsChanged }) => {
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
            entityType={view.entityType}
            entity={selection.entity}
            dataPointSet={view.dataPointSet}
            onViewsChanged={onViewsChanged}
          />
        );
      case ViewType.TimeSeries:
        return (
          <TimeSeries
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
      {views?.map((view) => (
        <div key={view.id}>
          {renderView(view)}
          <ViewActions
            entity={selection.entity}
            view={view}
            showAddToEntityView={false}
            showAddToTickerView={false}
            showRemoveFromTickerView={false}
            onViewsChanged={onViewsChanged}
          />
        </div>
      ))}
    </section>
  );
};
