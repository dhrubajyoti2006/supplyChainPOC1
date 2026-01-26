import { Button, Container, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export function HomeView() {
  const navigate = useNavigate();

  return (
    <Container maxWidth={false} disableGutters sx={{ pt: 2, pb: 6 }}>
      <Stack spacing={3} alignItems="flex-start">
        <Typography variant="h4">Home</Typography>
        <Button variant="outlined" onClick={() => navigate("/materialflow")}>
          Material Flow
        </Button>
      </Stack>
    </Container>
  );
}
