import React from "react"
import {useAsync} from "../hooks/useAsync"
import {useParams} from "react-router"
import { endpointUrls } from "../services/endPointUrls";

export enum Visual {
    TimeSeries="time-series"
}

interface StatementTreeChild {
    ChildElementId: string;
    ChildLabel: string;
    Order: number;
}

interface StatementTreeNode {
    ElementId: string;
    Label: string;
    XsElement: {
        Abstract?: boolean;
        Name?: string;
    };
    ParentsElementIds?: string[];
    Children?: StatementTreeChild[];
}

interface StatementTreeResponse {
    file: string;
    totalTreeFactsCount: number;
    totalTickerFactsCount: number;
    matchingFactsCount: number;
    coverage: number;
    tree: Record<string, StatementTreeNode>;
}

const statementTreeService = {
    async fetchStatementTree(ticker: string, statementName: string): Promise<StatementTreeResponse> {
        const response = await fetch(endpointUrls.getStatementTree(ticker, statementName));
        if (!response.ok) {
            throw new Error("Failed to fetch statement tree");
        }
        return await response.json() as StatementTreeResponse;
    }
};

const StatementTreeBranch: React.FC<{
    nodeId: string;
    tree: Record<string, StatementTreeNode>;
    ancestors: Set<string>;
}> = ({ nodeId, tree, ancestors }) => {
    const node = tree[nodeId];
    if (!node || ancestors.has(nodeId)) {
        return null;
    }

    const nextAncestors = new Set(ancestors).add(nodeId);
    const children = [...(node.Children ?? [])].sort((left, right) => left.Order - right.Order);

    return (
        <li>
            <details open>
                <summary>
                    {node.Label || node.XsElement.Name || node.ElementId}
                    {node.XsElement.Abstract && <small> (Abstract)</small>}
                </summary>
                <ul>
                    {children.map((child) => tree[child.ChildElementId]
                        ? <StatementTreeBranch key={child.ChildElementId} nodeId={child.ChildElementId} tree={tree} ancestors={nextAncestors} />
                        : <li key={child.ChildElementId}>{child.ChildLabel}</li>)}
                </ul>
            </details>
        </li>
    );
};

export const TickerConcepts: React.FC = () =>{
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
                        <p>
                            {statementTreeResponse.matchingFactsCount} matching facts / {statementTreeResponse.totalTreeFactsCount} tree facts
                            ({statementTreeResponse.coverage.toFixed(2)}% coverage)
                        </p>
                        <ul>
                            {Object.entries(statementTreeResponse.tree)
                                .filter(([, node]) => !node.ParentsElementIds?.some((parentId) => parentId in statementTreeResponse.tree))
                                .map(([elementId]) => (
                                    <StatementTreeBranch key={elementId} nodeId={elementId} tree={statementTreeResponse.tree} ancestors={new Set()} />
                                ))}
                        </ul>
                    </>
                )}
            </section>
        </div>
    );
}