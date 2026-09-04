import React from "react"
import {useAsync} from "../../hooks/useAsync"

export interface DataPointMetaModel{
    Name: string;
    Visuals: string[];
    RequiredParameters:string[]
}

const dataPointsService = {
    async getDataPoints() : Promise<DataPointMetaModel[]> {
        const tickerDataPointsBaseUrl  = import.meta.env.VITE_PUBLIC_ANALYSIS_BASE_URL;
        const url = `${tickerDataPointsBaseUrl}/ticker-data-points/AAPL`;
        const response = await fetch(url);

        if(!response.ok) {
            throw new Error("Failed to fetch data points");
        }
        return await response.json();
    }
};

export const DataPoints: React.FC = () =>{
    const { data, loading, error } = useAsync(() => dataPointsService.getDataPoints());


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Data Points</h2>
            <ul>
                {data?.map((point, index) => (
                    <li key={index}>
                        <strong>{point.Name}</strong>
                        <p>Visuals: {point.Visuals.join(", ")}</p>
                        <p>Required Parameters: {point.RequiredParameters.join(", ")}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}