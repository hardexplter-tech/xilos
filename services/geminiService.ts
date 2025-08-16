
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_INSTRUCTION = `You are an expert web developer who creates stunning, modern, and responsive websites. Your task is to generate a single, complete, self-contained HTML file based on the user's request.

- The HTML file MUST include all necessary CSS within <style> tags and any JavaScript within <script> tags.
- Use modern design principles, a clean layout, and semantic HTML.
- Use a professional and aesthetically pleasing color palette.
- The website must be responsive and work on all screen sizes, including mobile devices.
- Use placeholder content and images (e.g., from https://picsum.photos/) where necessary.
- Do NOT include any explanations, comments, or markdown formatting like \`\`\`html.
- Your entire output should be ONLY the raw HTML code for the file.`;

const EDIT_SYSTEM_INSTRUCTION = `You are an expert web developer. The user will provide you with a piece of HTML code and a request to modify it.
Your task is to apply the requested changes and return the complete, full, single, self-contained HTML file.
- The returned HTML file MUST include all necessary CSS within <style> tags and any JavaScript within <script> tags.
- Do NOT include any explanations, comments, or markdown formatting like \`\`\`html.
- Your entire output should be ONLY the raw, updated HTML code for the file.`;


const cleanupCode = (text: string): string => {
    let code = text.trim();
    if (code.startsWith('```html')) {
      code = code.substring(7);
    }
    if (code.endsWith('```')) {
      code = code.substring(0, code.length - 3);
    }
    return code.trim();
}

export const generateWebsiteCode = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    
    return cleanupCode(response.text);
  } catch (error) {
    console.error("Error generating website code:", error);
    throw new Error("Failed to generate website from the AI. Please check your prompt or try again later.");
  }
};

export const editWebsiteCode = async (currentCode: string, prompt: string): Promise<string> => {
  try {
    const fullPrompt = `Here is the current HTML code:\n\n${currentCode}\n\nPlease apply the following change: ${prompt}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        systemInstruction: EDIT_SYSTEM_INSTRUCTION,
      },
    });
    
    return cleanupCode(response.text);
  } catch (error) {
    console.error("Error editing website code:", error);
    throw new Error("Failed to edit website with AI. Please try again later.");
  }
};
