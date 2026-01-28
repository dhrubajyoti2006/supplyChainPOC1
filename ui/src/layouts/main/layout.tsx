import type { ReactNode } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Typography
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
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
            minHeight: 58,
            px: { xs: 2, sm: 3 }
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                background:
                  "linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #0f172a 100%)"
              }}
            />
            <Stack spacing={0.25}>
              <Typography variant="h6" fontWeight={700} letterSpacing={0.5}>
                BizCraft Site
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Manage your business assets and automations
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={3}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body2" fontWeight={600} sx={{ cursor: "pointer" }}>
                Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Resources
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton size="small">
                <NotificationsNoneIcon fontSize="small" />
              </IconButton>
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
          </Stack>
        </Toolbar>
      </AppBar>

      <Box component="main">{children}</Box>
    </Box>
  );
}
