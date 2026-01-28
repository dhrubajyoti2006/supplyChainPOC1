import { Alert, Link } from "@mui/material";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { useEmployees } from "../../hooks/useEmployees";
import type { Employee } from "../../types/Employee";
import { Link as RouterLink } from "react-router-dom";
import { ContentLayout } from "../../layouts/main";

export function GraphView() {
  const { data, error, isLoading } = useEmployees();
  const columns = useMemo<MRT_ColumnDef<Employee>[]>(
    () => [
      { accessorKey: "id", header: "ID" },
      {
        accessorKey: "name",
        header: "Name",
        Cell: ({ row }) => (
          <Link component={RouterLink} to={`/graph/${row.original.id}`}>
            {row.original.name}
          </Link>
        )
      },
      { accessorKey: "role", header: "Role" },
      { accessorKey: "department", header: "Department" },
      { accessorKey: "location", header: "Location" }
    ],
    []
  );

  return (
    <ContentLayout
      title="Graph"
      subtitle="Browse all employees and click a name for details."
    >
      {error ? (
        <Alert sx={{ mb: 3 }} severity="error">
          {error}
        </Alert>
      ) : null}
      <MaterialReactTable
        columns={columns}
        data={data}
        state={{ isLoading }}
        enableDensityToggle={false}
        enableFullScreenToggle={false}
        enableHiding={false}
        muiTableContainerProps={{ sx: { mt: 1 } }}
      />
    </ContentLayout>
  );
}
