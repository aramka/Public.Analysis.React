import { SearchResult } from "../../search/models/search-result";
import { EntityType } from "../../models/entity-type";
import {
  TimeSeriesView,
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

const createTimeSeriesView = (
  entityType: EntityType,
  dataPointName: string
): TimeSeriesView => {
  const id = `${ViewType.TimeSeries}-${entityType}-${dataPointName}`;
  return {
    id,
    viewType: ViewType.TimeSeries,
    entityType,
    dataPointName
  };
};

export const viewsService = {
  async getViewsForSelection(selection: SearchResult): Promise<View[]> {
    await new Promise((resolve) => window.setTimeout(resolve, 180));

    const views = viewsByEntity[selection.entity] ?? viewsByEntityType[selection.entityType];
    return Object.values(views ?? {});
  },

  addTimeSeriesViewToEntity(entity: string, entityType: EntityType, dataPointName: string): void {
    const view = createTimeSeriesView(entityType, dataPointName);
    const entityViews = viewsByEntity[entity] ??= {};
    entityViews[view.id] = view;
  },

  addTimeSeriesViewToEntityType(entityType: EntityType, dataPointName: string): void {
    const view = createTimeSeriesView(entityType, dataPointName);
    const entityTypeViews = viewsByEntityType[entityType] ??= {};
    entityTypeViews[view.id] = view;
  }
};
