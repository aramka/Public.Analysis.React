import { EntityType } from "../../models/entity-type";

export enum ViewType {
  DataPoints = "data-points",
  TimeSeries = "time-series"
}

export interface DataPointsView {
  id: string;
  type: ViewType.DataPoints;
  entityType: EntityType;
  entity: string;
  dataPointSet: string;
}

export interface TimeSeriesView {
  id: string;
  viewType: ViewType.TimeSeries;
  entityType: EntityType;
  entity: string;
  dataPointName: string;
}

export type View = DataPointsView | TimeSeriesView;
