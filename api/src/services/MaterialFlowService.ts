import { ApiResponse } from "../models/ApiResponse";
import { materialFlows } from "../data/material-flows";
import type { MaterialFlow } from "../types/MaterialFlow";

export class MaterialFlowService {
  public static async list() {
    const response = new ApiResponse<MaterialFlow[]>();
    try {
      response.data = materialFlows;
      response.addSuccess();
      return response;
    } catch (error) {
      response.addExceptionWithText(error instanceof Error ? error.message : "Unknown error");
      return response;
    }
  }
}
