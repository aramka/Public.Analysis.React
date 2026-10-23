export interface SearchResult {
  id: string;
  label: string;
  data?: unknown;
}

export type SearchService = (query: string, searchType?: string) => Promise<SearchResult[]>;
