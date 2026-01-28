import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { ContentLayout } from "../../layouts/main";

const promptLines = [
  "# PROJECT_ID: AUSTIN_METRO_001",
  "# STATUS: DRAFT_REVIEW",
  "[SECTION: BRAND VOICE & TONE]",
  "- Professional yet approachable; maintain a high-energy \"Modern Texan\" persona.",
  "- Focus on authenticity and community growth.",
  "- Avoid hyperbole; use precise, action-oriented verbs.",
  "- Tone: Welcoming, Authoritative, Innovative.",
  "[SECTION: CORE DEMOGRAPHIC]",
  "- Primary: Entrepreneurs and micro-business owners (78701, 78702, 78704).",
  "- Secondary: Remote professionals and civic-minded residents.",
  "- Psychographics: Values local sustainability, tech-forward solutions.",
  "- Age Bracket: 24-55 years.",
  "[SECTION: DESIGN OBJECTIVES]",
  "- Visual Hierarchy: Emphasis on \"Core Services\" through high-contrast spacing.",
  "- Color Palette: Utility-first, leveraging #BF5700 as action trigger.",
  "- Layout: Clean grid structures for business directories, fluid masonry.",
  "- Accessibility: Ensure WCAG 2.1 AA compliance for generated elements.",
  "[SECTION: FUNCTIONAL CONSTRAINTS]",
  "- Data Ingestion: Filter for metadata tags (LOCAL, BOUTIQUE, HIGH_TRAFFIC).",
  "- Delivery Format: Provide Markdown + JSON schema + optimized assets."
];

export function PromptEditorView() {
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
            <Box component="pre" sx={{ whiteSpace: "pre-wrap", fontSize: "0.9rem" }}>
              {promptLines.map((line) => `${line}\n`).join("")}
            </Box>
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
            <Typography variant="subtitle2" color="text.secondary">
              Configuration Meta
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              Target Cluster: Central Business District – Austin
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Compute Engine: GPT-4o / High Precision
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
      </Stack>
    </ContentLayout>
  );
}
