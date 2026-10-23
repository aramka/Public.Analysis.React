import { SearchResult } from "../../search/models/search-result";
import { LandingPageView } from "../models/landing-page-view";

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
        type: "ticker-facts",
        ticker,
        statement: "CashFlow"
      },
      {
        id: `${ticker}-revenue-time-series`,
        type: "time-series",
        path: `/${ticker}/PaymentsForRepurchaseOfCommonStock/time-series`
      }
    ];
  }
};
