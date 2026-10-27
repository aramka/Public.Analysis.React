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
import { EntityType } from "../models/entity-type";
// ==========================================
// 1. DATA LAYER (Types & Mock Service)
// ==========================================
export interface TimeSeriesDataPoint {
  timeStamp: number | string;
  value: number;
  [attribute: string]: unknown;
}

interface TimeSeriesResponse extends ServiceResponse<TimeSeriesDataPoint[]> {
  label?: string;
}

const timeSeriesDataService = {
  async fetchTimeSeries(entityType: EntityType, entity: string, dataPointName: string): Promise<TimeSeriesResponse> {
    if (!entity || !dataPointName) {
      throw new Error("Entity and data point name are required to load a time series");
    }

    const path = `/${entityType}/${encodeURIComponent(entity)}/${encodeURIComponent(dataPointName)}/time-series`;
    const timeSeriesUrl = `${endpointUrls.publicAnalysisBaseUrl}${path}`;
    const response = await fetch(timeSeriesUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch time series: ${response.status}`);
    }
    const data = await response.json() as TimeSeriesResponse;
    return data;
  }
};

const formatXAxisTick = (tickItem: number) => {
  const date = new Date(tickItem * 1000);
  return date.toISOString().split("T")[0];
};

const formatTooltipDate = (timestamp: number | string) => {
  const numericTimestamp = Number(timestamp);
  const date = new Date(Number.isFinite(numericTimestamp) ? numericTimestamp * 1000 : timestamp);
  if (Number.isNaN(date.getTime())) {
    return String(timestamp);
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "medium",
    timeZone: "UTC"
  }).format(date);
};

const formatAttribute = (value: unknown) => {
  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value) ?? String(value);
};

// ==========================================
// 3. PRESENTATION LAYER (UI Component)
// ==========================================
interface TimeSeriesProps {
  entity?: string;
  dataPointName?: string;
  entityType?: EntityType;
}

export const TimeSeries: React.FC<TimeSeriesProps> = ({
  entityType = EntityType.Ticker,
  entity,
  dataPointName
}) => {

  const location = useLocation();
  const [routeEntity, routeDataPointName] = location.pathname.split("/").filter(Boolean);
  const resolvedEntity = entity ?? routeEntity ?? "";
  const resolvedDataPointName = dataPointName ?? routeDataPointName ?? "";

  // TODO: need a way to handle the error case so that we get backe a strongly typed error and can display the error message in the UI. The current implementation just displays "Error: [object Object]" which is not helpful to the user.
  const { data: serviceResponseData, loading, error } = useAsync(
    () => timeSeriesDataService.fetchTimeSeries(entityType, resolvedEntity, resolvedDataPointName)
  );

  //TODO: need a way to handle service response data containing validation errors. The current implementation just displays "No data available." which is not helpful to the user.
  if (loading) {
    return <div style={{ padding: "24px", color: "#666" }}>Loading metrics...</div>;
  }

  if (error) {
    return <div style={{ padding: "24px", color: "#ef4444" }}>Error: {JSON.stringify(error)}</div>;
  }
  if (!serviceResponseData || !serviceResponseData.responseData || serviceResponseData.responseData.length === 0) {
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
        {resolvedEntity} {serviceResponseData.label?.trim() || dataPointName || resolvedDataPointName}
      </h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={serviceResponseData.responseData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="timeStamp" 
              stroke="#9ca3af" 
              fontSize={12} 
              tickLine={false}
              tickFormatter={formatXAxisTick}
            />
            <YAxis 
              stroke="#9ca3af" 
              fontSize={12} 
              tickLine={false}
            />
            <Tooltip 
              trigger="click"
              content={({ active, payload, label }) => {
                if (!active || payload.length === 0) {
                  return null;
                }

                const dataPoint = payload[0].payload as TimeSeriesDataPoint;
                const timestamp = dataPoint.timeStamp ?? label;

                return (
                  <div style={{
                    fontFamily: "sans-serif",
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    padding: "10px 12px"
                  }}>
                    <strong>{formatTooltipDate(timestamp)}</strong>
                    <dl style={{ margin: "8px 0 0" }}>
                      {Object.entries(dataPoint)
                        .filter(([attribute]) => attribute !== "timeStamp")
                        .map(([attribute, value]) => (
                          <React.Fragment key={attribute}>
                            <dt style={{ fontWeight: 600 }}>{attribute}</dt>
                            <dd style={{ margin: "0 0 4px" }}>{formatAttribute(value)}</dd>
                          </React.Fragment>
                        ))}
                    </dl>
                  </div>
                );
              }}
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
