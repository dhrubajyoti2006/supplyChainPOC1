"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataRouter = void 0;
const express_1 = require("express");
const DataService_1 = require("../services/DataService");
exports.dataRouter = (0, express_1.Router)();
exports.dataRouter.get("/list", async (req, res) => {
    const response = await DataService_1.DataService.list();
    res.json(response);
});
exports.dataRouter.get("/:id", async (req, res) => {
    const response = await DataService_1.DataService.getById(req.params.id);
    res.json(response);
});
