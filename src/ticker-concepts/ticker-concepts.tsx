import React from "react"
import {useAsync} from "../hooks/useAsync"
import {useParams} from "react-router"
import { endpointUrls } from "../services/endPointUrls";

export enum Visual {
    TimeSeries="time-series"
}

export interface ConceptMeta{
    Concept: string;
    Visuals: string[];
    RequiredParameters: string[];
    Labels: string[];
    Statements: string[];
    FactCount: number;
}

const tickerConceptsMetasService = {
    async fetchTickerConceptMetas(ticker:string) : Promise<ConceptMeta[]> {
        const url:string = endpointUrls.fetchTickerConceptMetas(ticker);
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error("Failed to fetch concept metas");
        }
        const json = await response.json();
        
        const concept_metas:ConceptMeta[]= json

        return concept_metas;
    }
};

export const TickerConcepts: React.FC = () =>{
    const { ticker } = useParams();
    if(!ticker) {
        return <div style={{ padding: "24px", color: "#666" }}>Invalid ticker</div>;
    }
    const { data, loading, error } = useAsync(()=> tickerConceptsMetasService.fetchTickerConceptMetas(ticker));


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    //TODO:Retrieve the app route from a routes.ts class that both creates the routes in the router and provides routes
    function getConceptVisualRoute( ticker: string, concept:string, visual:Visual) {
        return `/${ticker}/${concept}/${visual}`;
    }

    return (
        <div>
            <h1>{ticker} Concepts</h1>
            <table>
                <thead>
                    <tr>
                        <th>Concept</th>
                        <th>Fact Count</th>
                        <th>Statements</th>
                        <th>Visuals</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((concept, index) => (
                        <tr key={index}>
                            <td>{concept.Concept.trim()}</td>
                            <td>{concept.FactCount}</td>
                            <td>{concept.Statements.join(", ")}</td>
                            <td>
                                    {concept.Visuals.map((visual) =>
                                                <a key={visual} href={`${getConceptVisualRoute(ticker, concept.Concept, visual as Visual)}`}>
                                                    {visual}&nbsp;
                                                </a>
                                            
                                    )} 
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}