import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CalculationResponse } from '../types';

// Initialize Gemini Client
// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = "gemini-2.5-flash";

const calculationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    result: {
      type: Type.STRING,
      description: "The final numeric or short text answer to the math problem.",
    },
    explanation: {
      type: Type.STRING,
      description: "A concise, step-by-step explanation of how the result was achieved.",
    },
    isError: {
      type: Type.BOOLEAN,
      description: "Set to true if the input was not a valid math request or could not be solved.",
    },
  },
  required: ["result", "explanation", "isError"],
};

export const solveMathProblem = async (input: string): Promise<CalculationResponse> => {
  if (!process.env.API_KEY) {
     return {
      result: "Config Error",
      explanation: "API Key is missing. Please add API_KEY to your Vercel Environment Variables.",
      isError: true,
    };
  }

  if (!input.trim()) {
    return {
      result: "",
      explanation: "Please enter a math problem.",
      isError: true,
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Solve this math problem or answer this math-related question: "${input}". 
      Provide the result and a brief explanation. If it is not a math question, respectfully decline.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: calculationSchema,
        systemInstruction: "You are an expert mathematician and calculator assistant. Your goal is to provide accurate results and clear, step-by-step logic for any mathematical expression or word problem provided.",
      },
    });

    const textResponse = response.text;
    if (!textResponse) {
        throw new Error("No response from AI");
    }

    const data = JSON.parse(textResponse) as CalculationResponse;
    return data;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      result: "Error",
      explanation: "Failed to connect to the smart calculator service. Please check your network or API key.",
      isError: true,
    };
  }
};