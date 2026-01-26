import type { ReactNode } from "react";
import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import { BaseLayout } from "./base-layout";

type ContentLayoutProps = {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function ContentLayout({
  title,
  subtitle,
  actions,
  children
}: ContentLayoutProps) {
  return (
    <BaseLayout>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid rgba(15, 23, 42, 0.08)",
          bgcolor: "#ffffff",
          boxShadow: "0 1px 2px rgba(15,23,42,.08)"
        }}
      >
        {(title || subtitle || actions) && (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={1}
            px={{ xs: 3, sm: 4 }}
            py={3}
          >
            <Box>
              {title && (
                <Typography variant="h6" fontWeight={600}>
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>

            {actions && <Box>{actions}</Box>}
          </Stack>
        )}

        {title || subtitle ? <Divider /> : null}

        <Box px={{ xs: 3, sm: 4 }} py={4}>
          {children}
        </Box>
      </Paper>
    </BaseLayout>
  );
}
