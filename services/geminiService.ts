import { GoogleGenAI, Type } from "@google/genai";
import { AIIntelligence, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const fetchVendorIntelligence = async (
  vendorName: string,
  website: string
): Promise<{ intelligence: Partial<AIIntelligence>; sources: GroundingSource[] }> => {
  const prompt = `
    Search for the latest information about "${vendorName}" (${website}), a legal AI software vendor.

    Find and return:
    1. Their most recent product release or major update (with version number and date if available). If no specific version exists, describe the latest notable release or announcement.
    2. The AI/ML models they currently use or have announced (e.g. GPT-4o, Claude, proprietary models). Return an empty array if unknown.
    3. Up to 5 recently announced features or capabilities (from the last 12 months). Each feature should be a short descriptive sentence.

    Focus on official press releases, their blog, and legal tech news sources such as Law.com, LegalTech News, Above the Law, and CLOC.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            latestRelease: { type: Type.STRING },
            aiModels: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            recentFeatures: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["latestRelease", "aiModels", "recentFeatures"],
        },
      },
    });

    const result = JSON.parse(response.text || '{"latestRelease":"","aiModels":[],"recentFeatures":[]}');
    const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const groundingChunks: GroundingSource[] = rawChunks
      .filter((c: any) => c.web?.uri)
      .map((c: any) => ({ web: { uri: c.web.uri as string, title: (c.web.title as string) || '' } }));

    return {
      intelligence: {
        latestRelease: result.latestRelease || '',
        aiModels: result.aiModels || [],
        recentFeatures: result.recentFeatures || [],
      },
      sources: groundingChunks,
    };
  } catch (error) {
    console.error("Error fetching vendor intelligence from Gemini:", error);
    return {
      intelligence: { latestRelease: '', aiModels: [], recentFeatures: [] },
      sources: [],
    };
  }
};
