export enum LandingPageViewType {
  DataPoints = "data-points",
  TimeSeries = "time-series"
}

export interface DataPointsLandingPageView {
  id: string;
  type: LandingPageViewType.DataPoints;
  entity: string;
  dataPointSet: string;
}

export interface TimeSeriesLandingPageView {
  id: string;
  type: LandingPageViewType.TimeSeries;
  entity: string;
  dataPointName: string;
}

export type LandingPageView = DataPointsLandingPageView | TimeSeriesLandingPageView;
