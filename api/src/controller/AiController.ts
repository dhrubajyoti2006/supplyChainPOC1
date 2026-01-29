import { Router, Request, Response } from "express";
import { ApiResponse } from "../models/ApiResponse";
import { PromptService } from "../services/PromptService";

export const aiRouter = Router();

aiRouter.get("/prompt/home", async (req: Request, res: Response) => {
  const placeId = typeof req.query.placeId === "string" ? req.query.placeId : undefined;
  try {
    const result = await PromptService.buildHomePrompt(placeId);
    const response = new ApiResponse(result);
    response.addSuccess();
    res.json(response);
  } catch (error) {
    console.error("AI prompt generation failed", error);
    const errorResponse = new ApiResponse<null>();
    errorResponse.addError(error instanceof Error ? error.message : "Unable to generate prompt.");
    res.status(500).json(errorResponse);
  }
});
