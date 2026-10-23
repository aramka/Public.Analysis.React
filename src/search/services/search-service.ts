import { endpointUrls } from "../../services/endPointUrls";
import { ServiceResponse } from "../../services/models/service-response";
import { SearchResult, SearchService } from "../models/search-result";

export const searchService: SearchService = async (query, searchType) => {
  const response = await fetch(endpointUrls.search(query, searchType));
  if (!response.ok) {
    throw new Error(`Search request failed with status ${response.status}`);
  }

  const serviceResponse = await response.json() as ServiceResponse<SearchResult[]>;
  if (serviceResponse.validationErrors.length > 0) {
    throw new Error(serviceResponse.validationErrors.join(", "));
  }
  if (!serviceResponse.responseData) {
    throw new Error("Search response did not include results");
  }

  return serviceResponse.responseData;
};
