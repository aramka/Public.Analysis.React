import { EntityType } from "../../models/entity-type";

export enum ViewType {
  DataPoints = "data-points",
  TimeSeries = "time-series"
}

export interface DataPointsView {
  id: string;
  viewType: ViewType.DataPoints;
  entityType: EntityType;
  dataPointSet: string;
}

export interface TimeSeriesView {
  id: string;
  viewType: ViewType.TimeSeries;
  entityType: EntityType;
  dataPointName: string;
}

export type View = DataPointsView | TimeSeriesView;
