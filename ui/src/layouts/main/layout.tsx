import { useState } from "react";
import type { ReactNode } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
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

type MainLayoutProps = {
  children: ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  return (
    <Box display="flex" minHeight="100vh" flexDirection="column">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            Supply Chain
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            color="inherit"
            aria-label="account"
            onClick={() => setIsAccountOpen(true)}
          >
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="main" flex={1} py={4}>
        <Container maxWidth="lg">{children}</Container>
      </Box>

      <Box component="footer" py={3} bgcolor="#f5f5f5">
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            © Supply Chain
          </Typography>
        </Container>
      </Box>

      <Drawer
        anchor="right"
        open={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
      >
        <Box sx={{ width: 280 }} role="presentation">
          <Box px={3} py={2}>
            <Typography variant="subtitle1">Account</Typography>
          </Box>
          <Divider />
          <List>
            <ListItem button>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Sign out" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
