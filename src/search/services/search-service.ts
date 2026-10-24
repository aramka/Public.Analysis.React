import { SearchResult, SearchService } from "../models/search-result";
import { EntityType } from "../../models/entity-type";

const tickers = ["AAPL", "AMZN", "GOOGL", "MSFT", "NVDA", "TSLA"];

export const searchService: SearchService = async (query) => {
  const prefix = query.trim().toLocaleUpperCase();
  return tickers
    .filter((ticker) => ticker.startsWith(prefix))
    .map((ticker): SearchResult => ({
      entityType: EntityType.Ticker,
      entity: ticker,
      label: ticker,
    }));
};
