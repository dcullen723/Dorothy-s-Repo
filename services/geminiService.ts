
import { GoogleGenAI, Type } from "@google/genai";
import { JobListing, SearchConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const fetchLegalOpsJobs = async (config: SearchConfig): Promise<{ jobs: JobListing[], sources: any[] }> => {
  const prompt = `
    Find the most recent job postings for "${config.keywords.join(' ')}" in the following locations: ${config.locations.join(', ')}.
    Search specifically on ${config.sources.join(', ')}.
    IMPORTANT FILTERS:
    1. EXCLUDE any job titles containing: ${config.excludedKeywords.join(', ')}.
    2. Focus ONLY on Legal Operations, Legal Technology, Legal Project Management, and Legal Systems roles.
    3. Look for recent postings from the last 7 days.
    
    Return the results as a list of jobs including: Title, Company, Location, a 2-sentence summary, the source URL, and whether it is remote.
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
            jobs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  company: { type: Type.STRING },
                  location: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  url: { type: Type.STRING },
                  isRemote: { type: Type.BOOLEAN },
                  postedDate: { type: Type.STRING }
                },
                required: ["title", "company", "location", "summary", "url"]
              }
            }
          }
        }
      },
    });

    const result = JSON.parse(response.text || '{"jobs": []}');
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Map to ensure IDs and consistency
    const formattedJobs = (result.jobs || []).map((j: any, index: number) => ({
      ...j,
      id: `job-${index}-${Date.now()}`,
      source: j.url.includes('linkedin') ? 'LinkedIn' : 
              j.url.includes('indeed') ? 'Indeed' : 
              j.url.includes('cloc') ? 'CLOC' : 
              j.url.includes('builtin') ? 'BuiltInSF' : 'Direct'
    }));

    return { 
      jobs: formattedJobs, 
      sources: groundingChunks 
    };
  } catch (error) {
    console.error("Error fetching jobs from Gemini:", error);
    return { jobs: [], sources: [] };
  }
};
