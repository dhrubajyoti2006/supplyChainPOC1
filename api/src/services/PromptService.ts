import { ContextualResearchService } from "./ContextualResearchService";
import { DiscoveryService } from "./DiscoveryService";
import { PromptBuilderAI } from "../AI/prompt/PromptBuilderAI";
import type { ContextualAnalysis } from "../types/ContextualResearch";
import type { DiscoveryPlaceDetails } from "../types/Discovery";
import type { PromptGenerationResult } from "../types/Prompt";

export class PromptService {
  public static async buildHomePrompt(placeId?: string): Promise<PromptGenerationResult> {
    const analysis = await this.fetchContextualAnalysis(placeId);
    const placeDetails = await this.fetchPlaceDetails(placeId);
    const prompt = await PromptBuilderAI.generatePrompt({ analysis, placeDetails });
    const summary = this.buildSummary({ analysis, placeDetails });
    return { prompt, summary };
  }

  private static async fetchContextualAnalysis(
    placeId?: string
  ): Promise<ContextualAnalysis | undefined> {
    if (!placeId) return undefined;
    try {
      const response = await ContextualResearchService.getAnalysis(placeId);
      return response.data ?? undefined;
    } catch (error) {
      console.warn("PromptService contextual analysis failed:", error);
      return undefined;
    }
  }

  private static async fetchPlaceDetails(
    placeId?: string
  ): Promise<DiscoveryPlaceDetails | undefined> {
    if (!placeId) return undefined;
    try {
      return await DiscoveryService.getPlaceDetails(placeId);
    } catch (error) {
      console.warn("PromptService place details failed:", error);
      return undefined;
    }
  }

  private static buildSummary({
    analysis,
    placeDetails
  }: {
    analysis?: ContextualAnalysis;
    placeDetails?: DiscoveryPlaceDetails;
  }): string {
    const parts: string[] = [];
    if (placeDetails?.name) {
      parts.push(`Entity: ${placeDetails.name}`);
    }
    if (analysis?.contextAggregation) {
      parts.push(`Context aggregation: ${analysis.contextAggregation}%`);
    }
    if (analysis?.modules?.length) {
      parts.push(`Insights: ${analysis.modules.map((module) => module.title).join(", ")}`);
    }
    return parts.length ? parts.join(" · ") : "Prompt for the landing page hero.";
  }
}
