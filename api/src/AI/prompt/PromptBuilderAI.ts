import OpenAI from "openai";
import type { ContextualAnalysis } from "../../types/ContextualResearch";
import type { DiscoveryPlaceDetails } from "../../types/Discovery";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openAiClient = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

export type PromptContext = {
  placeDetails?: DiscoveryPlaceDetails;
  analysis?: ContextualAnalysis;
};

export class PromptBuilderAI {
  public static async generatePrompt(context: PromptContext): Promise<string> {
    const fallback = this.buildFallbackPrompt(context);
    if (!openAiClient) {
      return fallback;
    }

    try {
      const response = await openAiClient.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.28,
        max_tokens: 520,
        messages: [
          {
            role: "system",
            content:
              "You are an AI copywriter building a GPT prompt that instructs an automation platform to render a SaaS landing page home screen. Keep the answer as plain text (no JSON). Include a hero section, at least four tabs (Home, About Us, Services, Contact), and mention how metrics are highlighted. Use a confident but friendly tone."
          },
          {
            role: "user",
            content: this.buildPromptInstructions(context)
          }
        ]
      });

      const text = response.choices?.[0]?.message?.content?.trim();
      if (text) {
        return text;
      }
    } catch (error) {
      console.warn("PromptBuilderAI failed:", error instanceof Error ? error.message : error);
    }

    return fallback;
  }

  private static buildPromptInstructions(context: PromptContext): string {
    const lines: string[] = [];
    const name = context.placeDetails?.name ?? context.analysis?.entityName ?? "This business";
    lines.push(`Business: ${name}`);
    if (context.placeDetails?.address) {
      lines.push(`Address: ${context.placeDetails.address}`);
    }
    if (context.placeDetails?.website) {
      lines.push(`Website: ${context.placeDetails.website}`);
    }
    if (context.placeDetails?.phoneNumber) {
      lines.push(`Phone: ${context.placeDetails.phoneNumber}`);
    }
    if (context.analysis) {
      lines.push(`Context aggregation: ${context.analysis.contextAggregation}%`);
      lines.push(
        `Insight modules: ${context.analysis.modules.map((module) => module.title).join(", ")}`
      );
    }
    lines.push(
      "Goal: provide a prompt to generate a homepage with a hero story, highlights of outcomes, clear tabs (Home, About Us, Services, Contact) and a CTA to book a discovery call."
    );
    return lines.join("\n");
  }

  private static buildFallbackPrompt(context: PromptContext): string {
    const name = context.placeDetails?.name ?? context.analysis?.entityName ?? "this business";
    const descriptor =
      context.analysis?.modules?.[0]?.description ?? "A leading automation-enabled operator.";
    return `Prompt: Craft a SaaS-style homepage for ${name}. Start with a confident hero that mentions ${descriptor}. Include tabs for Home, About Us, Services, and Contact, calling out key metrics, customer quotes, and a prominent CTA (e.g., "Start Business Discovery"). Highlight how each tab reveals supportive content: Home (overview), About Us (team and mission), Services (offerings), Contact (reach team). Keep tone modern, data-led, and approachable.`;
  }
}
