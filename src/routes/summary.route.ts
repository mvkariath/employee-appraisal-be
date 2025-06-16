import express, { Request, Response } from "express";
// import { summarizeWithGemini } from "../services/gemini.service";
import {summarizeWithGemini}  from "../services/summary.service";

const geminiRouter = express.Router();

geminiRouter.post(
  "/summary",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { appraisalData } = req.body;
      if (!appraisalData) {
        res.status(400).json({ error: "appraisalData is required" });
        return;
      }
      const summary = await summarizeWithGemini(appraisalData);
      res.json({ summary });
    } catch (error) {
      res.status(500).json({ error: "Failed to summarize data" });
    }
  }
);

export default geminiRouter;