import { EntityType } from "../models/entity-type";
import { endpointUrls } from "../services/endPointUrls";
import { ServiceResponse } from "../services/models/service-response";
import {
  ApiDataPointTreeResult,
  DataPointTreeResult
} from "./models/data-points-viewer-models";

export const dataPointsService = {
  async fetchDataPointTree(
    entityType: EntityType,
    entity: string,
    dataPointSet: string | null
  ): Promise<ServiceResponse<DataPointTreeResult[]>> {
    const response = await fetch(endpointUrls.getDataPointTree(entityType, entity, dataPointSet));
    if (!response.ok) {
      throw new Error("Failed to fetch data point tree");
    }

    const serviceResponse = await response.json() as ServiceResponse<ApiDataPointTreeResult[]>;
    return {
      ...serviceResponse,
      responseData: serviceResponse.responseData
        ? serviceResponse.responseData.map((treeResult) => ({
          file: treeResult.file,
          totalDataPointsCount: treeResult.totalTreeFactsCount,
          matchingDataPointsCount: treeResult.matchingFactsCount,
          coverage: treeResult.coverage,
          description: treeResult.description,
          tree: Object.fromEntries(
            Object.entries(treeResult.tree).map(([key, node]) => [
              key,
              {
                dataPoint: {
                  id: node.factNode.id,
                  label: node.factNode.label,
                  parentIds: node.factNode.parentsIds,
                  children: node.factNode.children,
                  name: node.factNode.name
                },
                visuals: node.visuals
              }
            ])
          )
        }))
        : null
    };
  }
};
