import React from "react";
import {
  DataPointVisual,
  DataPointVisualsModel
} from "./models/data-points-viewer-models";

interface DataPointTreeBranchProps {
  nodeId: string;
  tree: Record<string, DataPointVisualsModel>;
  onOpenVisual: (dataPointName: string, visual: DataPointVisual) => void;
  label?: string;
}

export const DataPointTreeBranch: React.FC<DataPointTreeBranchProps> = ({
  nodeId,
  tree,
  onOpenVisual,
  label
}) => {
  const node = tree[nodeId];
  if (!node) {
    return null;
  }

  const children = [...(node.dataPoint.children ?? [])]
    .sort((left, right) => left.order - right.order)
    .map((child) => ({
      ...child,
      uniqueKey: `${child.id}${child.order}${child.label}`
    }));

  return (
    <li>
      <details open>
        <summary>
          <span>{label || node.dataPoint.name}</span>
          <span>
            {node.visuals.map((visual) => (
              <button
                key={`${node.dataPoint.id}-${visual}`}
                type="button"
                onClick={() => onOpenVisual(node.dataPoint.name, visual)}
              >
                {visual}
              </button>
            ))}
          </span>
        </summary>
        <ul>
          {children.map((child) => tree[child.id]
            ? (
              <DataPointTreeBranch
                key={child.uniqueKey}
                nodeId={child.id}
                tree={tree}
                onOpenVisual={onOpenVisual}
                label={child.label}
              />
            )
            : <li key={child.uniqueKey}>Not found in tree: {child.id} | {child.label}</li>)}
        </ul>
      </details>
    </li>
  );
};
