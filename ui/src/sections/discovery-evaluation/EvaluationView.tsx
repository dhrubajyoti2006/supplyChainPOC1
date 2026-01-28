import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { Link as RouterLink, useLocation, useParams } from "react-router-dom";
import { ContentLayout } from "../../layouts/main";
import { BreadcrumbTrail } from "../../components/breadcrumbs/BreadcrumbTrail";
import type { DiscoveryPlaceDetails, DiscoveryResult } from "../../types/discovery";
import type { ApiResponse } from "../../types/ApiResponse";

const fallbackBusiness: DiscoveryResult = {
  id: "res-001",
  name: "Artisanal Roast & Bakery",
  address: "1611 E 6th St, Austin, TX 78702",
  primaryType: "Coffee Shop",
  types: ["coffee_shop", "bakery"],
  businessStatus: "OPERATIONAL",
  website: "https://roastbakery.example.com"
};

type EvaluationLocationState = {
  business?: DiscoveryResult;
  scanId?: string;
};

const contactFieldTemplates = [
  { label: "Email Address", positive: "Identified", fallback: "Pending" },
  { label: "Phone Number", positive: "Verified", fallback: "Pending" },
  { label: "Social Channels", positive: "Partial Data", fallback: "Missing" }
];

export function EvaluationView() {
  const location = useLocation();
  const { placeId: routePlaceId } = useParams<{ placeId?: string }>();
  const state = location.state as EvaluationLocationState | undefined;
  const baseBusiness = state?.business ?? fallbackBusiness;
  const effectivePlaceId = routePlaceId ?? baseBusiness.placeId;
  const business: DiscoveryResult = {
    ...baseBusiness,
    placeId: effectivePlaceId ?? baseBusiness.placeId
  };

  const [placeDetails, setPlaceDetails] = useState<DiscoveryPlaceDetails | null>(null);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    if (!business.placeId) {
      setPlaceDetails(null);
      setDetailsError(null);
      return;
    }

    let cancelled = false;
    setDetailsLoading(true);
    setDetailsError(null);

    fetch(`/api/scans/place/${encodeURIComponent(business.placeId)}/details`)
      .then((response) => response.json())
      .then((payload: ApiResponse<DiscoveryPlaceDetails>) => {
        if (cancelled) return;
        const hasSuccess = payload.messages?.[0]?.code === 1;
        if (!hasSuccess) {
          throw new Error(payload.messages?.[0]?.text || "Unable to load place details.");
        }
        setPlaceDetails(payload.data);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to fetch place details", err);
        setDetailsError(err instanceof Error ? err.message : "Failed to load place details.");
        setPlaceDetails(null);
      })
      .finally(() => {
        if (!cancelled) {
          setDetailsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [business.placeId]);

  const contactFields = useMemo(
    () =>
      contactFieldTemplates.map((field) => {
        const hasWebsite = Boolean(placeDetails?.website || business.website);
        const hasEmail = Boolean(placeDetails?.email);
        const hasPhone = Boolean(placeDetails?.phoneNumber);
        let status = field.fallback;
        if (field.label === "Email Address" && hasEmail) {
          status = field.positive;
        } else if (field.label === "Phone Number" && hasPhone) {
          status = field.positive;
        } else if (field.label === "Social Channels" && hasWebsite) {
          status = field.positive;
        }
        const color = status === field.positive ? "#10b981" : "#f97316";
        return { ...field, status, color };
      }),
    [business.website, placeDetails]
  );

  const typeTags = (business.types ?? []).filter(Boolean).slice(0, 3);
  const displayedName = placeDetails?.name ?? business.name;
  const displayedWebsite = placeDetails?.website ?? business.website;

  return (
    <ContentLayout title="Business Evaluation Summary" subtitle={`Scan: ${state?.scanId ?? "N/A"}`}>
      <Stack spacing={4}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <BreadcrumbTrail
            items={[
              { label: "Scans", href: "/area-scan" },
              { label: "Discovery Results", href: "/area-scan/results" },
              { label: "Evaluation", active: true }
            ]}
          />
          <Stack direction="row" spacing={1}>
            <Button variant="text" size="small" component={RouterLink} to="/area-scan/results">
              Back to Results
            </Button>
            <Button variant="contained" size="small" component={RouterLink} to="/area-scan/new">
              Start New Area Scan
            </Button>
            <Button
              variant="outlined"
              size="small"
              component={RouterLink}
              to={business.placeId ? `/contextual-research/${business.placeId}` : "/contextual-research"}
              state={{ business, scanId: state?.scanId }}
            >
              Open Contextual Research
            </Button>
          </Stack>
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
          <Stack spacing={3} flex={1}>
            <Typography variant="overline" fontWeight={600} color="primary">
              Internal SKU: {business.id}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {displayedName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {business.address ?? "Address pending verification"}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Business Category: {business.primaryType ?? typeTags[0] ?? "Unknown"}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {typeTags.map((tag) => (
                <Chip key={tag} label={tag.replace(/_/g, " ")} size="small" />
              ))}
            </Stack>

            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid rgba(15,23,42,0.08)",
                px: 3,
                py: 2
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Primary Digital Presence
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {displayedWebsite ?? "No verified website"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {displayedWebsite ? "Verified corporate website" : "Needs verification"}
              </Typography>
              <Stack direction="row" spacing={2} mt={2}>
                <Button variant="outlined" size="small">
                  Social Media Profile
                </Button>
                <Button variant="outlined" size="small">
                  Geographic Location Data
                </Button>
              </Stack>

              {business.address && (
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    border: "1px dashed rgba(15,23,42,0.2)",
                    mt: 3,
                    px: 3,
                    py: 2
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Verified Address
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {business.address}
                  </Typography>
                  <Button
                    component="a"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      business.address
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    variant="text"
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    View in Google Maps
                  </Button>
                </Paper>
              )}

              {(detailsLoading || placeDetails || detailsError) && (
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    border: "1px dashed rgba(15,23,42,0.2)",
                    mt: 3,
                    px: 3,
                    py: 2
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Detailed Place Info
                  </Typography>
                  {detailsLoading ? (
                    <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                      <CircularProgress size={14} />
                      <Typography variant="body2" color="text.secondary">
                        Loading place details…
                      </Typography>
                    </Stack>
                  ) : detailsError ? (
                    <Typography variant="body2" color="error" mt={1}>
                      {detailsError}
                    </Typography>
                  ) : placeDetails ? (
                    <List dense>
                      {placeDetails.website && (
                        <ListItem disableGutters>
                          <ListItemText primary="Website" secondary={placeDetails.website} />
                        </ListItem>
                      )}
                      {placeDetails.email && (
                        <ListItem disableGutters>
                          <ListItemText primary="Email" secondary={placeDetails.email} />
                        </ListItem>
                      )}
                      {placeDetails.phoneNumber && (
                        <ListItem disableGutters>
                          <ListItemText primary="Phone" secondary={placeDetails.phoneNumber} />
                        </ListItem>
                      )}
                      {placeDetails.openingHours?.length && (
                        <ListItem disableGutters>
                          <ListItemText
                            primary="Opening Hours"
                            secondary={placeDetails.openingHours.join(" · ")}
                          />
                        </ListItem>
                      )}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      Place details unavailable for this result.
                    </Typography>
                  )}
                </Paper>
              )}
            </Paper>

            <Stack direction="row" spacing={3}>
              <Box flex={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  Registered Physical Address
                </Typography>
                <Typography variant="body1">{business.address}</Typography>
              </Box>
              <Box flex={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  Algorithmic Confidence Score
                </Typography>
                <Box
                  sx={{
                    height: 8,
                    borderRadius: 999,
                    bgcolor: "#e5f3ff",
                    mt: 1
                  }}
                >
                  <Box
                    sx={{
                      width: "94%",
                      height: "100%",
                      borderRadius: "inherit",
                      bgcolor: "#10b981"
                    }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  94%
                </Typography>
              </Box>
            </Stack>

            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid rgba(15,23,42,0.08)",
                overflow: "hidden"
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  height: 200,
                  background:
                    "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=60')",
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
                  sx={{ position: "absolute", inset: 0 }}
                  justifyContent="flex-end"
                  px={3}
                  py={2}
                >
                  <Typography variant="h6" fontWeight={600} color="#fff">
                    Regional Scan Metadata
                  </Typography>
                  <Typography variant="body2" color="#e2e8f0">
                    Austin Metro Coverage · Data Cluster: Austin-TX-B4
                  </Typography>
                </Stack>
              </Box>
            </Paper>
          </Stack>

          <Stack spacing={3} flexBasis={{ xs: "100%", md: 320 }} flexShrink={0}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid rgba(15,23,42,0.08)",
                px: 3,
                py: 3
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                Evaluation Summary
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Determine if this entity fulfills eligibility criteria for automated outreach.
              </Typography>
              <Stack spacing={1.5}>
                {contactFields.map((field) => (
                  <Stack
                    key={field.label}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="body2" color="text.secondary">
                      {field.label}
                    </Typography>
                    <Chip
                      label={field.status}
                      size="small"
                      sx={{ bgcolor: `${field.color}1a`, color: field.color }}
                    />
                  </Stack>
                ))}
              </Stack>

              <TextField
                label="Internal Administrative Notes"
                placeholder="Observations regarding brand alignment, pricing tier, or location."
                multiline
                minRows={4}
                fullWidth
                sx={{ mt: 3 }}
              />

              <Stack direction="row" spacing={2} mt={3}>
                <Button variant="contained" size="large" fullWidth>
                  Approve for Outreach
                </Button>
                <Button variant="outlined" size="large" fullWidth>
                  Reject Business
                </Button>
              </Stack>

              <Typography variant="caption" color="text.secondary" mt={2} display="block">
                System scan: 2 hours ago · Flag for manual review if needed.
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid rgba(15,23,42,0.08)",
                px: 3,
                py: 2
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  Queue: Downtown Austin
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  12 of 42 Businesses Remaining
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} mt={1}>
                {["Quick Approve (A)", "Quick Reject (R)", "Skip Entry (Esc)"].map((shortcut) => (
                  <Chip key={shortcut} label={shortcut} size="small" />
                ))}
              </Stack>
            </Paper>
          </Stack>
        </Stack>
      </Stack>
    </ContentLayout>
  );
}
