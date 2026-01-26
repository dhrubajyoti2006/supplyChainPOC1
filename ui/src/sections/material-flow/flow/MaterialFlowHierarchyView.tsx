import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { hierarchy, tree } from "d3-hierarchy";
import { linkHorizontal } from "d3-shape";
import { useEffect, useMemo, useRef, useState, type MouseEvent, type WheelEvent } from "react";
import ReactCountryFlag from "react-country-flag";
import type { MaterialFlow } from "../../../types/MaterialFlow";

type MaterialFlowHierarchyViewProps = {
  data: MaterialFlow[];
  isLoading: boolean;
  onNodeSelect?: (node: {
    name: string;
    kind: "root" | "level1" | "level2";
    branchKey?: "branch1" | "branch2" | "branch3";
    total: number;
    count?: number;
    country?: string;
  }) => void;
};

type TreeNode = {
  name: string;
  kind: "root" | "level1" | "level2";
  branchKey?: "branch1" | "branch2" | "branch3";
  country?: string;
  total: number;
  count?: number;
  children?: TreeNode[];
};

export function MaterialFlowHierarchyView({ data, isLoading, onNodeSelect }: MaterialFlowHierarchyViewProps) {
  const debugScroll = true;
  const { nodes: initialNodes, links } = useMemo(() => {
    const rootId = "US01";

    const sameCompanyTargets = new Map<string, number>();
    const sameCountryDiffCompanyTargets = new Map<string, number>();
    const foreignTargets = new Map<string, number>();
    const plantCountries = new Map<string, string>();

    data.forEach((row) => {
      if (!row.senderPlant || !row.plant) {
        return;
      }

      if (!row.senderPlant.startsWith("US")) {
        return;
      }

      if (row.country === "US" && row.companyCode === "US01") {
        sameCompanyTargets.set(row.plant, (sameCompanyTargets.get(row.plant) ?? 0) + row.gvcQuantity);
        plantCountries.set(row.plant, row.country);
        return;
      }

      if (row.country === "US" && row.companyCode !== "US01") {
        sameCountryDiffCompanyTargets.set(
          row.plant,
          (sameCountryDiffCompanyTargets.get(row.plant) ?? 0) + row.gvcQuantity
        );
        plantCountries.set(row.plant, row.country);
        return;
      }

      if (row.country !== "US") {
        foreignTargets.set(row.plant, (foreignTargets.get(row.plant) ?? 0) + row.gvcQuantity);
        plantCountries.set(row.plant, row.country);
      }
    });

    const branchTotal = (plants: Map<string, number>) =>
      Array.from(plants.values()).reduce((sum, value) => sum + value, 0);

    const treeData: TreeNode = {
      name: "US01 (Start)",
      kind: "root",
      country: "US",
      total:
        branchTotal(sameCompanyTargets) +
        branchTotal(sameCountryDiffCompanyTargets) +
        branchTotal(foreignTargets),
      count:
        sameCompanyTargets.size + sameCountryDiffCompanyTargets.size + foreignTargets.size,
      children: [
        {
          name: "Branch 1: Same Company Code",
          kind: "level1",
          branchKey: "branch1",
          country: "US",
          total: branchTotal(sameCompanyTargets),
          count: sameCompanyTargets.size,
          children: Array.from(sameCompanyTargets.entries()).map(([plant, total]) => ({
            name: plant,
            kind: "level2",
            branchKey: "branch1",
            country: plantCountries.get(plant),
            total
          }))
        },
        {
          name: "Branch 2: Same Country, Different Company",
          kind: "level1",
          branchKey: "branch2",
          country: "US",
          total: branchTotal(sameCountryDiffCompanyTargets),
          count: sameCountryDiffCompanyTargets.size,
          children: Array.from(sameCountryDiffCompanyTargets.entries()).map(([plant, total]) => ({
            name: plant,
            kind: "level2",
            branchKey: "branch2",
            country: plantCountries.get(plant),
            total
          }))
        },
        {
          name: "Branch 3: Outside US",
          kind: "level1",
          branchKey: "branch3",
          country: "US",
          total: branchTotal(foreignTargets),
          count: foreignTargets.size,
          children: Array.from(foreignTargets.entries()).map(([plant, total]) => ({
            name: plant,
            kind: "level2",
            branchKey: "branch3",
            country: plantCountries.get(plant),
            total
          }))
        }
      ]
    };

    const root = hierarchy(treeData);
    const layout = tree<TreeNode>().nodeSize([80, 380]);
    const treeRoot = layout(root);

    const computedNodes = treeRoot.descendants().map((node) => ({
      name: node.data.name,
      kind: node.data.kind,
      branchKey: node.data.branchKey,
      country: node.data.country,
      total: node.data.total,
      count: node.data.count,
      x: node.x,
      y: node.y
    }));

    const computedLinks = treeRoot.links().map((link) => ({
      source: link.source.data.name,
      target: link.target.data.name
    }));

    return { nodes: computedNodes, links: computedLinks };
  }, [data]);

  const width = 1600;
  const height = Math.max(900, initialNodes.length * 90);
  const nodeWidth = 240;
  const level1NodeWidth = 190;
  const level2NodeWidth = 120;
  const branchColors: Record<string, string> = {
    branch1: "#2563eb",
    branch2: "#16a34a",
    branch3: "#f97316"
  };
  const nodeHeight = 56;
  const path = linkHorizontal<{ x: number; y: number }, { x: number; y: number }>()
    .x((d) => d.y)
    .y((d) => d.x);

  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [nodes, setNodes] = useState(initialNodes);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [nodeDrag, setNodeDrag] = useState<{
    id: string;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const handleMouseDown = (event: MouseEvent) => {
    setDragStart({ x: event.clientX - transform.x, y: event.clientY - transform.y });
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (nodeDrag) {
      const nextX = nodeDrag.originX + (event.clientX - nodeDrag.startX) / transform.scale;
      const nextY = nodeDrag.originY + (event.clientY - nodeDrag.startY) / transform.scale;
      setNodes((prev) =>
        prev.map((node) =>
          node.name === nodeDrag.id ? { ...node, x: nextY, y: nextX } : node
        )
      );
      return;
    }

    if (!dragStart) {
      return;
    }
    setTransform((prev) => ({ ...prev, x: event.clientX - dragStart.x, y: event.clientY - dragStart.y }));
  };

  const handleMouseUp = () => {
    setDragStart(null);
    setNodeDrag(null);
  };

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    setTransform((prev) => {
      const nextScale = Math.min(1.6, Math.max(0.6, prev.scale - event.deltaY * 0.001));
      return { ...prev, scale: nextScale };
    });
  };

  const handleNodeClick = (event: MouseEvent, node: typeof nodes[number]) => {
    onNodeSelect?.({
      name: node.name,
      kind: node.kind,
      branchKey: node.branchKey,
      total: node.total,
      count: node.count,
      country: node.country
    });
  };

  const handleNodeMouseDown = (event: MouseEvent, node: typeof nodes[number]) => {
    event.stopPropagation();
    setNodeDrag({
      id: node.name,
      startX: event.clientX,
      startY: event.clientY,
      originX: node.y,
      originY: node.x
    });
  };

  useEffect(() => {
    setNodes(initialNodes);
    if (!containerRef.current || initialNodes.length === 0) {
      return;
    }

    const minX = Math.min(...initialNodes.map((node) => node.x));
    const maxX = Math.max(...initialNodes.map((node) => node.x));
    const minY = Math.min(...initialNodes.map((node) => node.y));
    const maxY = Math.max(...initialNodes.map((node) => node.y));

    const diagramCenterX = (minY + maxY + nodeWidth) / 2;

    const updateCenter = () => {
      if (!containerRef.current) {
        return;
      }
      const { height: containerHeight, width: containerWidth } = containerRef.current.getBoundingClientRect();
      const targetCenterX = containerWidth / 2;
      setTransform((prev) => ({
        ...prev,
        x: targetCenterX - diagramCenterX,
        y: -minX
      }));
    };

    updateCenter();

    const observer = new ResizeObserver(updateCenter);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [initialNodes, nodeWidth]);

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        borderRadius: 0,
        border: "none",
        overflow: "hidden",
        backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)",
        backgroundSize: "18px 18px",
        bgcolor: "transparent",
        outline: debugScroll ? "2px solid #22c55e" : "none"
      }}
    >
      {isLoading ? (
        <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
          <CircularProgress size={24} />
        </Stack>
      ) : null}
      {!isLoading && nodes.length === 0 ? (
        <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
          <Typography variant="body2" color="text.secondary">
            No hierarchy data available.
          </Typography>
        </Stack>
      ) : null}
      {!isLoading && nodes.length > 0 ? (
        <Box
          sx={{
            p: 0,
            height: "100%",
            width: "100%",
            display: "flex",
            cursor: dragStart ? "grabbing" : "grab",
            outline: debugScroll ? "2px dashed #3b82f6" : "none"
          }}
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
          >
            <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
              {links.map((link, index) => {
                const sourceNode = nodes.find((node) => node.name === link.source);
                const targetNode = nodes.find((node) => node.name === link.target);
                if (!sourceNode || !targetNode) {
                  return null;
                }

                const stroke = targetNode.branchKey
                  ? branchColors[targetNode.branchKey]
                  : "#94a3b8";

                const isRootToLevel1 = sourceNode.kind === "root" && targetNode.kind === "level1";

                const sourceWidth = sourceNode.kind === "level2" ? level2NodeWidth : level1NodeWidth;
                const sourceHeight = sourceNode.kind === "level2" ? 72 : 96;
                const targetHeight = targetNode.kind === "level2" ? 72 : 96;

                const linkPath = path({
                  source: {
                    x: sourceNode.x + sourceHeight / 2,
                    y: sourceNode.y + sourceWidth
                  },
                  target: {
                    x: targetNode.x + targetHeight / 2,
                    y: targetNode.y
                  }
                });

                return (
                  <path
                    key={`link-${index}`}
                    d={linkPath || ""}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={1.6}
                    strokeDasharray={isRootToLevel1 ? "6 6" : "0"}
                  />
                );
              })}
              {nodes.map((node, index) => (
                <g key={`node-${index}`} transform={`translate(${node.y},${node.x})`}>
                  <foreignObject
                    x={-6}
                    y={node.kind === "level2" ? -14 : -20}
                    width={node.kind === "level2" ? level2NodeWidth : level1NodeWidth}
                    height={node.kind === "level2" ? 72 : 96}
                  >
                    <div
                      onClick={(event) => handleNodeClick(event, node)}
                      onMouseDown={(event) => handleNodeMouseDown(event, node)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: node.kind === "level2" ? "4px" : "6px",
                        padding: node.kind === "level2" ? "10px 12px" : "12px 14px",
                        borderRadius: node.kind === "level2" ? "8px" : "12px",
                        border: node.kind === "level2" ? "1px solid #cbd5e1" : "1px solid #e2e8f0",
                        boxShadow: "0 6px 14px rgba(15, 23, 42, 0.08)",
                        borderLeft:
                          node.kind === "level2"
                            ? "none"
                            : node.branchKey
                              ? `4px solid ${branchColors[node.branchKey]}`
                              : node.kind === "root"
                                ? "4px solid #1d4ed8"
                                : "4px solid #e2e8f0",
                        background: "#ffffff",
                        fontFamily: "sans-serif",
                        cursor: "pointer"
                      }}
                    >
                      {node.kind !== "level2" ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 700,
                              letterSpacing: "0.08em",
                              color: node.branchKey ? branchColors[node.branchKey] : "#94a3b8"
                            }}
                          >
                            {node.kind === "root"
                              ? "ROOT NODE"
                              : node.branchKey === "branch1"
                                ? "BRANCH 1"
                                : node.branchKey === "branch2"
                                  ? "BRANCH 2"
                                  : "BRANCH 3"}
                          </span>
                          {node.country ? (
                            <ReactCountryFlag
                              svg
                              countryCode={node.country}
                              style={{ width: "0.95em", height: "0.95em" }}
                            />
                          ) : null}
                        </div>
                      ) : null}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                        <span
                          style={{
                            fontSize: node.kind === "level2" ? "11px" : "14px",
                            fontWeight: 700,
                            maxWidth: node.kind === "level2" ? "80px" : "140px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: "#0f172a"
                          }}
                        >
                          {node.kind === "level1"
                            ? node.branchKey === "branch1"
                              ? "Same Company (US)"
                              : node.branchKey === "branch2"
                                ? "Domestic Partner"
                                : "Outside US"
                            : node.name}
                        </span>
                        {node.kind === "level2" && node.country ? (
                          <ReactCountryFlag
                            svg
                            countryCode={node.country}
                            style={{ width: "0.95em", height: "0.95em" }}
                          />
                        ) : null}
                      </div>
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                        {node.kind === "level1"
                          ? `${node.total.toLocaleString()} KG · ${node.count ?? 0} Plants`
                          : node.kind === "root"
                            ? `Total: ${node.total.toLocaleString()} KG`
                            : `${node.total.toLocaleString()} KG`}
                      </span>
                    </div>
                  </foreignObject>
                </g>
              ))}
            </g>
          </svg>
        </Box>
      ) : null}
    </Box>
  );
}
