import { Router, type IRouter, type Request, type Response } from "express";
import {
  CopilotError,
  getCopilotStatus,
  optimizeCvForJob,
  validateOptimizeInput,
} from "../lib/ai-copilot";

const aiRouter: IRouter = Router();

aiRouter.get("/ai/status", (_req: Request, res: Response) => {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json(getCopilotStatus());
});

aiRouter.post("/ai/optimize", async (req: Request, res: Response) => {
  res.setHeader("Cache-Control", "no-store");

  try {
    const input = validateOptimizeInput(req.body);
    const result = await optimizeCvForJob(input);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof CopilotError) {
      res.status(error.status).json({ error: error.code, message: error.message });
      return;
    }

    res
      .status(500)
      .json({ error: "AI_PROVIDER_ERROR", message: "Unexpected AI Copilot error." });
  }
});

export default aiRouter;
