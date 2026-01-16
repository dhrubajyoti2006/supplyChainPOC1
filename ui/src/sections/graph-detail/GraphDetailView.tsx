import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Typography
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEmployee } from "../../hooks/useEmployee";

export function GraphDetailView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, error, isLoading } = useEmployee(id);

  return (
    <Container sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Box>
          <Button variant="text" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Typography variant="h4" sx={{ mt: 1 }}>
            Employee Details
          </Typography>
        </Box>

        {isLoading ? <CircularProgress /> : null}
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : null}

        {!isLoading && !error && data ? (
          <Stack spacing={2}>
            <Divider />
            <Typography variant="subtitle1">ID: {data.id}</Typography>
            <Typography variant="subtitle1">Name: {data.name}</Typography>
            <Typography variant="subtitle1">Role: {data.role}</Typography>
            <Typography variant="subtitle1">Department: {data.department}</Typography>
            <Typography variant="subtitle1">Location: {data.location}</Typography>
          </Stack>
        ) : null}
      </Stack>
    </Container>
  );
}
