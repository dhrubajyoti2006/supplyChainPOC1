import { Router, Request, Response } from "express";
import OpenAI from "openai";
import { ApiResponse } from "../models/ApiResponse";

type AnalysisRequestBody = {
  input?: string;
};

type AnalysisResult = {
  output: string;
  model: string;
};

const getClient = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const analysisRouter = Router();

analysisRouter.post("/", async (req: Request, res: Response) => {
  const response = new ApiResponse<AnalysisResult | null>();
  const { input } = (req.body ?? {}) as AnalysisRequestBody;

  if (!process.env.OPENAI_API_KEY) {
    response.addError("OPENAI_API_KEY is not configured on the server.");
    response.data = null;
    return res.status(500).json(response);
  }

  if (!input || typeof input !== "string" || !input.trim()) {
    response.addError("Missing request body field: input");
    response.data = null;
    return res.status(400).json(response);
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  try {
    const client = getClient();
    const result = await client.chat.completions.create({
      model,
      temperature: 0.3,
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content:
            "You are a concise business analyst. Provide a clear, structured analysis."
        },
        {
          role: "user",
          content: input
        }
      ]
    });

    response.data = {
      output: result.choices?.[0]?.message?.content ?? "",
      model
    };
    response.addSuccess();
    return res.json(response);
  } catch (error) {
    response.addExceptionWithText(
      error instanceof Error ? error.message : "OpenAI request failed"
    );
    response.data = null;
    return res.status(500).json(response);
  }
});
