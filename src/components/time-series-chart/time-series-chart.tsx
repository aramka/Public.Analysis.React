import React, { useEffect, useState } from "react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";

// ==========================================
// 1. DATA LAYER (Types & Mock Service)
// ==========================================
export interface MetricDataPoint {
  timestamp: string;
  value: number;
}

const mockChartService = {
  async fetchMetrics(): Promise<MetricDataPoint[]> {
    // Simulates a 300ms network round-trip delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [
      { timestamp: "08:00", value: 34 },
      { timestamp: "09:00", value: 45 },
      { timestamp: "10:00", value: 42 },
      { timestamp: "11:00", value: 68 },
      { timestamp: "12:00", value: 55 },
      { timestamp: "13:00", value: 72 },
      { timestamp: "14:00", value: 61 },
    ];
  }
};

// ==========================================
// 2. STATE LAYER (Custom Hook pattern)
// ==========================================
function useChartData() {
  const [data, setData] = useState<MetricDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    mockChartService.fetchMetrics()
      .then((result) => {
        if (isMounted) {
          setData(result);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "An error occurred");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false; // Prevents memory leaks if component unmounts mid-fetch
    };
  }, []);

  return { data, isLoading, error };
}

// ==========================================
// 3. PRESENTATION LAYER (UI Component)
// ==========================================
export const TimeSeriesChart: React.FC = () => {
  const { data, isLoading, error } = useChartData();

  if (isLoading) {
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
