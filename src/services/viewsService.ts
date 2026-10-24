import { SearchResult } from "../search/models/search-result";
import {
  LandingPageView,
  LandingPageViewType
} from "../landing-page/models/landing-page-view";

export const viewsService = {
  async getViewsForSelection(selection: SearchResult): Promise<LandingPageView[]> {
    await new Promise((resolve) => window.setTimeout(resolve, 180));

    const { entity, entityType } = selection;

    return [
      {
        id: `${entity}-cash-flow`,
        type: LandingPageViewType.DataPoints,
        entityType,
        entity,
        dataPointSet: "CashFlow"
      },
      {
        id: `${entity}-revenue-time-series`,
        type: LandingPageViewType.TimeSeries,
        entityType,
        entity,
        dataPointName: "PaymentsForRepurchaseOfCommonStock"
      }
    ];
  }
};
