import { EntityType } from "../../models/entity-type";

export enum LandingPageViewType {
  DataPoints = "data-points",
  TimeSeries = "time-series"
}

export interface DataPointsLandingPageView {
  id: string;
  type: LandingPageViewType.DataPoints;
  entityType: EntityType;
  entity: string;
  dataPointSet: string;
}

export interface TimeSeriesLandingPageView {
  id: string;
  type: LandingPageViewType.TimeSeries;
  entityType: EntityType;
  entity: string;
  dataPointName: string;
}

export type LandingPageView = DataPointsLandingPageView | TimeSeriesLandingPageView;
