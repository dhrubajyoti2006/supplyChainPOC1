import type { ReactNode } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";

type MetricTileProps = {
  label: string;
  value: string;
  trend: string;
  accentColor?: string;
  icon?: ReactNode;
};

export function MetricTile({
  label,
  value,
  trend,
  accentColor = "#10b981",
  icon
}: MetricTileProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        borderRadius: 3,
        border: "1px solid rgba(15, 23, 42, 0.08)",
        bgcolor: "#ffffff",
        px: { xs: 3, sm: 4 },
        py: { xs: 3, sm: 4 },
        minWidth: 180,
        boxShadow: "0 1px 2px rgba(15,23,42,.07)"
      }}
    >
      <Stack spacing={1.5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            {label.toUpperCase()}
          </Typography>
          {icon}
        </Stack>
        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: accentColor
            }}
          />
          <Typography variant="body2" color="text.secondary">
            {trend}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
