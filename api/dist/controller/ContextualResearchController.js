"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextualResearchRouter = void 0;
const express_1 = require("express");
const ApiResponse_1 = require("../models/ApiResponse");
const ContextualResearchService_1 = require("../services/ContextualResearchService");
exports.contextualResearchRouter = (0, express_1.Router)();
exports.contextualResearchRouter.get("/analysis", async (req, res) => {
    const placeId = typeof req.query.placeId === "string" ? req.query.placeId : undefined;
    try {
        const response = await ContextualResearchService_1.ContextualResearchService.getAnalysis(placeId);
        res.json(response);
    }
    catch (error) {
        console.error("Contextual analysis failed", error);
        const errorResponse = new ApiResponse_1.ApiResponse();
        errorResponse.addError(error instanceof Error ? error.message : "Unable to load contextual research.");
        res.status(500).json(errorResponse);
    }
});
