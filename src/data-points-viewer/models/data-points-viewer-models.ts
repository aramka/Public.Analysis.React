import { EntityType } from "../../models/entity-type";

export enum DataPointVisual {
  TimeSeries = "time-series"
}

export interface DataPointChild {
  id: string;
  label: string;
  order: number;
}

export interface DataPoint {
  id: string;
  label: string;
  parentIds?: string[];
  children?: DataPointChild[];
  name: string;
}

export interface ApiDataPoint {
  id: string;
  label: string;
  parentsIds?: string[];
  children?: DataPointChild[];
  name: string;
}

export interface DataPointVisualsModel {
  dataPoint: DataPoint;
  visuals: DataPointVisual[];
}

export interface DataPointTreeResult {
  file: string;
  totalDataPointsCount: number;
  matchingDataPointsCount: number;
  coverage: number;
  tree: Record<string, DataPointVisualsModel>;
  description: string;
}

export interface ApiDataPointTreeResult {
  file: string;
  totalTreeFactsCount: number;
  matchingFactsCount: number;
  coverage: number;
  description: string;
  tree: Record<string, { factNode: ApiDataPoint; visuals: DataPointVisual[] }>;
}

export interface DataPointsViewerProps {
  entity?: string;
  dataPointSet?: string | null;
  entityType?: EntityType;
}

export interface SelectedDataPointVisual {
  dataPointName: string;
  visual: DataPointVisual;
}
