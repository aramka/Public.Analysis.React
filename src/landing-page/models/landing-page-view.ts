export type LandingPageView =
  | {
      id: string;
      type: "ticker-facts";
      ticker: string;
      statement: string;
    }
  | {
      id: string;
      type: "time-series";
      path: string;
    };
