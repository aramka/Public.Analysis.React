import React from "react"
import {useAsync} from "../../hooks/useAsync"

export interface DataPointMetaModel{
    Name: string;
    Visuals: string[];
    RequiredParameters:string[]
}

export enum Visual {
    TimeSeries="time-series"
}
export interface EndPointMetaModel{
    Segments:EndpointSegmentModel[],
    Visual: Visual;
}
export enum EndpointModelSegmentType {
    Template="template",
    Literal="literal"
}
export interface ConceptVisual{
    Visual: Visual;
    Concept:string;
}
export interface EndpointSegmentModel{
    Name: string;
    Type:EndpointModelSegmentType;
}
export interface ConceptVisualsModel{
    Endpoints:Record<Visual,EndPointMetaModel>;
    Concepts:ConceptVisual[]
}

const dataPointsService = {
    async getDataPoints(ticker:string) : Promise<DataPointMetaModel[]> {
        const tickerDataPointsBaseUrl  = import.meta.env.VITE_PUBLIC_ANALYSIS_BASE_URL;
        const url = `${tickerDataPointsBaseUrl}/ticker-data-points/${ticker}`;
        const response = await fetch(url);

        if(!response.ok) {
            throw new Error("Failed to fetch data points");
        }
        return await response.json();
    },
    async getConceptVisuals(ticker:string) : Promise<ConceptVisualsModel> {
        // const tickerDataPointsBaseUrl  = import.meta.env.VITE_PUBLIC_ANALYSIS_BASE_URL;
        // const url = `${tickerDataPointsBaseUrl}/concept-visuals/${ticker}`;
        // const response = await fetch(url);

        // if(!response.ok) {
        //     throw new Error("Failed to fetch concept visuals");
        // }
        // return await response.json();
        
        const endpoints: Record<Visual, EndPointMetaModel> = {
            [Visual.TimeSeries]: {
                Segments: [],
                Visual: Visual.TimeSeries
            }
        };
        const concepts: ConceptVisual[] = [
            {
                Visual: Visual.TimeSeries,
                Concept: "Revenue"
            }
        ];
        const conceptVisuals:ConceptVisualsModel = {
            Endpoints: endpoints,
            Concepts: concepts
        };
        return Promise.resolve(conceptVisuals);
    }
};

export const DataPoints: React.FC = () =>{
    const { data, loading, error } = useAsync(()=> dataPointsService.getConceptVisuals(ticker)); // useAsync(() => dataPointsService.getDataPoints(ticker));
    const ticker = "AAPL";

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    function getConceptVisualRoute(endpoints: Record<Visual, EndPointMetaModel>, ticker: string, concept: ConceptVisual) {
        return `/${ticker}/${concept.Concept}/${concept.Visual}`;
    }

    return (
        <div>
            <h2>{ticker} Data Points</h2>
            <ul>
                {data?.Concepts?.map((concept, index) => (
                    <li key={index}>
                        {/* <strong>{point.Name}</strong>
                        <p>Visuals: {point.Visuals.join(", ")}</p>
                        <p>Required Parameters: {point.RequiredParameters.join(", ")}</p> */}
                        <a
                            href={`${getConceptVisualRoute(data.Endpoints,ticker,concept)}`}
                        >
                        {concept.Concept}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}