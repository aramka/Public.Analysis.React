export interface SearchResult {
  id: string;
  label: string;
  metadata: Record<string, string>;
}

export type SearchService = (query: string, searchType?: string) => Promise<SearchResult[]>;
