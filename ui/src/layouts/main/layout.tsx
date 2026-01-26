import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
  AppBar,
  Box,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography
} from "@mui/material";
import { HeaderProvider, defaultHeader } from "./header-context";

type MainLayoutProps = {
  children: ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [header, setHeader] = useState(defaultHeader);

  const headerValue = useMemo(
    () => ({
      header,
      setHeader,
      resetHeader: () => setHeader(defaultHeader)
    }),
    [header]
  );

  return (
    <Box display="flex" minHeight="100vh" flexDirection="column">
      <HeaderProvider value={headerValue}>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{ bgcolor: "white", color: "text.primary", borderBottom: "1px solid", borderColor: "divider" }}
        >
          <Toolbar sx={{ minHeight: 64, gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {header.left}
              <Typography variant="subtitle1" component="div" sx={{ fontWeight: 700 }}>
                {header.title}
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {header.right}
              <IconButton
                aria-label="account"
                onClick={() => setIsAccountOpen(true)}
                sx={{ bgcolor: "#f1f5f9", borderRadius: 2 }}
              >
                <AccountCircleIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          flex={1}
          py={0}
          sx={{ mt: "64px", height: "calc(100vh - 64px)", overflow: "hidden" }}
        >
          <Container maxWidth={false} disableGutters sx={{ px: 0 }}>
            {children}
          </Container>
        </Box>
      </HeaderProvider>

      <Drawer
        anchor="right"
        open={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
      >
        <Box sx={{ width: 320 }} role="presentation">
          <Box px={3} py={2}>
            <Typography variant="subtitle1" fontWeight={700}>
              Account
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Supply Chain Ops
            </Typography>
          </Box>
          <Divider />
          <Box px={3} py={2}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: "#f8fafc"
              }}
            >
              <AccountCircleIcon fontSize="large" />
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  Logistics Admin
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  admin@supplychain.local
                </Typography>
              </Box>
            </Box>
          </Box>
          <List>
            <ListItem button>
              <PersonOutlineIcon fontSize="small" />
              <ListItemText primary="Profile" sx={{ ml: 1 }} />
            </ListItem>
            <ListItem button>
              <SettingsOutlinedIcon fontSize="small" />
              <ListItemText primary="Settings" sx={{ ml: 1 }} />
            </ListItem>
            <Divider sx={{ my: 1 }} />
            <ListItem button>
              <LogoutIcon fontSize="small" />
              <ListItemText primary="Sign out" sx={{ ml: 1 }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
