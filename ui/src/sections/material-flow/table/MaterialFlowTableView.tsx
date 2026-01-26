import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import type { MaterialFlow } from "../../../types/MaterialFlow";

type MaterialFlowTableViewProps = {
  data: MaterialFlow[];
};

export function MaterialFlowTableView({ data }: MaterialFlowTableViewProps) {
  return (
    <Box sx={{ height: "100%" }}>
      <TableContainer
        sx={{
          height: "100%",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "auto"
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.65rem" }}>Country</TableCell>
              <TableCell sx={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.65rem" }}>
                Company Code
              </TableCell>
              <TableCell sx={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.65rem" }}>Plant</TableCell>
              <TableCell sx={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.65rem" }}>
                Material
              </TableCell>
              <TableCell sx={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.65rem" }}>
                Fiscal Year
              </TableCell>
              <TableCell sx={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.65rem" }}>
                Posting Period
              </TableCell>
              <TableCell sx={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.65rem" }}>
                Process Category
              </TableCell>
              <TableCell sx={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.65rem" }}>T or M</TableCell>
              <TableCell sx={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.65rem" }}>
                Sender Plant
              </TableCell>
              <TableCell sx={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.65rem" }}>
                Sender Material
              </TableCell>
              <TableCell sx={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.65rem" }}>
                Detail Key
              </TableCell>
              <TableCell sx={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.65rem" }}>
                GVC Quantity
              </TableCell>
              <TableCell sx={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.65rem" }}>
                Base Unit
              </TableCell>
              <TableCell sx={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.65rem" }}>
                Currency
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={`${row.plant}-${row.detailKey}-${index}`}>
                <TableCell>{row.country}</TableCell>
                <TableCell>{row.companyCode}</TableCell>
                <TableCell>{row.plant}</TableCell>
                <TableCell>{row.material}</TableCell>
                <TableCell>{row.fiscalYear}</TableCell>
                <TableCell>{row.postingPeriod}</TableCell>
                <TableCell>{row.processCategory}</TableCell>
                <TableCell>{row.torM}</TableCell>
                <TableCell>{row.senderPlant}</TableCell>
                <TableCell>{row.senderMaterial}</TableCell>
                <TableCell>{row.detailKey}</TableCell>
                <TableCell>{row.gvcQuantity.toLocaleString()}</TableCell>
                <TableCell>{row.baseUnitOfMeasure}</TableCell>
                <TableCell>{row.currency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
