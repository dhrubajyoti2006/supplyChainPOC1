import {
  Alert,
  Box,
  Container,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GridViewIcon from "@mui/icons-material/GridView";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMaterialFlows } from "../../hooks/useMaterialFlows";
import { MaterialFlowHierarchyView } from "./flow";
import { MaterialFlowTableView } from "./table";
import { useMainHeader } from "../../layouts/main";
import CloseIcon from "@mui/icons-material/Close";
import ReactCountryFlag from "react-country-flag";

export function MaterialFlowView() {
  const debugScroll = true;
  const navigate = useNavigate();
  const { data, error, isLoading } = useMaterialFlows();
  const [viewMode, setViewMode] = useState<"node-map" | "table">("node-map");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<{
    name: string;
    kind: "root" | "level1" | "level2";
    branchKey?: "branch1" | "branch2" | "branch3";
    total: number;
    count?: number;
    country?: string;
  } | null>(null);
  const { setHeader, resetHeader } = useMainHeader();

  const headerActions = useMemo(
    () => (
      <ToggleButtonGroup
        exclusive
        size="small"
        value={viewMode}
        onChange={(_, value) => value && setViewMode(value)}
      >
        <ToggleButton value="node-map" aria-label="node map">
          <AccountTreeIcon fontSize="small" />
          <Box component="span" sx={{ ml: 0.5 }}>
            Node Map
          </Box>
        </ToggleButton>
        <ToggleButton value="table" aria-label="table">
          <GridViewIcon fontSize="small" />
          <Box component="span" sx={{ ml: 0.5 }}>
            Table
          </Box>
        </ToggleButton>
      </ToggleButtonGroup>
    ),
    [viewMode]
  );

  useEffect(() => {
    setHeader({
      title: "Material Flow Visualization",
      left: (
        <IconButton aria-label="back" onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
      ),
      right: headerActions
    });

    return () => resetHeader();
  }, [headerActions, navigate, resetHeader, setHeader]);

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        pt: 0,
        pb: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        bgcolor: "#f8fafc",
        outline: debugScroll ? "2px solid #ef4444" : "none"
      }}
    >
      <Stack spacing={0} sx={{ height: "100%", outline: debugScroll ? "2px dashed #f59e0b" : "none" }}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <Stack direction="row" flex={1} minHeight={0} alignItems="stretch">
          <Stack flex={1} minWidth={0} position="relative">
            {viewMode === "table" ? (
              <MaterialFlowTableView data={data} />
            ) : (
              <MaterialFlowHierarchyView
                data={data}
                isLoading={isLoading}
                onNodeSelect={(node) => {
                  setSelectedNode(node);
                  setIsDetailsOpen(true);
                }}
              />
            )}
            {isDetailsOpen ? (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  height: "100%",
                  width: 320,
                  borderLeft: "1px solid",
                  borderColor: "divider",
                  bgcolor: "#f8fafc",
                  display: { xs: "none", lg: "flex" },
                  flexDirection: "column",
                  px: 2,
                  py: 2.5
                }}
              >
                <Box
                  sx={{
                    bgcolor: "white",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    px: 2,
                    py: 2,
                    mx: -2,
                    mt: -2
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle2" fontWeight={700}>
                      Plant Details
                    </Typography>
                    <IconButton size="small" aria-label="close" onClick={() => setIsDetailsOpen(false)}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "white",
                      border: "1px solid",
                      borderColor: "divider"
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1.5,
                        bgcolor: "#2563eb",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "0.8rem"
                      }}
                    >
                      {selectedNode?.name?.startsWith("US") ? "US01" : "—"}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: "0.85rem" }}>
                        {selectedNode?.name ?? "Select a node"}
                      </Typography>
                      {selectedNode?.kind !== "level1" ? (
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                          {selectedNode?.kind === "root" ? "Main Logistics Hub" : "Plant Node"}
                        </Typography>
                      ) : null}
                    </Box>
                    {selectedNode?.country ? (
                      <Box sx={{ ml: "auto" }}>
                        <ReactCountryFlag svg countryCode={selectedNode.country} style={{ width: "1.2em" }} />
                      </Box>
                    ) : null}
                  </Box>
                </Box>
                <Stack spacing={2} sx={{ mt: 2, overflow: "auto", flex: 1 }}>

                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ letterSpacing: "0.08em", fontSize: "0.65rem" }}
                    >
                      GENERAL INFORMATION
                    </Typography>
                    <Box
                      sx={{
                        mt: 1,
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "#f1f5f9"
                      }}
                    >
                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                            Country
                          </Typography>
                          <Typography variant="caption" fontWeight={600} sx={{ fontSize: "0.72rem" }}>
                            {selectedNode?.country ?? "—"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                            Company Code
                          </Typography>
                          <Typography variant="caption" fontWeight={600} sx={{ fontSize: "0.72rem" }}>
                            {selectedNode?.name?.startsWith("US") ? "US01" : "—"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                            Fiscal Year
                          </Typography>
                          <Typography variant="caption" fontWeight={600} sx={{ fontSize: "0.72rem" }}>
                            {data[0]?.fiscalYear ?? "—"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                            Base Unit
                          </Typography>
                          <Typography variant="caption" fontWeight={600} sx={{ fontSize: "0.72rem" }}>
                            Kilograms (KG)
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ letterSpacing: "0.08em", fontSize: "0.65rem" }}
                    >
                      MATERIAL FLOW METRICS
                    </Typography>
                    <Stack spacing={1} sx={{ mt: 1 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: "white",
                          border: "1px solid",
                          borderColor: "divider"
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                          Total Output Volume
                        </Typography>
                        <Typography sx={{ fontSize: "1rem", fontWeight: 700 }}>
                          {(selectedNode?.total ?? 0).toLocaleString()} KG
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: "white",
                          border: "1px solid",
                          borderColor: "divider"
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                          Active Logistics Lines
                        </Typography>
                        <Typography sx={{ fontSize: "1rem", fontWeight: 700 }}>{selectedNode?.count ?? 0}</Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
                <Box
                  sx={{
                    mt: 2,
                    px: 2,
                    py: 2,
                    mx: -2,
                    bgcolor: "white",
                    borderTop: "1px solid",
                    borderColor: "divider"
                  }}
                />
              </Box>
            ) : null}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
