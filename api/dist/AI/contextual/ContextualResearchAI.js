"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextualResearchAI = void 0;
const openai_1 = __importDefault(require("openai"));
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openAiClient = OPENAI_API_KEY ? new openai_1.default({ apiKey: OPENAI_API_KEY }) : null;
class ContextualResearchAI {
    static async generate(placeDetails) {
        const fallback = this.buildFallbackAnalysis(placeDetails);
        if (!openAiClient) {
            return fallback;
        }
        try {
            const response = await openAiClient.chat.completions.create({
                model: "gpt-4o-mini",
                temperature: 0.35,
                max_tokens: 600,
                messages: [
                    {
                        role: "system",
                        content: "You are a contextual research analyst for a B2B automation platform. The answer must be a single JSON object that matches the schema { entityName, contextAggregation, modules } where modules is an array of exactly three objects containing title, stat, description and detail. Do not include any prose outside of the JSON."
                    },
                    {
                        role: "user",
                        content: this.buildPrompt(placeDetails)
                    }
                ]
            });
            const rawText = response.choices?.[0]?.message?.content;
            if (rawText) {
                const parsed = this.parseResponse(rawText);
                if (parsed) {
                    return parsed;
                }
            }
        }
        catch (error) {
            console.warn("ContextualResearchAI failed:", error instanceof Error ? error.message : error);
        }
        return fallback;
    }
    static buildPrompt(placeDetails) {
        const lines = ["Use the available place data to build the contextual analysis. Keep the response strictly JSON."];
        if (placeDetails?.placeId) {
            lines.push(`Place ID: ${placeDetails.placeId}`);
        }
        if (placeDetails?.name) {
            lines.push(`Name: ${placeDetails.name}`);
        }
        if (placeDetails?.address) {
            lines.push(`Address: ${placeDetails.address}`);
        }
        if (placeDetails?.website) {
            lines.push(`Website: ${placeDetails.website}`);
        }
        if (placeDetails?.phoneNumber || placeDetails?.internationalPhoneNumber) {
            lines.push(`Phone: ${placeDetails.internationalPhoneNumber ?? placeDetails.phoneNumber}`);
        }
        if (typeof placeDetails?.rating === "number") {
            lines.push(`Rating: ${placeDetails.rating}/5 from ${placeDetails.userRatingsTotal ?? 0} reviews`);
        }
        if (placeDetails?.types?.length) {
            lines.push(`Category tags: ${placeDetails.types.join(", ")}`);
        }
        if (placeDetails?.openingHours?.length) {
            lines.push(`Sample hours: ${placeDetails.openingHours.slice(0, 3).join(", ")}`);
        }
        if (placeDetails?.businessStatus) {
            lines.push(`Business status: ${placeDetails.businessStatus}`);
        }
        return lines.join("\n");
    }
    static parseResponse(rawText) {
        const cleaned = rawText
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();
        const match = cleaned.match(/\{[\s\S]*\}/);
        const payload = match ? match[0] : cleaned;
        try {
            const parsed = JSON.parse(payload);
            if (!parsed || !Array.isArray(parsed.modules)) {
                return null;
            }
            const modules = parsed.modules.slice(0, 3).map((module, index) => ({
                title: this.safeString(module.title ?? module.heading ?? `Insight ${index + 1}`),
                stat: this.safeString(module.stat ?? module.metric ?? `Metric ${index + 1}`),
                description: this.safeString(module.description ?? module.summary ?? ""),
                detail: this.safeString(module.detail ?? module.action ?? "")
            }));
            return {
                entityName: this.safeString(parsed.entityName ?? parsed.name ?? "Unknown Entity"),
                contextAggregation: this.clampAggregation(parsed.contextAggregation ?? 70),
                modules
            };
        }
        catch {
            return null;
        }
    }
    static buildFallbackAnalysis(placeDetails) {
        const modules = this.buildFallbackModules(placeDetails);
        return {
            entityName: placeDetails?.name ?? "Unknown Entity",
            contextAggregation: this.deriveAggregation(placeDetails),
            modules
        };
    }
    static buildFallbackModules(placeDetails) {
        const locationHint = placeDetails?.address ? `near ${placeDetails.address}` : "in the current region";
        const typeHint = placeDetails?.types?.slice(0, 2).join(", ") ?? "multiple local segments";
        const ratingHint = typeof placeDetails?.rating === "number"
            ? `Rated ${placeDetails.rating.toFixed(1)}/5`
            : "Rating is not yet public";
        const detailHint = placeDetails?.openingHours?.length
            ? `Sample hours: ${placeDetails.openingHours.slice(0, 2).join(", ")}`
            : "Opening hours are not published.";
        return [
            {
                title: "Market Industry Analysis",
                stat: "Sector Dynamics",
                description: `Operators around ${typeHint} ${locationHint} are easing into automation.`,
                detail: `${ratingHint}. ${detailHint}`
            },
            {
                title: "Regional Behavioral Insights",
                stat: "Geographic Saturation",
                description: `Consumer behavior is shaped by the local density of ${typeHint}.`,
                detail: "Focus on responsive fulfillment for the adjacent micro-regions."
            },
            {
                title: "Competitive Landscape Patterns",
                stat: "Operational Readiness",
                description: "Automation maturity is inferred from digital visibility and service coverage.",
                detail: `Website: ${placeDetails?.website ?? "not shared"}. ${ratingHint} across reviews.`
            }
        ];
    }
    static deriveAggregation(placeDetails) {
        const rating = typeof placeDetails?.rating === "number" ? placeDetails.rating : undefined;
        if (typeof rating === "number") {
            return Math.min(95, Math.max(45, Math.round((rating / 5) * 50 + 40)));
        }
        return 75;
    }
    static clampAggregation(value) {
        const candidate = typeof value === "string" ? Number(value) : value;
        const parsed = typeof candidate === "number" && Number.isFinite(candidate) ? candidate : 75;
        return Math.min(100, Math.max(0, Math.round(parsed)));
    }
    static safeString(value) {
        return typeof value === "string" ? value.trim() : `${value ?? ""}`;
    }
}
exports.ContextualResearchAI = ContextualResearchAI;
