import { Router, Request, Response } from "express";
import { DataService } from "../services/DataService";

export const dataRouter = Router();

dataRouter.get("/list", async (req: Request, res: Response) => {
  const response = await DataService.list();
  res.json(response);
});

dataRouter.get("/:id", async (req: Request, res: Response) => {
  const response = await DataService.getById(req.params.id);
  res.json(response);
});
