import { Request, Response, NextFunction } from "express";
import ChatbotService from "../services/chatbot.service";
import httpException from "../exceptions/httpExceptions";

class ChatbotController {
  constructor(private chatbotService: ChatbotService) {}

  public handleChatMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const payload = req.body;

    if (!payload.session_id || !payload.role || !payload.message) {
      return next(
        new httpException(
          400,
          "Request body must include session_id, role, and message."
        )
      );
    }

    try {
      const aiResponse = await this.chatbotService.forwardMessageToAI(payload);
      res.status(200).json(aiResponse);
    } catch (error) {
      next(error);
    }
  };
}

export default ChatbotController;
