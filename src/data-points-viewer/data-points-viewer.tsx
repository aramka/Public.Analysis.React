import React, { useEffect, useRef, useState } from "react"
import {useAsync} from "../hooks/useAsync"
import {useParams} from "react-router"
import { EntityType } from "../models/entity-type";
import { TimeSeries } from "../time-series/time-series";
import { dataPointsService } from "./dataPointsService";
import { DataPointTreeBranch } from "./data-point-tree-branch";
import {
    DataPointVisual,
    DataPointsViewerProps,
    SelectedDataPointVisual
} from "./models/data-points-viewer-models";
import "./data-points-viewer.css";

export const DataPointsViewer: React.FC<DataPointsViewerProps> = ({
    entityType = EntityType.Ticker,
    ...props
}) =>{
    const [selectedVisual, setSelectedVisual] = useState<SelectedDataPointVisual | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const routeParams = useParams();
    const entity = props.entity ?? routeParams.entity ?? "";
    const dataPointSet = props.dataPointSet ?? routeParams.dataPointSet ?? null;

    const {data:serviceResponse, loading:dataPointTreeLoading, error:dataPointTreeError} = useAsync(
        () => entity
            ? dataPointsService.fetchDataPointTree(entityType, entity, dataPointSet)
            : Promise.resolve({ responseData: null, validationErrors: [] })
    )

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog || !selectedVisual) {
            return;
        }

        dialog.showModal();
        return () => {
            dialog.close();
        };
    }, [selectedVisual]);

    if(!entity)
        return (<h1>No entity provided</h1>)

    if (dataPointTreeLoading) {
        return <div style={{ padding: "24px", color: "#666" }}>Loading data point tree...</div>;
    }

    if (dataPointTreeError) {
        return <div style={{ padding: "24px", color: "#ef4444" }}>Error: {dataPointTreeError.message}</div>;
    }

    if(!serviceResponse?.responseData?.length) {
        return <div style={{ padding: "24px", color: "#666" }}>No data point tree available.</div>;
    }

    return (
        <div>
            {serviceResponse.responseData.map((dataPointTreeResponse, resultIndex) => {
                const parents = Object.entries(dataPointTreeResponse.tree)
                    .filter(([, node]) => !node.dataPoint.parentIds?.some((parentId) => parentId in dataPointTreeResponse.tree));

                return (
                    <section key={`${dataPointTreeResponse.file}-${resultIndex}`}>
                        <h2>{dataPointTreeResponse.description || dataPointTreeResponse.file || "Data Point Tree"}</h2>
                        {parents.length} parent nodes
                        <p>
                            {dataPointTreeResponse.matchingDataPointsCount} matching data points / {dataPointTreeResponse.totalDataPointsCount} data points
                            ({dataPointTreeResponse.coverage.toFixed(2)}% coverage)
                        </p>
                        <ul>
                            {parents.map(([key, node]) => (
                                <DataPointTreeBranch
                                    key={`${resultIndex}-${key}`}
                                    nodeId={node.dataPoint.id}
                                    tree={dataPointTreeResponse.tree}
                                    onOpenVisual={(dataPointName, visual) => setSelectedVisual({ dataPointName, visual })}
                                    label={node.dataPoint.label}
                                />
                            ))}
                        </ul>
                    </section>
                );
            })}
            {selectedVisual && (
                <dialog
                    ref={dialogRef}
                    className="data-points-viewer__dialog"
                    aria-labelledby="data-points-viewer-dialog-title"
                    onCancel={(event) => {
                        event.preventDefault();
                        setSelectedVisual(null);
                    }}
                    onClick={(event) => {
                        if (event.target === dialogRef.current) {
                            setSelectedVisual(null);
                        }
                    }}
                >
                    <header className="data-points-viewer__dialog-header">
                        <h2 id="data-points-viewer-dialog-title">
                            {selectedVisual.dataPointName} — {selectedVisual.visual}
                        </h2>
                        <button type="button" onClick={() => setSelectedVisual(null)}>
                            Close
                        </button>
                    </header>
                    {selectedVisual.visual === DataPointVisual.TimeSeries && (
                        <TimeSeries
                            entity={entity}
                            dataPointName={selectedVisual.dataPointName}
                            entityType={entityType}
                        />
                    )}
                </dialog>
            )}
        </div>
    );
};