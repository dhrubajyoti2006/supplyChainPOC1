import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      default: "#f7f8fb",
      paper: "#ffffff"
    }
  },
  typography: {
    fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
  }
});

export default theme;
