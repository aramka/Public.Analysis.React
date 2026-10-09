import React from "react"
import {useAsync} from "../hooks/useAsync"
import {useParams} from "react-router"
import { endpointUrls } from "../services/endPointUrls";
import { ServiceResponse } from "../services/models/service-response";

export enum Visual {
    TimeSeries="time-series"
}

interface FactNodeChild {
    childId: string;
    childLabel: string;
    order: number;
}

interface FactNode {
    id: string;
    label: string;
    parentsIds?: string[];
    children?: FactNodeChild[];
    name: string;
}
enum VisualTypes{
    TimeSeries="time-series"
}
interface FactNodeVisualsModel{
    factNode:FactNode;
    visuals:VisualTypes[]
}

interface StatementTreeResult {
    file: string;
    totalTreeFactsCount: number;
    totalTickerFactsCount: number;
    matchingFactsCount: number;
    coverage: number;
    tree: Record<string, FactNodeVisualsModel>;
    description:string
}

const statementTreeService = {
    async fetchStatementTree(ticker: string, statementName: string): Promise<ServiceResponse<StatementTreeResult>> {
        // TODO: put the fasb-taxonomies magic string somewhere
        const response = await fetch(endpointUrls.getStatementTree("fasb-taxonomies", statementName, ticker));
        if (!response.ok) {
            throw new Error("Failed to fetch statement tree");
        }
        return await response.json() as ServiceResponse<StatementTreeResult>;
    }
};

export const FactsDataSetName:string="CompanyFacts"

const StatementTreeBranch: React.FC<{
    ticker:string;
    nodeId: string;
    tree: Record<string, FactNodeVisualsModel>;
    label?:string;
}> = ({ ticker, nodeId, tree, label }) => {
    
    const node = tree[nodeId];

    if (!node ) {
        return null;
    }

    const children = [...(node.factNode.children ?? [])]
    .sort((left, right) => left.order - right.order)
    .map(c=>{ return {id:c.childId,order:c.order, childLabel:c.childLabel,uniqueKey:`${c.childId}${c.order}${c.childLabel}`} });

    return (
        <li>
            <details open>
                <summary>
                    <span>{label || node.factNode.name}</span>
                    <span>
                         {
                            node.visuals.map((visual)=>
                                    {
                                        
                                        const path:string[] = [ticker, node.factNode.name ?? "",visual]
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
                        ? <StatementTreeBranch ticker={ticker} key={child.uniqueKey} nodeId={child.id} tree={tree} label={child.childLabel} />
                        : <li key={child.uniqueKey}>Not found in tree: {child.id} | {child.childLabel}</li>)}
                </ul>
            </details>
        </li>
    );
};

export const TickerFacts: React.FC = () =>{
    const { ticker, statement } = useParams();
   
    if(!ticker)
        return (<h1>No ticker!</h1>)
    if(!statement)
        return (<h1>No statement</h1>)

    const {data:serviceResponse, loading:statementTreeLoading, error:statementTreeError} = useAsync(()=>statementTreeService.fetchStatementTree(ticker!, statement!))

    if(!ticker) {
        return <div style={{ padding: "24px", color: "#666" }}>Invalid ticker</div>;
    }
  
    // function getConceptVisualRoute( ticker: string, concept:string, visual:Visual) {
    //     return `/${ticker}/${concept}/${visual}`;
    // }

    if(!serviceResponse || !serviceResponse.responseData || !serviceResponse.responseData.tree || Object.keys(serviceResponse.responseData.tree).length === 0) {
        return <div style={{ padding: "24px", color: "#666" }}>No statement tree data available.</div>;
    }

    const statementTreeResponse = serviceResponse.responseData;
    const parents = Object.entries(statementTreeResponse.tree)
        .filter(([, node]) => !node.factNode.parentsIds?.some((parentId) => parentId in statementTreeResponse.tree));

    return (
        <div>
            <section>
                <h2>Statement Tree</h2>
                {statementTreeLoading && <p>Loading statement tree...</p>}
                {statementTreeError && <p>Error: {statementTreeError.message}</p>}
                {parents.length} parent nodes
                {serviceResponse && (
                    <>
                        <p>{statementTreeResponse.description}</p>
                        <p>
                            {statementTreeResponse.matchingFactsCount} matching facts / {statementTreeResponse.totalTreeFactsCount} tree facts
                            ({statementTreeResponse.coverage.toFixed(2)}% coverage)
                        </p>
                        <ul>
                            {parents.map(([key, node]) => (
                                <StatementTreeBranch ticker={ticker} key={key} nodeId={node.factNode.id} tree={statementTreeResponse.tree} label={node.factNode.label} />
                            ))}
                        </ul>
                    </>
                )}
            </section>
        </div>
    );
}