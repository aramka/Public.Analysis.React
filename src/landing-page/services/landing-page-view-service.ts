import { SearchResult } from "../../search/models/search-result";
import {
  LandingPageView,
  LandingPageViewType
} from "../models/landing-page-view";

export const landingPageViewService = {
  async getViewsForSelection(selection: SearchResult): Promise<LandingPageView[]> {
    await new Promise((resolve) => window.setTimeout(resolve, 180));

    const ticker = selection.metadata.ticker;
    if (!ticker) {
      throw new Error("Selected result is missing ticker metadata");
    }

    return [
      {
        id: `${ticker}-income-statement`,
        type: LandingPageViewType.TickerFacts,
        ticker,
        statement: "CashFlow"
      },
      {
        id: `${ticker}-revenue-time-series`,
        type: LandingPageViewType.TimeSeries,
        ticker,
        factName: "PaymentsForRepurchaseOfCommonStock"
      }
    ];
  }
};
