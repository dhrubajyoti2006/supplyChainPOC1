import { Router, Request, Response } from "express";
import { ApiResponse } from "../models/ApiResponse";
import { ContextualResearchService } from "../services/ContextualResearchService";

export const contextualResearchRouter = Router();

contextualResearchRouter.get("/analysis", async (req: Request, res: Response) => {
  const placeId = typeof req.query.placeId === "string" ? req.query.placeId : undefined;
  try {
    const response = await ContextualResearchService.getAnalysis(placeId);
    res.json(response);
  } catch (error) {
    console.error("Contextual analysis failed", error);
    const errorResponse = new ApiResponse<null>();
    errorResponse.addError(error instanceof Error ? error.message : "Unable to load contextual research.");
    res.status(500).json(errorResponse);
  }
});
