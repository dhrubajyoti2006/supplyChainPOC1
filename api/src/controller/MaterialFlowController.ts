import { Router, Request, Response } from "express";
import { MaterialFlowService } from "../services/MaterialFlowService";

export const materialFlowRouter = Router();

materialFlowRouter.get("/list", async (req: Request, res: Response) => {
  const response = await MaterialFlowService.list();
  res.json(response);
});
