import axios from "axios";

export async function summarizeWithGemini(appraisalData: any): Promise<string> {
  const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=" + process.env.GEMINI_API_KEY;

  // Prepare prompt
  const prompt = `Summarize this appraisal data in 2 paragraphs and it should be less than 10 lines:\n${JSON.stringify(appraisalData)}`;

  try {
    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    // Gemini returns summary in response.data.candidates[0].content.parts[0].text
    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No summary returned.";
  } catch (error) {
    console.error("Gemini API error:", error?.response?.data || error);
    throw new Error("Failed to summarize with Gemini.");
  }
}