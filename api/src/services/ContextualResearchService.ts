import { ApiResponse } from "../models/ApiResponse";
import type { DiscoveryPlaceDetails } from "../types/Discovery";
import type { ContextualAnalysis } from "../types/ContextualResearch";
import { DiscoveryService } from "./DiscoveryService";
import { ContextualResearchAI } from "../AI/contextual/ContextualResearchAI";

export class ContextualResearchService {
  public static async getAnalysis(placeId?: string) {
    let placeDetails: DiscoveryPlaceDetails | undefined;
    if (placeId) {
      try {
        placeDetails = await DiscoveryService.getPlaceDetails(placeId);
      } catch (error) {
        console.warn("Contextual research place lookup failed:", error);
      }
    }

    const analysis = await ContextualResearchAI.generate(placeDetails);
    const response = new ApiResponse<ContextualAnalysis>(analysis);
    response.addSuccess();
    return response;
  }
}
