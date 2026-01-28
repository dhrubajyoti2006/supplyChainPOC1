import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { ContentLayout } from "../../layouts/main";

export function ArtifactManagementView() {
  return (
    <ContentLayout title="Website Artifact Management">
      <Stack spacing={4}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              borderRadius: 3,
              border: "1px solid rgba(15, 23, 42, 0.08)",
              px: 3,
              py: 3
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Upload Generation Result
            </Typography>
            <Box
              sx={{
                mt: 2,
                borderRadius: 3,
                border: "1px dashed rgba(15, 23, 42, 0.3)",
                py: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 1
              }}
            >
              <Typography variant="body1">Drag and drop artifact here</Typography>
              <Typography variant="caption" color="text.secondary">
                PNG, JPG, or PDF (max 50MB)
              </Typography>
              <Button variant="contained" size="small">
                Browse Files
              </Button>
            </Box>
            <Divider sx={{ my: 3 }} />
            <TextField
              label="Concept Description"
              multiline
              minRows={3}
              fullWidth
              placeholder="Explain the design logic and high-level concept..."
            />
            <TextField
              label="Business ID"
              fullWidth
              value="BC - 77291 - TX"
              sx={{ mt: 2 }}
            />
          </Paper>

          <Paper
            elevation={0}
            sx={{
              flex: 1,
              borderRadius: 3,
              border: "1px solid rgba(15, 23, 42, 0.08)",
              px: 3,
              py: 3
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Artifact High-Fidelity Preview
            </Typography>
            <Box
              sx={{
                height: 280,
                borderRadius: 2,
                overflow: "hidden",
                background:
                  "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60')",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            />
            <Typography variant="caption" color="text.secondary" mt={1}>
              artifact_v2_linked_concept.png · Dimensions: 1440 × 3200 px
            </Typography>
          </Paper>
        </Stack>

        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button variant="outlined" component={RouterLink} to="/area-scan/results">
            Back to Discovery Details
          </Button>
          <Button variant="contained">Mark as Ready for Outreach</Button>
        </Stack>
      </Stack>
    </ContentLayout>
  );
}
