export const endpointUrls = {
  publicAnalysisBaseUrl: import.meta.env.VITE_PUBLIC_ANALYSIS_BASE_URL,
  visualTimeSeries(ticker: string, concept: string) {
    return `${this.publicAnalysisBaseUrl}/${ticker}/${concept}/time-series`;
  },
  fetchTickerConceptMetas(ticker: string) {
    return `${this.publicAnalysisBaseUrl}/concept-metas/${ticker}`;
  }
};