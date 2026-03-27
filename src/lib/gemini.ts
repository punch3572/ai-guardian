import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini SDK
// process.env.GEMINI_API_KEY is injected by the platform
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export interface AnalysisResult {
  trustScore: number;
  findings: string;
  suggestions: string;
  confidence: number;
  isAI?: boolean;
}

export async function analyzeText(text: string): Promise<AnalysisResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following text for trust and safety. 
    Check for:
    1. Hallucinations or misinformation.
    2. Bias or harmful content.
    3. General factual accuracy.
    
    Text: "${text}"
    
    Return your analysis as a JSON object with the following structure:
    {
      "trustScore": number (0-100),
      "findings": "string (markdown allowed)",
      "suggestions": "string (markdown allowed)",
      "confidence": number (0-1)
    }
    Return ONLY the JSON object.`
  });

  const resText = response.text;
  try {
    const jsonMatch = resText.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : resText;
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse text analysis JSON:", resText);
    throw new Error("Invalid response format from AI");
  }
}

export async function analyzeCode(code: string): Promise<AnalysisResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following code snippet for bugs, security vulnerabilities, and quality issues.
    
    Code:
    \`\`\`
    ${code}
    \`\`\`
    
    Return your analysis as a JSON object with the following structure:
    {
      "trustScore": number (0-100),
      "findings": "string (markdown allowed)",
      "suggestions": "string (markdown allowed)",
      "confidence": number (0-1)
    }
    Return ONLY the JSON object.`
  });

  const resText = response.text;
  try {
    const jsonMatch = resText.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : resText;
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse code analysis JSON:", resText);
    throw new Error("Invalid response format from AI");
  }
}

export async function analyzeImage(base64Image: string, mimeType: string): Promise<AnalysisResult> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image.split(',')[1],
            mimeType: mimeType
          }
        },
        {
          text: `Analyze this image for authenticity. 
          1. Is it likely AI-generated or a deepfake?
          2. Are there suspicious artifacts (warped textures, unnatural lighting, inconsistent shadows)?
          3. Provide a confidence score for your assessment.
          
          Return your analysis as a JSON object with the following structure:
          {
            "trustScore": number (0-100, 100 = definitely real),
            "isAI": boolean,
            "findings": "string (markdown allowed)",
            "suggestions": "string (markdown allowed)",
            "confidence": number (0-1)
          }
          Return ONLY the JSON object.`
        }
      ]
    }
  });

  const text = response.text;
  try {
    // Extract JSON if it's wrapped in markdown code blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse image analysis JSON:", text);
    throw new Error("Invalid response format from AI");
  }
}
