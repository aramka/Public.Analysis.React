import { SearchResult } from "../../search/models/search-result";
import { EntityType } from "../../models/entity-type";
import {
  View,
  ViewType
} from "./viewsServiceModels";

const viewsByEntity: Record<string, Record<string, View>> = {};

const viewsByEntityType: Record<string, Record<string, View>> = {
  [EntityType.Ticker]: {
    [`${ViewType.DataPoints}-${EntityType.Ticker}-CashFlow`]: {
      id: `${ViewType.DataPoints}-${EntityType.Ticker}-CashFlow`,
      viewType: ViewType.DataPoints,
      entityType: EntityType.Ticker,
      dataPointSet: "CashFlow"
    },
    [`${ViewType.TimeSeries}-${EntityType.Ticker}-PaymentsForRepurchaseOfCommonStock`]: {
      id: `${ViewType.TimeSeries}-${EntityType.Ticker}-PaymentsForRepurchaseOfCommonStock`,
      viewType: ViewType.TimeSeries,
      entityType: EntityType.Ticker,
      dataPointName: "PaymentsForRepurchaseOfCommonStock"
    }
  }
};

export const viewsService = {
  async getViewsForSelection(selection: SearchResult): Promise<View[]> {
    await new Promise((resolve) => window.setTimeout(resolve, 180));

    const views = viewsByEntity[selection.entity] ?? viewsByEntityType[selection.entityType];
    return Object.values(views ?? {}).map((view) => ({
      ...view,
      entityType: selection.entityType
    }));
  }
};
