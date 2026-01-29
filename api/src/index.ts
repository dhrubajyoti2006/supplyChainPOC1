import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Router } from "express";
import { contextualResearchRouter } from "./controller/ContextualResearchController";
import { dataRouter } from "./controller/DataController";
import { discoveryRouter } from "./controller/DiscoveryController";
import { aiRouter } from "./controller/AiController";

const app = express();
dotenv.config();
app.use(cors()); // Enable CORS for all routes
const port = 3000;

app.use(express.json());

const apiRouter = Router();
apiRouter.use("/data", dataRouter);
apiRouter.use("/scans", discoveryRouter);
apiRouter.use("/contextual-research", contextualResearchRouter);
apiRouter.use("/ai", aiRouter);

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Data API listening at http://localhost:${port}`);
});
