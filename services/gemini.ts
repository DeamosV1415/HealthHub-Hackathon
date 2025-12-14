import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTriageResponse = async (
  history: {role: string, parts: {text: string}[]}[], 
  message: string,
  image?: { base64: string, mimeType: string }
) => {
  try {
    // Construct the user message parts. If an image is provided, include it.
    const userParts: any[] = [{ text: message }];
    if (image) {
      userParts.unshift({
        inlineData: {
          mimeType: image.mimeType,
          data: image.base64
        }
      });
    }

    const contents = [
      ...history.map(msg => ({
        role: msg.role,
        parts: msg.parts
      })),
      {
        role: 'user',
        parts: userParts
      }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: "You are a helpful, empathetic, and professional medical triage AI assistant named HealthHub AI. Your goal is to gather symptoms from the user and suggest potential causes or recommend seeing a doctor. If an image is provided (e.g., of a rash, wound, or visible symptom), analyze the visual characteristics carefully to inform your advice, but NEVER give definitive medical diagnoses. Always advise consulting a professional for serious issues. Keep responses concise and easy to read.",
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini Triage Error:", error);
    return "I'm having trouble connecting to the triage service right now. Please try again later.";
  }
};

export const generateReportAnalysis = async (base64Image: string, mimeType: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: "Analyze this medical document. Summarize the key findings, abnormal values, and provide a simplified explanation for a patient. Format the output with clear headings and bullet points using Markdown."
          }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return "Unable to analyze the report at this time. Please ensure the image is clear and try again.";
  }
};

export const generateGeneralChatResponse = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
   try {
    const contents = [
      ...history.map(msg => ({
        role: msg.role,
        parts: msg.parts
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: "You are a general health assistant for the HealthHub portal. Answer general health questions, explain medical terms, and provide wellness tips. Keep it friendly and concise.",
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Sorry, I couldn't process your request.";
  }
}