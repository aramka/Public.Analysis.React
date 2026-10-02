import React from "react"
import {useAsync} from "../hooks/useAsync"
import {useParams} from "react-router"
import { endpointUrls } from "../services/endPointUrls";

export enum Visual {
    TimeSeries="time-series"
}

interface FactNodeChild {
    ChildElementId: string;
    ChildLabel: string;
    Order: number;
}

interface FactNode {
    ElementId: string;
    Label: string;
    XsElement: {
        Abstract?: boolean;
        Name?: string;
    };
    ParentsElementIds?: string[];
    Children?: FactNodeChild[];
}
enum VisualTypes{
    TimeSeries="time-series"
}
interface FactNodeVisual{
    visualType:VisualTypes,
    dataSetName:string,
    datapointName:string
}
interface FactNodeVisualsModel{
    factNode:FactNode;
    visuals:FactNodeVisual[]
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
    async fetchStatementTree(ticker: string, statementName: string): Promise<StatementTreeResult> {
        // TODO: put the fasb-taxonomies magic string somewhere
        const response = await fetch(endpointUrls.getStatementTree("fasb-taxonomies", statementName, ticker));
        if (!response.ok) {
            throw new Error("Failed to fetch statement tree");
        }
        return await response.json() as StatementTreeResult;
    }
};

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

    const children = [...(node.factNode.Children ?? [])]
    .sort((left, right) => left.Order - right.Order)
    .map(c=>{ return {ChildElementId:c.ChildElementId,Order:c.Order, ChildLabel:c.ChildLabel,UniqueKey:`${c.ChildElementId}${c.Order}`}});

    return (
        <li>
            <details open>
                <summary>
                    <span>{label || node.factNode.XsElement.Name}</span>
                    <span>
                         {
                            node.visuals.map((v)=><a key={v.visualType} href={`/${ticker}/${v.dataSetName}/${v.datapointName}/${v.visualType}`} >{v.visualType}</a>)
                        }
                    </span>

                </summary>
                <ul>
                    {children.map((child) => tree[child.ChildElementId]
                        ? <StatementTreeBranch ticker={ticker} key={child.UniqueKey} nodeId={child.ChildElementId} tree={tree} label={child.ChildLabel} />
                        : <li key={child.UniqueKey}>Not found in tree: {child.ChildElementId}</li>)}
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

    const {data:statementTreeResponse, loading:statementTreeLoading, error:statementTreeError} = useAsync(()=>statementTreeService.fetchStatementTree(ticker!, statement!))

    if(!ticker) {
        return <div style={{ padding: "24px", color: "#666" }}>Invalid ticker</div>;
    }
  
    // function getConceptVisualRoute( ticker: string, concept:string, visual:Visual) {
    //     return `/${ticker}/${concept}/${visual}`;
    // }

    return (
        <div>
            <section>
                <h2>Statement Tree</h2>
                {statementTreeLoading && <p>Loading statement tree...</p>}
                {statementTreeError && <p>Error: {statementTreeError.message}</p>}
                {statementTreeResponse && (
                    <>
                        <p>{statementTreeResponse.description}</p>
                        <p>
                            {statementTreeResponse.matchingFactsCount} matching facts / {statementTreeResponse.totalTreeFactsCount} tree facts
                            ({statementTreeResponse.coverage.toFixed(2)}% coverage)
                        </p>
                        <ul>
                            {Object.entries(statementTreeResponse.tree)
                                .filter(([, node]) => !node.factNode.ParentsElementIds?.some((parentId) => parentId in statementTreeResponse.tree))
                                .map(([, node]) => (
                                   <StatementTreeBranch ticker={ticker} key={node.factNode.ElementId} nodeId={node.factNode.ElementId} tree={statementTreeResponse.tree} label={node.factNode.Label} /> 
                                ))}
                        </ul>
                    </>
                )}
            </section>
        </div>
    );
}