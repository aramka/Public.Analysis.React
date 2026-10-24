import { EntityType } from "../../models/entity-type";

export interface SearchResult {
  entityType: EntityType;
  entity: string;
  label: string;
}

export type SearchService = (query: string, searchType?: string) => Promise<SearchResult[]>;
