import {
  Alert,
  CircularProgress,
  Divider,
  Stack,
  Typography
} from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useEmployee } from "../../hooks/useEmployee";
import { ContentLayout } from "../../layouts/main";

export function GraphDetailView() {
  const { id } = useParams();
  const { data, error, isLoading } = useEmployee(id);

  return (
    <ContentLayout
      title="Employee Details"
      subtitle={`ID: ${id ?? "—"}`}
      actions={
        <Typography
          component={RouterLink}
          to="/graph"
          variant="button"
          sx={{ textTransform: "none", fontSize: "0.875rem", color: "inherit" }}
        >
          Back
        </Typography>
      }
    >
      <Stack spacing={2}>
        {isLoading ? <CircularProgress /> : null}
        {error ? <Alert severity="error">{error}</Alert> : null}
        {!isLoading && !error && data ? (
          <>
            <Divider />
            <Typography variant="subtitle1">ID: {data.id}</Typography>
            <Typography variant="subtitle1">Name: {data.name}</Typography>
            <Typography variant="subtitle1">Role: {data.role}</Typography>
            <Typography variant="subtitle1">Department: {data.department}</Typography>
            <Typography variant="subtitle1">Location: {data.location}</Typography>
          </>
        ) : null}
      </Stack>
    </ContentLayout>
  );
}
