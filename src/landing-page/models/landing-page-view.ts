export enum LandingPageViewType {
  TickerFacts = "ticker-facts",
  TimeSeries = "time-series"
}

export interface TickerFactsLandingPageView {
  id: string;
  type: LandingPageViewType.TickerFacts;
  ticker: string;
  statement: string;
}

export interface TimeSeriesLandingPageView {
  id: string;
  type: LandingPageViewType.TimeSeries;
  ticker: string;
  factName: string;
}

export type LandingPageView = TickerFactsLandingPageView | TimeSeriesLandingPageView;
