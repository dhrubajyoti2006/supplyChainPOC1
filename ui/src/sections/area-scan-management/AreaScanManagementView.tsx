import {
  AutoGraphOutlined,
  BoltOutlined,
  BusinessCenterOutlined,
  CheckCircleOutlined,
  SearchOutlined
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { ContentLayout } from "../../layouts/main";
import { MetricTile } from "./MetricTile";

const metrics = [
  {
    label: "Total scans executed",
    value: "1,284",
    trend: "+12.4% vs last month",
    accentColor: "#10b981",
    icon: <AutoGraphOutlined fontSize="small" color="primary" />
  },
  {
    label: "Total businesses found",
    value: "42,905",
    trend: "+8.2% vs last month",
    accentColor: "#0ea5e9",
    icon: <BusinessCenterOutlined fontSize="small" color="primary" />
  },
  {
    label: "Active operations",
    value: "14",
    trend: "Currently processing discovery…",
    accentColor: "#f97316",
    icon: <BoltOutlined fontSize="small" color="primary" />
  },
  {
    label: "Operational success rate",
    value: "99.2%",
    trend: "API uptime: 100%",
    accentColor: "#22c55e",
    icon: <CheckCircleOutlined fontSize="small" color="primary" />
  }
];

const historicalScans = [
  {
    location: "Downtown Austin, TX",
    radius: "5.00 km",
    date: "Oct 24, 2023",
    records: "42",
    status: "Completed",
    statusColor: "#10b981"
  },
  {
    location: "Brooklyn Heights, NY",
    radius: "2.50 km",
    date: "Oct 25, 2023",
    records: "18",
    status: "In Progress",
    statusColor: "#f97316"
  },
  {
    location: "Palo Alto, CA",
    radius: "10.00 km",
    date: "Oct 26, 2023",
    records: "—",
    status: "Scheduled",
    statusColor: "#6366f1"
  },
  {
    location: "Santa Monica, CA",
    radius: "1.00 km",
    date: "Oct 23, 2023",
    records: "156",
    status: "Completed",
    statusColor: "#10b981"
  },
  {
    location: "The Loop, Chicago",
    radius: "3.00 km",
    date: "Oct 22, 2023",
    records: "89",
    status: "Completed",
    statusColor: "#10b981"
  }
];

export function AreaScanManagementView() {
  return (
    <ContentLayout
      title="Area Scan Management"
      subtitle="Monitor and orchestrate automated business discovery processes across global geographic sectors."
      actions={
        <Button
          variant="contained"
          size="medium"
          component={RouterLink}
          to="/area-scan/new"
        >
          Initiate New Area Scan
        </Button>
      }
    >
      <Stack spacing={4}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          flexWrap="wrap"
        >
          {metrics.map((metric) => (
            <MetricTile key={metric.label} {...metric} />
          ))}
        </Stack>

        <Stack spacing={3}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid rgba(15, 23, 42, 0.08)",
              bgcolor: "#ffffff",
              boxShadow: "0 1px 2px rgba(15,23,42,.05)"
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems="center"
              justifyContent="space-between"
              px={{ xs: 3, sm: 4 }}
              py={{ xs: 3, sm: 4 }}
              spacing={2}
            >
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Historical Scan Log
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Displaying 5 of 1,284 total operations
                </Typography>
              </Box>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search by area or location..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlined fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
            </Stack>

            <Divider />

            <Table sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Target Location</TableCell>
                  <TableCell>Search Radius</TableCell>
                  <TableCell>Execution Date</TableCell>
                  <TableCell>Record Count</TableCell>
                  <TableCell>Operation Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historicalScans.map((log) => (
                  <TableRow key={log.location}>
                    <TableCell>{log.location}</TableCell>
                    <TableCell>{log.radius}</TableCell>
                    <TableCell>{log.date}</TableCell>
                    <TableCell>
                      <Box
                        component="span"
                        px={1.2}
                        py={0.3}
                        borderRadius={2}
                        bgcolor="rgba(59, 130, 246, 0.12)"
                        color="#2563eb"
                        fontWeight={600}
                        fontSize="0.875rem"
                      >
                        {log.records}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        component="span"
                        px={1.3}
                        py={0.35}
                        borderRadius={2}
                        sx={{
                          bgcolor: `${log.statusColor}1a`,
                          color: log.statusColor
                        }}
                        fontWeight={600}
                        fontSize="0.875rem"
                      >
                        {log.status}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography color="text.secondary">•••</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid rgba(15, 23, 42, 0.08)",
              overflow: "hidden"
            }}
          >
            <Box
              sx={{
                position: "relative",
                height: 220,
                background:
                  "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=60')",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.2))"
                }}
              />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-end"
                sx={{ position: "absolute", inset: 0, p: { xs: 3, sm: 4 } }}
              >
                <Box>
                  <Typography variant="h5" fontWeight={700} color="#ffffff">
                    Global Operational Density
                  </Typography>
                  <Typography variant="body2" color="#e2e8f0">
                    Real-time visualization of business discovery distribution across
                    global strategic markets.
                  </Typography>
                </Box>
                <Button variant="contained" color="secondary">
                  Expand Interactive Map
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Stack>
      </Stack>
    </ContentLayout>
  );
}
