import { Router, Request, Response } from "express";
import { ApiResponse } from "../models/ApiResponse";
import type { DiscoveryRequest, DiscoveryResult, DiscoveryPlaceDetails } from "../types/Discovery";
import { DiscoveryService } from "../services/DiscoveryService";

export const discoveryRouter = Router();

discoveryRouter.post("/start", async (req: Request, res: Response) => {
  const requestBody = req.body as DiscoveryRequest | undefined;

  if (!requestBody?.location?.description || typeof requestBody.radius !== "number") {
    const errorResponse = new ApiResponse<null>();
    errorResponse.addError("Location description and radius are required.");
    return res.status(400).json(errorResponse);
  }

  try {
    const response = await DiscoveryService.start(requestBody);
    res.json(response);
  } catch (error) {
    console.error("Discovery start failed", error);
    const errorResponse = new ApiResponse<null>();
    errorResponse.addError(error instanceof Error ? error.message : "Unable to start discovery.");
    res.status(500).json(errorResponse);
  }
});

discoveryRouter.get("/:scanId/results", async (req: Request, res: Response) => {
  const scanId = req.params.scanId;
  if (!scanId) {
    const errorResponse = new ApiResponse<null>();
    errorResponse.addError("Scan ID is required.");
    return res.status(400).json(errorResponse);
  }

  try {
    const response = await DiscoveryService.getResults(scanId);
    res.json(response);
  } catch (error) {
    console.error("Discovery results failed", error);
    const errorResponse = new ApiResponse<null>();
    errorResponse.addError(error instanceof Error ? error.message : "Unable to load discovery results.");
    res.status(500).json(errorResponse);
  }
});

discoveryRouter.get("/place/:placeId/details", async (req: Request, res: Response) => {
  const { placeId } = req.params;
  if (!placeId) {
    const errorResponse = new ApiResponse<null>();
    errorResponse.addError("placeId is required.");
    return res.status(400).json(errorResponse);
  }

  try {
    const details = await DiscoveryService.getPlaceDetails(placeId);
    const response = new ApiResponse<DiscoveryPlaceDetails>(details);
    response.addSuccess();
    return res.json(response);
  } catch (error) {
    console.error("Place details failed", error);
    const errorResponse = new ApiResponse<null>();
    errorResponse.addError(error instanceof Error ? error.message : "Unable to load place details.");
    return res.status(500).json(errorResponse);
  }
});
