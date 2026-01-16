import cors from "cors";
import express from "express";
import { Router } from "express";
import { dataRouter } from "./controller/DataController";

const app = express();
app.use(cors()); // Enable CORS for all routes
const port = 3000;

app.use(express.json());

const apiRouter = Router();
apiRouter.use("/data", dataRouter);

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Data API listening at http://localhost:${port}`);
});
