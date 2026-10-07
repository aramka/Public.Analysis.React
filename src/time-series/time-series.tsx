import React from "react"
import {useLocation} from "react-router"
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
import { ServiceResponse } from "../services/models/service-response";
// ==========================================
// 1. DATA LAYER (Types & Mock Service)
// ==========================================
export interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
}

const timeSeriesDataService = {
  async fetchTimeSeries(path:string): Promise<ServiceResponse<TimeSeriesDataPoint[]>> {
    const timeSeriesUrl = `${endpointUrls.publicAnalysisBaseUrl}${path}`
    const response = await fetch(timeSeriesUrl);
    const data = await response.json();
    return data;
  }
};

// ==========================================
// 3. PRESENTATION LAYER (UI Component)
// ==========================================
export const TimeSeries: React.FC = () => {


  // let { ticker, dataSetName, dataPointName } = useParams();
  let location = useLocation();

  // TODO: need a way to handle the error case so that we get backe a strongly typed error and can display the error message in the UI. The current implementation just displays "Error: [object Object]" which is not helpful to the user.
  const { data, loading, error } = useAsync(() => timeSeriesDataService.fetchTimeSeries(location.pathname));

  if (loading) {
    return <div style={{ padding: "24px", color: "#666" }}>Loading metrics...</div>;
  }

  if (error) {
    return <div style={{ padding: "24px", color: "#ef4444" }}>Error: {JSON.stringify(error)}</div>;
  }
  // 2. Format the numeric tick into a readable date string
  const formatXAxisTick = (tickItem:number) => {
    const date = new Date(tickItem*1000);
    return date.toISOString().split('T')[0];
  };
  if (!data || !data.responseData || data.responseData.length === 0) {
    return <div style={{ padding: "24px", color: "#666" }}>No data available.</div>;
  }
  else{
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
          <LineChart data={data.responseData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="timeStamp" 
              stroke="#9ca3af" 
              fontSize={12} 
              tickLine={true}
              tickFormatter={formatXAxisTick}
            />
            <YAxis 
              stroke="#9ca3af" 
              fontSize={12} 
              tickLine={true} 
            />
            {/* TODO: tool tip display the human readable date, the value, and the meta data about the datapoint. Need to be able to goto that particular datapoint very quickly for troubleshooting */}
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
}
