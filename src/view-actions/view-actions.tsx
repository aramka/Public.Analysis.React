import React, { useState } from "react";
import { EntityType } from "../models/entity-type";
import { viewsService } from "../services/viewsService/viewsService";
import { View } from "../services/viewsService/viewsServiceModels";

interface CommonViewActionsProps {
  entity: string;
  showAddToEntityView?: boolean;
  showAddToTickerView?: boolean;
  showRemoveFromEntityView?: boolean;
  showRemoveFromTickerView?: boolean;
  onAddToEntityView?: () => void;
  onAddToTickerView?: () => void;
  onRemoveFromEntityView?: () => void;
  onRemoveFromTickerView?: () => void;
  onViewsChanged?: () => void;
}

type ViewActionsProps = CommonViewActionsProps & (
  | { view: View; entityType?: never; dataPointName?: never }
  | { view?: never; entityType: EntityType; dataPointName: string }
);

export const ViewActions: React.FC<ViewActionsProps> = (props) => {
  const {
    entity,
    showAddToEntityView = true,
    showAddToTickerView = true,
    showRemoveFromEntityView = true,
    showRemoveFromTickerView = true,
    onAddToEntityView,
    onAddToTickerView,
    onRemoveFromEntityView,
    onRemoveFromTickerView,
    onViewsChanged
  } = props;
  const [statusMessage, setStatusMessage] = useState("");

  const addToEntityView = () => {
    if (props.view) {
      viewsService.addViewToEntity(entity, props.view);
    } else {
      viewsService.addTimeSeriesViewToEntity(entity, props.entityType, props.dataPointName);
    }
    setStatusMessage(`Added to ${entity} view.`);
    onAddToEntityView?.();
    onViewsChanged?.();
  };

  const addToTickerView = props.view ? undefined : () => {
    viewsService.addTimeSeriesViewToEntityType(EntityType.Ticker, props.dataPointName);
    setStatusMessage("Added to Ticker view.");
    onAddToTickerView?.();
    onViewsChanged?.();
  };

  const removeFromEntityView = () => {
    if (props.view) {
      viewsService.removeViewFromEntity(entity, props.view.id);
    } else {
      viewsService.removeTimeSeriesViewFromEntity(entity, props.entityType, props.dataPointName);
    }
    setStatusMessage(`Removed from ${entity} view.`);
    onRemoveFromEntityView?.();
    onViewsChanged?.();
  };

  const removeFromTickerView = props.view ? undefined : () => {
    viewsService.removeTimeSeriesViewFromEntityType(EntityType.Ticker, props.dataPointName);
    setStatusMessage("Removed from Ticker view.");
    onRemoveFromTickerView?.();
    onViewsChanged?.();
  };

  return (
    <div className="view-actions">
      {showAddToEntityView && (
        <button type="button" onClick={addToEntityView}>
          Add To {entity} View
        </button>
      )}
      {showRemoveFromEntityView && (
        <button type="button" onClick={removeFromEntityView}>
          Remove From {entity} View
        </button>
      )}
      {addToTickerView && showAddToTickerView && (
        <button type="button" onClick={addToTickerView}>
          Add to Ticker View
        </button>
      )}
      {removeFromTickerView && showRemoveFromTickerView && (
        <button type="button" onClick={removeFromTickerView}>
          Remove from Ticker View
        </button>
      )}
      {statusMessage && <p role="status">{statusMessage}</p>}
    </div>
  );
};
