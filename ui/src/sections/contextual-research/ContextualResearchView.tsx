import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import { BarChartOutlined } from "@mui/icons-material";
import { ContentLayout } from "../../layouts/main";
import type { ApiResponse } from "../../types/ApiResponse";
import type { DiscoveryResult } from "../../types/discovery";
import { Link as RouterLink, useLocation, useParams } from "react-router-dom";
import type { ContextualAnalysis } from "../../types/contextualResearch";

type ContextualState = {
  business?: DiscoveryResult;
};

export function ContextualResearchView() {
  const { placeId: routePlaceId } = useParams<{ placeId?: string }>();
  const location = useLocation();
  const state = (location.state as ContextualState | undefined) ?? {};
  const business = state.business;

  const [analysis, setAnalysis] = useState<ContextualAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const effectivePlaceId = routePlaceId ?? business?.placeId;

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    if (effectivePlaceId) {
      params.set("placeId", effectivePlaceId);
    }
    setIsLoading(true);
    setError(null);
    fetch(
      `/api/contextual-research/analysis${params.toString() ? `?${params.toString()}` : ""}`,
      { signal: controller.signal }
    )
      .then((response) => response.json())
      .then((payload: ApiResponse<ContextualAnalysis>) => {
        if (!payload.messages?.[0] || payload.messages[0].code !== 1) {
          throw new Error(payload.messages?.[0]?.text || "Unable to load contextual analysis.");
        }
        setAnalysis(payload.data);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error("Failed to load contextual analysis", err);
        setError(err instanceof Error ? err.message : "Unable to load contextual analysis.");
        setAnalysis(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });
    return () => controller.abort();
  }, [effectivePlaceId]);

  const displayedEntity = analysis?.entityName ?? business?.name ?? "Unknown Entity";
  const contextAggregation = analysis?.contextAggregation ?? 0;

  const modules = analysis?.modules ?? [];
  const aiPromptPath = `/ai-prompt${effectivePlaceId ? `?placeId=${encodeURIComponent(effectivePlaceId)}` : ""}`;

  return (
    <ContentLayout title="Contextual Research Builder" subtitle={`Entity: ${displayedEntity}`}>
      <Stack spacing={4}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            spacing={2}
          >
            <Typography color="text.secondary">
              Target Entity: {displayedEntity} · Context aggregation: {contextAggregation}%
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" size="small">
                Sync Status: Live Context Stream
              </Button>
              <Button
                variant="contained"
                size="small"
                component={RouterLink}
                to={aiPromptPath}
                disabled={!effectivePlaceId}
              >
                Open AI Prompt Builder
              </Button>
            </Stack>
          </Stack>

          {error && <Alert severity="error">{error}</Alert>}

          {isLoading ? (
            <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
              <CircularProgress size={16} />
              <Typography variant="body2" color="text.secondary">
                Loading contextual analysis…
              </Typography>
            </Stack>
          ) : (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              {modules.map((module) => (
                <Paper
                  key={module.title}
                  elevation={0}
                  sx={{
                    flex: 1,
                    borderRadius: 3,
                    border: "1px solid rgba(15, 23, 42, 0.08)",
                    px: 3,
                    py: 2
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <BarChartOutlined fontSize="small" />
                    <Typography variant="subtitle2" color="text.secondary">
                      {module.stat}
                    </Typography>
                  </Stack>
                  <Typography variant="h6" fontWeight={600}>
                    {module.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {module.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" mt={1} display="block">
                    {module.detail}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          )}

          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid rgba(15, 23, 42, 0.08)",
              overflow: "hidden"
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              alignItems="center"
              justifyContent="space-between"
              px={{ xs: 3, md: 4 }}
              py={2}
              spacing={2}
            >
              <Typography variant="h6" fontWeight={600}>
                Spatial Density Visualizer
              </Typography>
              <Button variant="contained" size="small">
                Launch Density Map
              </Button>
            </Stack>
            <Divider />
            <Box
              sx={{
                position: "relative",
                height: 200,
                background: "linear-gradient(135deg, #f97316, #facc15)",
                px: 4,
                py: 4
              }}
            >
              <Stack direction="row" alignItems="flex-end" justifyContent="space-between" height="100%">
                <Box>
                  <Typography variant="h5" fontWeight={700} color="#05182a">
                    Spatial Density Visualizer
                  </Typography>
                  <Typography variant="body2" color="#0f172a">
                    Active heatmapping of competitive clusters and behavioral density.
                  </Typography>
                </Box>
                <Button variant="contained" color="inherit">
                  Launch Full Map
                </Button>
              </Stack>
            </Box>
          </Paper>
      </Stack>
    </ContentLayout>
  );
}
