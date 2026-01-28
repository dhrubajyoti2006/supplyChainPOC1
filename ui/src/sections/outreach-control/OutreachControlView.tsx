import {
  Box,
  Button,
  Chip,
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

const readinessStats = [
  { label: "Ready to Contact", value: "842", caption: "+24 today" },
  { label: "Total Discoveries", value: "12,402", caption: "Lifetime accumulation" },
  { label: "Outreach Sent", value: "5,190", caption: "42% conversion rate" }
];

const contactEmployees = [
  {
    name: "Stellar Coffee Co.",
    location: "Austin, TX",
    entity: "Cafe & Bakery",
    tags: ["Prompt Verified", "LP Uploaded", "Verified Contact"]
  },
  {
    name: "Blue Harbor Logistics",
    location: "Brooklyn, NY",
    entity: "Transport",
    tags: ["Prompt Verified", "Verified Contact"]
  },
  {
    name: "Green Leaf Organics",
    location: "Palo Alto, CA",
    entity: "Retail",
    tags: ["Prompt Verified", "LP Uploaded", "Verified Contact"]
  },
  {
    name: "Peak Performance Gym",
    location: "Chicago, IL",
    entity: "Fitness",
    tags: ["LP Uploaded", "Verified Contact"]
  },
  {
    name: "The Vintage Vault",
    location: "Santa Monica, CA",
    entity: "Antiques",
    tags: ["Prompt Verified", "Verified Contact"]
  }
];

export function OutreachControlView() {
  return (
    <ContentLayout title="Final Outreach Control Center">
      <Stack spacing={4}>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            {readinessStats.map((stat) => (
              <Paper
                key={stat.label}
                elevation={0}
                sx={{
                  flex: 1,
                  borderRadius: 3,
                  border: "1px solid rgba(15, 23, 42, 0.08)",
                  px: 3,
                  py: 2
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {stat.label}
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.caption}
                </Typography>
              </Paper>
            ))}
            <Button
              variant="contained"
              component={RouterLink}
              to="/area-scan/new"
              sx={{ height: 56 }}
            >
              Start New Area Scan
            </Button>
          </Stack>

          <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid rgba(15, 23, 42, 0.08)" }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              alignItems="center"
              justifyContent="space-between"
              px={{ xs: 3, md: 4 }}
              py={3}
              spacing={2}
            >
              <Typography variant="h6" fontWeight={600}>
                Contact-Ready Businesses
              </Typography>
              <TextField size="small" placeholder="Search by name or category..." fullWidth sx={{ maxWidth: 320 }} />
            </Stack>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Business Entity</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Readiness Status</TableCell>
                  <TableCell>Available Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contactEmployees.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell>
                      <Typography fontWeight={600}>{item.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.entity}
                      </Typography>
                    </TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {item.tags.map((tag) => (
                          <Chip key={tag} label={tag} size="small" />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button variant="text" size="small">
                          ✉️
                        </Button>
                        <Button variant="text" size="small">
                          ✎
                        </Button>
                      </Stack>
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
                    "linear-gradient(135deg, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.2))"
                }}
              />
              <Stack
                sx={{ position: "absolute", inset: 0, p: 4 }}
                justifyContent="flex-end"
              >
                <Typography variant="h6" fontWeight={700} color="#fff">
                  Outreach Coverage
                </Typography>
                <Typography variant="body2" color="#e2e8f0">
                  Live visualization of ready business distribution.
                </Typography>
                <Button variant="contained" color="inherit" sx={{ mt: 1 }}>
                  Full Screen Map
                </Button>
              </Stack>
            </Box>
          </Paper>
      </Stack>
    </ContentLayout>
  );
}
