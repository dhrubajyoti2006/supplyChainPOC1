"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const express_2 = require("express");
const ContextualResearchController_1 = require("./controller/ContextualResearchController");
const DataController_1 = require("./controller/DataController");
const DiscoveryController_1 = require("./controller/DiscoveryController");
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use((0, cors_1.default)()); // Enable CORS for all routes
const port = 3000;
app.use(express_1.default.json());
const apiRouter = (0, express_2.Router)();
apiRouter.use("/data", DataController_1.dataRouter);
apiRouter.use("/scans", DiscoveryController_1.discoveryRouter);
apiRouter.use("/contextual-research", ContextualResearchController_1.contextualResearchRouter);
app.use("/api", apiRouter);
app.listen(port, () => {
    console.log(`Data API listening at http://localhost:${port}`);
});
