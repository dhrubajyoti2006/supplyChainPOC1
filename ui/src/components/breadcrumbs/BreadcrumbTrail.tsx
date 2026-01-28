import { Breadcrumbs, Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export type BreadcrumbItem = {
  label: string;
  href?: string;
  active?: boolean;
};

type BreadcrumbTrailProps = {
  items: BreadcrumbItem[];
};

export function BreadcrumbTrail({ items }: BreadcrumbTrailProps) {
  return (
    <Stack spacing={0.5}>
      <Breadcrumbs aria-label="breadcrumb">
        {items.map((item, index) =>
          item.href && !item.active ? (
            <Link
              key={item.label + index}
              component={RouterLink}
              to={item.href}
              underline="hover"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {item.label}
            </Link>
          ) : (
            <Typography
              key={item.label + index}
              color={item.active ? "text.primary" : "text.secondary"}
              fontWeight={item.active ? 600 : 500}
            >
              {item.label}
            </Typography>
          )
        )}
      </Breadcrumbs>
      <Typography variant="subtitle2" color="text.secondary">
        Navigate between scan workflows and discovery results.
      </Typography>
    </Stack>
  );
}
