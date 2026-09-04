import React, {useEffect, useState} from "react"

export interface DataPointMetaModel{
    Name: string;
    Visuals: string[];
    RequiredParameters:string[]
}

const mockDataPointsService = {
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

function useTickerDataPoints(){
    const [dataPoints, setDataPoints] = useState<DataPointMetaModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        let isMounted = true;
            setLoading(true);
            mockDataPointsService
            .getDataPoints()
            .then(result=>{
                if (isMounted) {
                    setDataPoints(result);
                    setLoading(false);
                }
            })
            .catch(err => {
                if (isMounted) {
                    setError(err.message);
                    setLoading(false);
                }
            });
            return ()=>{isMounted = false;}
    }, []);

    return { dataPoints, loading, error };
}

export const TickerDataPoints: React.FC = () =>{
    const { dataPoints, loading, error } = useTickerDataPoints();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Ticker Data Points</h2>
            <ul>
                {dataPoints.map((point, index) => (
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