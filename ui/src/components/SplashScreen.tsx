import { CircularProgress, Stack } from "@mui/material";

export function SplashScreen() {
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "60vh" }}>
      <CircularProgress />
    </Stack>
  );
}
