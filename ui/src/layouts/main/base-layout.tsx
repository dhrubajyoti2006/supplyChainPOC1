import type { ReactNode } from "react";
import { Box, Container } from "@mui/material";

type BaseLayoutProps = {
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | false;
  disableGutters?: boolean;
};

export function BaseLayout({
  children,
  maxWidth = "lg",
  disableGutters = false
}: BaseLayoutProps) {
  return (
    <Container
      maxWidth={maxWidth}
      disableGutters={disableGutters}
      sx={{
        py: { xs: 2, md: 4 },
        px: { xs: 2, md: 0 }
      }}
    >
      <Box>{children}</Box>
    </Container>
  );
}
