"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discoveryRouter = void 0;
const express_1 = require("express");
const ApiResponse_1 = require("../models/ApiResponse");
const DiscoveryService_1 = require("../services/DiscoveryService");
exports.discoveryRouter = (0, express_1.Router)();
exports.discoveryRouter.post("/start", async (req, res) => {
    const requestBody = req.body;
    if (!requestBody?.location?.description || typeof requestBody.radius !== "number") {
        const errorResponse = new ApiResponse_1.ApiResponse();
        errorResponse.addError("Location description and radius are required.");
        return res.status(400).json(errorResponse);
    }
    try {
        const response = await DiscoveryService_1.DiscoveryService.start(requestBody);
        res.json(response);
    }
    catch (error) {
        console.error("Discovery start failed", error);
        const errorResponse = new ApiResponse_1.ApiResponse();
        errorResponse.addError(error instanceof Error ? error.message : "Unable to start discovery.");
        res.status(500).json(errorResponse);
    }
});
exports.discoveryRouter.get("/:scanId/results", async (req, res) => {
    const scanId = req.params.scanId;
    if (!scanId) {
        const errorResponse = new ApiResponse_1.ApiResponse();
        errorResponse.addError("Scan ID is required.");
        return res.status(400).json(errorResponse);
    }
    try {
        const response = await DiscoveryService_1.DiscoveryService.getResults(scanId);
        res.json(response);
    }
    catch (error) {
        console.error("Discovery results failed", error);
        const errorResponse = new ApiResponse_1.ApiResponse();
        errorResponse.addError(error instanceof Error ? error.message : "Unable to load discovery results.");
        res.status(500).json(errorResponse);
    }
});
exports.discoveryRouter.get("/place/:placeId/details", async (req, res) => {
    const { placeId } = req.params;
    if (!placeId) {
        const errorResponse = new ApiResponse_1.ApiResponse();
        errorResponse.addError("placeId is required.");
        return res.status(400).json(errorResponse);
    }
    try {
        const details = await DiscoveryService_1.DiscoveryService.getPlaceDetails(placeId);
        const response = new ApiResponse_1.ApiResponse(details);
        response.addSuccess();
        return res.json(response);
    }
    catch (error) {
        console.error("Place details failed", error);
        const errorResponse = new ApiResponse_1.ApiResponse();
        errorResponse.addError(error instanceof Error ? error.message : "Unable to load place details.");
        return res.status(500).json(errorResponse);
    }
});
