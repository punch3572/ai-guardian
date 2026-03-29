import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini SDK
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("GEMINI_API_KEY is missing. Please set it in your .env file.");
}

const ai = new GoogleGenAI({ apiKey: apiKey as string });

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

export async function detectAIContent(text: string): Promise<any> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an AI content detection assistant.

Your task is to analyze the given text and determine whether it is:
1) AI-generated
2) Human-written

Analyze based on the following factors:
- Writing style consistency
- Repetition or redundancy
- Use of complex or generic phrases
- Emotional depth and personal touch
- Sentence structure variation
- Predictability of language

Instructions:
- Carefully examine the text.
- Provide a probability score (0–100%) for AI-generated likelihood.
- Clearly classify the text as "AI-generated" or "Human-written".
- Give a short explanation (2–4 lines) supporting your decision.

Output format:
{
  "prediction": "AI-generated / Human-written",
  "confidence": "XX%",
  "reason": "Brief explanation here"
}

Text to analyze:
"""
${text}
"""
Return ONLY the JSON object.`
  });

  const resText = response.text;
  try {
    const jsonMatch = resText.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : resText;
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse AI detection JSON:", resText);
    throw new Error("Invalid response format from AI");
  }
}
