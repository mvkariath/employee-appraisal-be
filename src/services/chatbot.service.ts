import axios from 'axios';
import httpException from '../exceptions/httpExceptions';
import { LoggerService } from './logger.service';

interface ChatbotRequestPayload {
  session_id: string;
  role: 'developer' | 'lead' | 'hr';
  message: string;
}

interface FastAPIStateObject {
  // Assuming the full response structure is defined elsewhere
  // This is a placeholder for the purpose of this file
  [key: string]: any;
}

interface FastApiResponse {
  final: FastAPIStateObject;
}

class ChatbotService {
  private logger = LoggerService.getInstance('ChatbotService');

  // Helper method to check if error is from axios
  private isAxiosError(error: any): boolean {
    return error && error.isAxiosError === true;
  }

  public async forwardMessageToAI(
    payload: ChatbotRequestPayload
  ): Promise<FastApiResponse> {
    this.logger.info(
      `Forwarding message for session: ${payload.session_id} with role: ${payload.role}`
    );

    const fastApiUrl = process.env.FASTAPI_CHATBOT_URL;

    if (!fastApiUrl) {
      this.logger.error(
        'FATAL: FASTAPI_CHATBOT_URL environment variable is not set.'
      );
      throw new httpException(
        500,
        'AI Chatbot service is not configured on the server.'
      );
    }

    try {
      const response = await axios.post<FastApiResponse>(fastApiUrl, payload);
      return response.data;
    } catch (error: any) {
      // Check if it's an AxiosError with response data
      if (this.isAxiosError(error)) {
        if (error.response) {
          // Server responded with an error status
          this.logger.error(
            `Error from FastAPI backend (Status: ${error.response.status}): ${JSON.stringify(error.response.data)}`
          );
          throw new httpException(
            error.response.status,
            error.response.data || 'Unknown server error'
          );
        } else if (error.request) {
          // Request was made but no response received (network error)
          this.logger.error(
            `Network error - no response from FastAPI backend: ${error.message}`
          );
          throw new httpException(
            502,
            'The AI Chatbot service is currently unreachable.'
          );
        } else {
          // Something else happened in setting up the request
          this.logger.error(
            `Request setup error: ${error.message}`
          );
          throw new httpException(
            500,
            'Failed to setup request to AI Chatbot service.'
          );
        }
      } else {
        // Handle non-Axios errors (e.g., JSON parsing errors, etc.)
        this.logger.error(`An unexpected error occurred: ${error}`);
        throw new httpException(
          500,
          'An unexpected error occurred while communicating with the AI service.'
        );
      }
    }
  }
}

export default ChatbotService;