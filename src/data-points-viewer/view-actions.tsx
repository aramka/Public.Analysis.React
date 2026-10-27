import React, { useState } from "react";
import { EntityType } from "../models/entity-type";
import { viewsService } from "../services/viewsService/viewsService";

interface ViewActionsProps {
  entity: string;
  entityType: EntityType;
  dataPointName: string;
  onAddToEntityView?: () => void;
  onAddToTickerView?: () => void;
  onViewsChanged?: () => void;
}

export const ViewActions: React.FC<ViewActionsProps> = ({
  entity,
  entityType,
  dataPointName,
  onAddToEntityView,
  onAddToTickerView,
  onViewsChanged
}) => {
  const [statusMessage, setStatusMessage] = useState("");

  const addToEntityView = () => {
    viewsService.addTimeSeriesViewToEntity(entity, entityType, dataPointName);
    setStatusMessage(`Added to ${entity} view.`);
    onAddToEntityView?.();
    onViewsChanged?.();
  };

  const addToTickerView = () => {
    viewsService.addTimeSeriesViewToEntityType(EntityType.Ticker, dataPointName);
    setStatusMessage("Added to Ticker view.");
    onAddToTickerView?.();
    onViewsChanged?.();
  };

  return (
    <div className="data-points-viewer__dialog-actions">
      <button type="button" onClick={addToEntityView}>
        Add To {entity} View
      </button>
      <button type="button" onClick={addToTickerView}>
        Add to Ticker View
      </button>
      {statusMessage && <p role="status">{statusMessage}</p>}
    </div>
  );
};
