"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextualResearchService = void 0;
const ApiResponse_1 = require("../models/ApiResponse");
const DiscoveryService_1 = require("./DiscoveryService");
const ContextualResearchAI_1 = require("../AI/contextual/ContextualResearchAI");
class ContextualResearchService {
    static async getAnalysis(placeId) {
        let placeDetails;
        if (placeId) {
            try {
                placeDetails = await DiscoveryService_1.DiscoveryService.getPlaceDetails(placeId);
            }
            catch (error) {
                console.warn("Contextual research place lookup failed:", error);
            }
        }
        const analysis = await ContextualResearchAI_1.ContextualResearchAI.generate(placeDetails);
        const response = new ApiResponse_1.ApiResponse(analysis);
        response.addSuccess();
        return response;
    }
}
exports.ContextualResearchService = ContextualResearchService;
