import { SearchResult } from "../../search/models/search-result";
import {
  View,
  ViewType
} from "./viewsServiceModels";

export const viewsService = {
  async getViewsForSelection(selection: SearchResult): Promise<View[]> {
    await new Promise((resolve) => window.setTimeout(resolve, 180));

    const { entity, entityType } = selection;

    return [
      {
        id: `${entity}-cash-flow`,
        type: ViewType.DataPoints,
        entityType,
        entity,
        dataPointSet: "CashFlow"
      },
      {
        id: `${entity}-revenue-time-series`,
        viewType: ViewType.TimeSeries,
        entityType,
        entity,
        dataPointName: "PaymentsForRepurchaseOfCommonStock"
      }
    ];
  }
};
