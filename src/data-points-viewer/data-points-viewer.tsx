import React from "react"
import {useAsync} from "../hooks/useAsync"
import {useParams} from "react-router"
import { endpointUrls } from "../services/endPointUrls";
import { ServiceResponse } from "../services/models/service-response";
import { EntityType } from "../models/entity-type";

export enum DataPointVisual {
    TimeSeries="time-series"
}

interface DataPointChild {
    id: string;
    label: string;
    order: number;
}

interface DataPoint {
    id: string;
    label: string;
    parentIds?: string[];
    children?: DataPointChild[];
    name: string;
}

interface ApiDataPoint {
    id: string;
    label: string;
    parentsIds?: string[];
    children?: DataPointChild[];
    name: string;
}
enum DataPointVisualType {
    TimeSeries="time-series"
}
interface DataPointVisualsModel {
    dataPoint: DataPoint;
    visuals: DataPointVisualType[]
}

interface DataPointTreeResult {
    file: string;
    totalDataPointsCount: number;
    matchingDataPointsCount: number;
    coverage: number;
    tree: Record<string, DataPointVisualsModel>;
    description:string
}

interface ApiDataPointTreeResult {
    file: string;
    totalTreeFactsCount: number;
    matchingFactsCount: number;
    coverage: number;
    description: string;
    tree: Record<string, { factNode: ApiDataPoint; visuals: DataPointVisualType[] }>;
}

const dataPointTreeService = {
    async fetchDataPointTree(entityType: EntityType, entity: string, dataPointSet: string | null): Promise<ServiceResponse<DataPointTreeResult[]>> {
        const response = await fetch(endpointUrls.getDataPointTree(entityType, entity, dataPointSet));
        if (!response.ok) {
            throw new Error("Failed to fetch data point tree ");
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

const DataPointTreeBranch: React.FC<{
    entity: string;
    nodeId: string;
    tree: Record<string, DataPointVisualsModel>;
    label?:string;
}> = ({ entity, nodeId, tree, label }) => {
    
    const node = tree[nodeId];

    if (!node ) {
        return null;
    }

    const children = [...(node.dataPoint.children ?? [])]
    .sort((left, right) => left.order - right.order)
    .map(child=>{ return {id:child.id,order:child.order, childLabel:child.label,uniqueKey:`${child.id}${child.order}${child.label}`} });

    return (
        <li>
            <details open>
                <summary>
                    <span>{label || node.dataPoint.name}</span>
                    <span>
                         {
                            node.visuals.map((visual)=>
                                    {
                                        
                                        const path:string[] = [entity, node.dataPoint.name ?? "",visual]
                                        const key:string=`${path.join("-")}`
                                        const visualComponentRoute=`/${path.join("/")}`
                                        return <a key={key} href={visualComponentRoute}>{visual}</a>
                                            
                                    }
                                )
                        }
                    </span>

                </summary>
                <ul>
                    {children.map((child) => tree[child.id]
                        ? <DataPointTreeBranch entity={entity} key={child.uniqueKey} nodeId={child.id} tree={tree} label={child.childLabel} />
                        : <li key={child.uniqueKey}>Not found in tree: {child.id} | {child.childLabel}</li>)}
                </ul>
            </details>
        </li>
    );
};

interface DataPointsViewerProps {
    entity?: string;
    dataPointSet?: string | null;
    entityType?: EntityType;
}

export const DataPointsViewer: React.FC<DataPointsViewerProps> = ({
    entityType = EntityType.Ticker,
    ...props
}) =>{
    const routeParams = useParams();
    const entity = props.entity ?? routeParams.entity;
    const dataPointSet = props.dataPointSet ?? routeParams.dataPointSet ?? null;
    if(!entity)
        return (<h1>No entity provided</h1>)

    const {data:serviceResponse, loading:dataPointTreeLoading, error:dataPointTreeError} = useAsync(
        () => dataPointTreeService.fetchDataPointTree(entityType, entity, dataPointSet)
    )

    if (dataPointTreeLoading) {
        return <div style={{ padding: "24px", color: "#666" }}>Loading data point tree...</div>;
    }

    if (dataPointTreeError) {
        return <div style={{ padding: "24px", color: "#ef4444" }}>Error: {dataPointTreeError.message}</div>;
    }

    if(!serviceResponse?.responseData?.length) {
        return <div style={{ padding: "24px", color: "#666" }}>No data point tree available.</div>;
    }

    return (
        <div>
            {serviceResponse.responseData.map((dataPointTreeResponse, resultIndex) => {
                const parents = Object.entries(dataPointTreeResponse.tree)
                    .filter(([, node]) => !node.dataPoint.parentIds?.some((parentId) => parentId in dataPointTreeResponse.tree));

                return (
                    <section key={`${dataPointTreeResponse.file}-${resultIndex}`}>
                        <h2>{dataPointTreeResponse.description || dataPointTreeResponse.file || "Data Point Tree"}</h2>
                        {parents.length} parent nodes
                        <p>
                            {dataPointTreeResponse.matchingDataPointsCount} matching data points / {dataPointTreeResponse.totalDataPointsCount} data points
                            ({dataPointTreeResponse.coverage.toFixed(2)}% coverage)
                        </p>
                        <ul>
                            {parents.map(([key, node]) => (
                                <DataPointTreeBranch
                                    entity={entity}
                                    key={`${resultIndex}-${key}`}
                                    nodeId={node.dataPoint.id}
                                    tree={dataPointTreeResponse.tree}
                                    label={node.dataPoint.label}
                                />
                            ))}
                        </ul>
                    </section>
                );
            })}
        </div>
    );
};