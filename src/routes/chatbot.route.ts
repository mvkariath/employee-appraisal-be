import { Router } from "express";
import ChatbotService from "../services/chatbot.service";
import ChatbotController from "../controllers/chatbot.controller";

const chatbotService = new ChatbotService();
const chatbotController = new ChatbotController(chatbotService);

const router = Router();

router.post("/", chatbotController.handleChatMessage);

export default router;
