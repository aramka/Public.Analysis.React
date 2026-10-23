import { SearchResult, SearchService } from "../models/search-result";

const tickers = ["AAPL", "AMZN", "GOOGL", "MSFT", "NVDA", "TSLA"];

export const searchService: SearchService = async (query) => {
  const prefix = query.trim().toLocaleUpperCase();
  return tickers
    .filter((ticker) => ticker.startsWith(prefix))
    .map((ticker): SearchResult => ({
      id: ticker,
      label: ticker,
      metadata: { ticker }
    }));
};
