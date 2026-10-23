import { EntityType } from "../models/entity-type";

export const endpointUrls = {
  publicAnalysisBaseUrl: import.meta.env.VITE_PUBLIC_ANALYSIS_BASE_URL,
  visuals(visualType:string, dataSetName:string, datapointName:string, entity:string) {
    return `${this.publicAnalysisBaseUrl}/visuals/${visualType}/${dataSetName}/${datapointName}/${entity}`;
  },
  fetchTickerConceptMetas(ticker: string) {
    return `${this.publicAnalysisBaseUrl}/concept-metas/${ticker}`;
  },
  search(query: string, searchType?: string) {
    const searchParams = new URLSearchParams({ query });
    if (searchType !== undefined) {
      searchParams.set("search-type", searchType);
    }
    return `${this.publicAnalysisBaseUrl}/search?${searchParams.toString()}`;
  },
  getDataPointTree(entityType: EntityType, entity: string, dataPointSet: string) {
    return `${this.publicAnalysisBaseUrl}/${entityType}/${encodeURIComponent(entity)}/${encodeURIComponent(dataPointSet)}`
  }
};