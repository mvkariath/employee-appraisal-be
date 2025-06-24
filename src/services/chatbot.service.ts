import axios from "axios";
import httpException from "../exceptions/httpExceptions";
import { LoggerService } from "./logger.service";

interface ChatbotRequestPayload {
  session_id: string;
  role: "employee";
  message: string;
}

interface ProjectState {
  delivery: string;
  accomplishments: string;
  approach: string;
  improvement: string;
  timeframe: string;
}

interface ConversationHistoryItem {
  role: "user" | "assistant";
  content: string;
}

interface FastAPIStateObject {
  messages: string;
  project: ProjectState;
  missing: string[];
  followup: string;
  conversation_history: ConversationHistoryItem[];
  state: string;
  role: string;
  intent: string;
}

interface FastApiResponse {
  final: FastAPIStateObject;
}

class ChatbotService {
  private logger = LoggerService.getInstance("ChatbotService");

  public async forwardMessageToAI(
    payload: ChatbotRequestPayload
  ): Promise<FastApiResponse> {
    payload.role = "employee"; // Ensure role is set to 'employee'
    this.logger.info(`Forwarding message for session: ${payload.session_id}`);

    const fastApiUrl = process.env.FASTAPI_CHATBOT_URL;

    if (!fastApiUrl) {
      this.logger.error(
        "FATAL: FASTAPI_CHATBOT_URL environment variable is not set."
      );
      throw new httpException(
        500,
        "AI Chatbot service is not configured on the server."
      );
    }

    try {
      const response = await axios.post<FastApiResponse>(fastApiUrl, payload);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        this.logger.error(
          `Error from FastAPI backend (Status: ${
            error.response.status
          }): ${JSON.stringify(error.response.data)}`
        );
      } else {
        this.logger.error(`Error communicating with FastAPI backend: ${error}`);
      }
      throw new httpException(
        502,
        "The AI Chatbot service is currently unavailable."
      );
    }
  }
}

export default ChatbotService;
