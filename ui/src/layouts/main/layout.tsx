import type { ReactNode } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Stack,
  Toolbar,
  Typography
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

type MainLayoutProps = {
  children?: ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box minHeight="100vh" bgcolor="#f7f8fb">
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "#ffffff",
          color: "text.primary",
          borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
          py: 0
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            justifyContent: "space-between",
            gap: 3,
            minHeight: 38,
            px: { xs: 2, sm: 3 }
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: 2,
                background:
                  "linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #0f172a 100%)"
              }}
            />
            <Typography variant="h6" fontWeight={700} letterSpacing={0.5}>
              Boilerplate
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              size="small"
              sx={{ borderColor: "#e2e8f0", color: "#0f172a" }}
            >
              Configure
            </Button>
            <Button variant="contained" size="small">
              + New Project
            </Button>
            <Avatar sx={{ bgcolor: "#0ea5e9", width: 36, height: 36 }}>
              B
            </Avatar>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box component="main">{children}</Box>
    </Box>
  );
}
