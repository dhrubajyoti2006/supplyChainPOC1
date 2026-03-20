import { Alert, Box, Button, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import { ContentLayout } from "../../layouts/main";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { ApiResponse } from "../../types/ApiResponse";
import type { PromptGenerationResult } from "../../types/prompt";

export function PromptEditorView() {
  const [searchParams] = useSearchParams();
  const placeId = searchParams.get("placeId") ?? undefined;
  const [promptResult, setPromptResult] = useState<PromptGenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisInput, setAnalysisInput] = useState(
    "Analyze the business opportunity for a local services marketplace in Austin, TX."
  );
  const [analysisOutput, setAnalysisOutput] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    if (placeId) {
      params.set("placeId", placeId);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setError(null);
    fetch(`/api/ai/prompt/home${params.toString() ? `?${params.toString()}` : ""}`, {
      signal: controller.signal
    })
      .then((response) => response.json())
      .then((payload: ApiResponse<PromptGenerationResult>) => {
        const hasSuccess = payload.messages?.some((message) => message.code === 1);
        if (!hasSuccess) {
          throw new Error(payload.messages?.[0]?.text || "Unable to generate prompt.");
        }
        setPromptResult(payload.data ?? null);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error("Failed to load AI prompt", err);
        setError(err instanceof Error ? err.message : "Unable to load AI prompt.");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });
    return () => controller.abort();
  }, [placeId]);

  const displayPrompt = promptResult?.prompt ?? "";
  const summary = promptResult?.summary ?? "Prompt summary will appear here once available.";

  const handleRunAnalysis = async () => {
    setAnalysisLoading(true);
    setAnalysisError(null);
    setAnalysisOutput(null);
    try {
      const response = await fetch("/api/analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ input: analysisInput })
      });
      const payload = (await response.json()) as ApiResponse<{ output: string; model: string }>;
      const hasSuccess = payload.messages?.some((message) => message.code === 1);
      if (!response.ok || !hasSuccess) {
        throw new Error(payload.messages?.[0]?.text || "Unable to run analysis.");
      }
      setAnalysisOutput(payload.data?.output ?? "");
    } catch (err) {
      console.error("Failed to run analysis", err);
      setAnalysisError(err instanceof Error ? err.message : "Unable to run analysis.");
    } finally {
      setAnalysisLoading(false);
    }
  };

  return (
    <ContentLayout title="AI Generation Prompt Editor">
      <Stack spacing={4}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="flex-start">
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              borderRadius: 3,
              border: "1px solid rgba(15, 23, 42, 0.08)",
              bgcolor: "#0f172a",
              color: "#f8fafc",
              fontFamily: "var(--pf-font-mono, 'Space Mono', 'Inter')",
              px: { xs: 3, md: 4 },
              py: { xs: 3, md: 4 },
              minHeight: 320
            }}
          >
            <Typography variant="body2" gutterBottom>
              MARKDOWN ENABLED
            </Typography>
            {isLoading && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  Generating prompt...
                </Typography>
              </Stack>
            )}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            {displayPrompt ? (
              <Box component="pre" sx={{ whiteSpace: "pre-wrap", fontSize: "0.9rem", mt: 2 }}>
                {displayPrompt}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                No AI prompt generated yet.
              </Typography>
            )}
          </Paper>
          <Paper
            elevation={0}
            sx={{
              width: 280,
              borderRadius: 3,
              border: "1px solid rgba(15, 23, 42, 0.08)",
              px: 3,
              py: 3
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Configuration Meta
            </Typography>
            <Typography variant="body2" fontWeight={600} mb={1}>
              Prompt Summary
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {summary}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" color="text.secondary">
              Efficiency Rating
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              94%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Prompt tokens optimized for token-to-output ratio. No violations detected.
            </Typography>
          </Paper>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Button variant="outlined">Discard Changes</Button>
          <Button variant="contained">Approve for Generation</Button>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid rgba(15, 23, 42, 0.08)",
            bgcolor: "#ffffff",
            px: { xs: 3, md: 4 },
            py: { xs: 3, md: 4 }
          }}
        >
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={600}>
              AI Analysis
            </Typography>
            <TextField
              label="Analysis Input"
              multiline
              minRows={4}
              value={analysisInput}
              onChange={(event) => setAnalysisInput(event.target.value)}
              placeholder="Describe what you want the AI to analyze."
              fullWidth
            />
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="contained"
                onClick={handleRunAnalysis}
                disabled={analysisLoading || !analysisInput.trim()}
              >
                {analysisLoading ? "Analyzing..." : "Run Analysis"}
              </Button>
              {analysisError && <Alert severity="error">{analysisError}</Alert>}
            </Stack>
            {analysisOutput && (
              <Box
                sx={{
                  borderRadius: 2,
                  bgcolor: "rgba(15, 23, 42, 0.04)",
                  px: 2.5,
                  py: 2,
                  whiteSpace: "pre-wrap",
                  fontSize: "0.95rem"
                }}
              >
                {analysisOutput}
              </Box>
            )}
          </Stack>
        </Paper>
      </Stack>
    </ContentLayout>
  );
}
