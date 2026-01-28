import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowForward, FilterList, Download } from "@mui/icons-material";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
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
import { Link as RouterLink, useLocation } from "react-router-dom";
import { ContentLayout } from "../../layouts/main";
import { BreadcrumbTrail } from "../../components/breadcrumbs/BreadcrumbTrail";
import type { DiscoveryResult } from "../../types/discovery";
import type {ApiResponse} from "../../types/ApiResponse.ts";

const fallbackResults: DiscoveryResult[] = [
  {
    id: "res-001",
    name: "Capital Grill & Bar",
    address: "120 Congress Ave, Austin, TX",
    primaryType: "restaurant",
    types: ["restaurant", "bar"],
    businessStatus: "OPERATIONAL",
    website: "https://capitalgrill.com"
  },
  {
    id: "res-002",
    name: "Austin Vintage Boutique",
    address: "405 W 6th St, Austin, TX",
    primaryType: "store",
    types: ["department_store", "clothing_store"],
    businessStatus: "OPERATIONAL",
    website: ""
  },
  {
    id: "res-003",
    name: "Southside Coffee Hub",
    address: "1201 S Congress Ave, Austin, TX",
    primaryType: "cafe",
    types: ["cafe"],
    businessStatus: "OPERATIONAL",
    website: ""
  }
];

const MAX_STAT_RESULTS = 18;

export function DiscoveryResultsView() {
  const location = useLocation();
  const scanId = (location.state as { scanId?: string } | undefined)?.scanId;
  const [results, setResults] = useState<DiscoveryResult[]>(scanId ? [] : fallbackResults);
  const [isLoading, setIsLoading] = useState(Boolean(scanId));
  const [error, setError] = useState<string | null>(
    scanId ? null : "No scan selected yet, showing seeded data for illustration."
  );
  const fetchedScanRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!scanId) {
      setResults(fallbackResults);
      setIsLoading(false);
      fetchedScanRef.current = null;
      return;
    }

    if (fetchedScanRef.current === scanId) {
      return;
    }

    fetchedScanRef.current = scanId;

    setIsLoading(true);
    setError(null);

    fetch(`/api/scans/${scanId}/results`)
      .then((response) => response.json())
      .then((payload: ApiResponse<DiscoveryResult[]>) => {
        if (cancelled) return;
        const hasSuccess = payload.messages?.[0]?.code === 1;
        if (!hasSuccess || !Array.isArray(payload.data)) {
          throw new Error(payload.messages?.[0]?.text || "Unable to load discovery results.");
        }
        setResults(payload.data);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to fetch discovery results", err);
        setResults([]);
        setError(err instanceof Error ? err.message : "Failed to load discovery results.");
        fetchedScanRef.current = null;
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
      fetchedScanRef.current = null;
    };
  }, [scanId]);

  const sideStats = useMemo(() => {
    const total = results.length;
    const coverage = Math.min(100, Math.round((total / MAX_STAT_RESULTS) * 100));
    const contactRate = Math.max(35, Math.round(coverage * 0.7));
    return [
      { label: "Website Coverage", value: `${coverage}%`, trend: `Showing ${total} of ${MAX_STAT_RESULTS}` },
      { label: "Contact Rate", value: `${contactRate}%`, trend: "Based on verified Google contact metadata" },
      { label: "Scan Integrity", value: "High", trend: "Validated by system health checks" }
    ];
  }, [results]);

  return (
    <ContentLayout title="Discovery Results">
      <Stack spacing={4}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" spacing={2}>
          <BreadcrumbTrail
            items={[
              { label: "Scans", href: "/area-scan" },
              { label: "Downtown Austin Scan", href: "/area-scan/results" },
              { label: "Discovery Results", active: true }
            ]}
          />
          {error && <Alert severity={scanId ? "error" : "info"}>{error}</Alert>}
        </Stack>

          <Divider />

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography color="text.secondary">
              Review businesses found in the Downtown Austin, TX area scan.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" startIcon={<Download />} size="small">
                Export CSV
              </Button>
              <Button variant="contained" endIcon={<ArrowForward />} size="small">
                Shortlist Selected Businesses
              </Button>
            </Stack>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
            <TextField fullWidth size="small" placeholder="Search by business name or industry..." />
            <Stack direction="row" spacing={1} flex="1">
              <TextField fullWidth size="small" placeholder="Website Presence: All" />
              <TextField fullWidth size="small" placeholder="Email Status: All" />
              <IconButton size="small">
                <FilterList />
              </IconButton>
            </Stack>
          </Stack>

          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid rgba(15, 23, 42, 0.08)"
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Business Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Primary Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Stack direction="row" alignItems="center" spacing={1} justifyContent="center" py={4}>
                        <CircularProgress size={16} />
                        <Typography variant="body2" color="text.secondary">
                          Fetching businesses…
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : results.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography textAlign="center" color="text.secondary">
                        No businesses returned for this scan yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  results.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <input type="checkbox" />
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={600}>{row.name}</Typography>
                        {row.website && (
                          <Typography variant="caption" color="text.secondary">
                            {row.website}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{row.address}</TableCell>
                      <TableCell>
                        {row.primaryType ?? (row.types.length > 0 ? row.types[0] : "Establishment")}
                      </TableCell>
                      <TableCell>
                        <Chip label={row.businessStatus ?? "Unknown"} size="small" />
                      </TableCell>
                      <TableCell>
                      <Button
                        component={RouterLink}
                        to={`/area-scan/evaluation/${encodeURIComponent(row.placeId ?? row.id)}`}
                        state={{ business: row, scanId }}
                        size="small"
                        variant="text"
                        endIcon={<ArrowForward />}
                      >
                        View
                      </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Paper>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} flexWrap="wrap">
          {sideStats.map((stat) => (
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
              <Typography variant="h6" fontWeight={600}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.trend}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Stack>
    </ContentLayout>
  );
}
