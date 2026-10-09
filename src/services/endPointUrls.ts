export const endpointUrls = {
  publicAnalysisBaseUrl: import.meta.env.VITE_PUBLIC_ANALYSIS_BASE_URL,
  visuals(visualType:string, dataSetName:string, datapointName:string, entity:string) {
    return `${this.publicAnalysisBaseUrl}/visuals/${visualType}/${dataSetName}/${datapointName}/${entity}`;
  },
  fetchTickerConceptMetas(ticker: string) {
    return `${this.publicAnalysisBaseUrl}/concept-metas/${ticker}`;
  },
  getStatementTree(statementTreeType:string, statementName:string, entity:string){
    return `${this.publicAnalysisBaseUrl}/${entity}/${statementName}/facts-tree`
  }
};