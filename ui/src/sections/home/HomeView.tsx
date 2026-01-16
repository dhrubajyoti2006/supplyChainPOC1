import { Button, Container, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export function HomeView() {
  const navigate = useNavigate();

  return (
    <Container sx={{ py: 6 }}>
      <Stack spacing={3} alignItems="flex-start">
        <Typography variant="h4">Home</Typography>
        <Button variant="contained" onClick={() => navigate("/graph")}>
          Go to Graph
        </Button>
      </Stack>
    </Container>
  );
}
