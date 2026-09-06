import React from "react"
import {useParams} from "react-router"
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { endpointUrls } from "../services/endPointUrls";
import { useAsync } from "../hooks/useAsync";
// ==========================================
// 1. DATA LAYER (Types & Mock Service)
// ==========================================
export interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
}

const timeSeriesDataService = {
  async fetchConceptTimeSeries(ticker: string, concept: string): Promise<TimeSeriesDataPoint[]> {
    const timeSeriesUrl = endpointUrls.visualTimeSeries(ticker, concept);
    const response = await fetch(timeSeriesUrl);
    const data = await response.json();
    return data;
  }
};

// ==========================================
// 3. PRESENTATION LAYER (UI Component)
// ==========================================
export const TimeSeries: React.FC = () => {
  let { ticker, concept } = useParams();
  if(!ticker || !concept) {
    return <div style={{ padding: "24px", color: "#666" }}>Invalid ticker or concept</div>;
  }
  const { data, loading, error } =  useAsync(() => timeSeriesDataService.fetchConceptTimeSeries(ticker, concept));

  if (loading) {
    return <div style={{ padding: "24px", color: "#666" }}>Loading metrics...</div>;
  }

  if (error) {
    return <div style={{ padding: "24px", color: "#ef4444" }}>Error: {error}</div>;
  }

  return (
    <div style={{ 
      width: "100%", 
      backgroundColor: "#ffffff", 
      padding: "20px", 
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      boxSizing: "border-box"
    }}>
      <h3 style={{ margin: "0 0 16px 0", fontFamily: "sans-serif", color: "#1f2937" }}>
        System Throughput
      </h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="timestamp" 
              stroke="#9ca3af" 
              fontSize={12} 
              tickLine={false}
            />
            <YAxis 
              stroke="#9ca3af" 
              fontSize={12} 
              tickLine={false} 
            />
            <Tooltip 
              contentStyle={{ 
                fontFamily: "sans-serif", 
                borderRadius: "6px", 
                border: "1px solid #e5e7eb" 
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#2563eb" 
              strokeWidth={2.5} 
              dot={{ r: 4, stroke: "#2563eb", strokeWidth: 2, fill: "#fff" }}
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
