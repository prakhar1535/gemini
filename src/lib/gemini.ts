import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

export interface ContentGenerationRequest {
  platform: "x" | "linkedin" | "instagram";
  topic: string;
  tone: "professional" | "casual" | "friendly" | "authoritative";
  length: "short" | "medium" | "long";
  includeHashtags?: boolean;
  includeCallToAction?: boolean;
  imageDescription?: string;
}

export interface ContentGenerationResponse {
  content: string;
  hashtags: string[];
  callToAction: string;
  suggestions: string[];
}

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  async generateContent(
    request: ContentGenerationRequest
  ): Promise<ContentGenerationResponse> {
    const prompt = this.buildPrompt(request);

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseResponse(text);
    } catch (error) {
      console.error("Error generating content:", error);
      throw new Error("Failed to generate content. Please try again.");
    }
  }

  async generateContentFromImage(
    imageBase64: string,
    platform: "x" | "linkedin" | "instagram",
    additionalPrompt?: string
  ): Promise<ContentGenerationResponse> {
    const prompt = this.buildImagePrompt(platform, additionalPrompt);

    try {
      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageBase64,
            mimeType: "image/jpeg",
          },
        },
      ]);

      const response = await result.response;
      const text = response.text();

      return this.parseResponse(text);
    } catch (error) {
      console.error("Error generating content from image:", error);
      throw new Error(
        "Failed to generate content from image. Please try again."
      );
    }
  }

  private buildPrompt(request: ContentGenerationRequest): string {
    const platformGuidelines = {
      x: "Twitter/X: Keep it concise, engaging, and conversational. Use relevant hashtags and mentions when appropriate.",
      linkedin:
        "LinkedIn: Professional tone, industry insights, thought leadership. Focus on business value and networking.",
      instagram:
        "Instagram: Visual storytelling, lifestyle content, engaging captions. Use emojis and relevant hashtags.",
    };

    const lengthGuidelines = {
      short:
        "Keep it under 100 characters for X, 150 words for LinkedIn, 100 words for Instagram.",
      medium:
        "Aim for 100-200 characters for X, 150-300 words for LinkedIn, 100-200 words for Instagram.",
      long: "Use up to 280 characters for X, 300-500 words for LinkedIn, 200-300 words for Instagram.",
    };

    return `
Generate engaging social media content for ${request.platform.toUpperCase()} with the following specifications:

Topic: ${request.topic}
Tone: ${request.tone}
Length: ${request.length}
Platform Guidelines: ${platformGuidelines[request.platform]}
Length Guidelines: ${lengthGuidelines[request.length]}
${
  request.imageDescription
    ? `Image Description: ${request.imageDescription} - Make sure the content relates to and complements this image description.`
    : ""
}

Requirements:
- Create compelling, engaging content that resonates with the target audience
- Use appropriate tone and style for the platform
- ${
      request.includeHashtags
        ? "Include 3-5 relevant hashtags"
        : "No hashtags needed"
    }
- ${
      request.includeCallToAction
        ? "Include a clear call-to-action"
        : "No call-to-action needed"
    }
- Make it shareable and engaging
- Consider trending topics and current events if relevant
${
  request.imageDescription
    ? "- Ensure the content works well with the described image"
    : ""
}

Please respond in the following JSON format:
{
  "content": "Your generated content here",
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
  "callToAction": "Your call-to-action here",
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
}
`;
  }

  private buildImagePrompt(
    platform: "x" | "linkedin" | "instagram",
    additionalPrompt?: string
  ): string {
    const platformGuidelines = {
      x: "Twitter/X: Create a concise, engaging caption that complements the image. Use relevant hashtags. Keep it under 280 characters.",
      linkedin:
        "LinkedIn: Write a professional caption that adds business value and encourages engagement. Focus on insights, lessons, or professional relevance.",
      instagram:
        "Instagram: Create an engaging, lifestyle-focused caption with emojis and relevant hashtags. Make it personal and relatable.",
    };

    return `
You are an expert social media content creator. Analyze this image carefully and generate engaging content for ${platform.toUpperCase()}.

INSTRUCTIONS:
1. First, describe what you see in the image in detail
2. Identify the key elements, objects, people, settings, colors, mood, and atmosphere
3. Consider the context and potential story behind the image
4. Generate content that is SPECIFIC to what you observe in the image

${platformGuidelines[platform]}

${additionalPrompt ? `Additional requirements: ${additionalPrompt}` : ""}

CONTENT REQUIREMENTS:
- Make the content specific to what you see in the image
- Use descriptive language that relates to the visual elements
- Include relevant hashtags based on the image content
- Add a compelling call-to-action
- Make it engaging and shareable

Please respond in the following JSON format:
{
  "content": "Your generated content here (be specific to the image)",
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4"],
  "callToAction": "Your call-to-action here",
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
}
`;
  }

  private parseResponse(text: string): ContentGenerationResponse {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          content: parsed.content || "",
          hashtags: parsed.hashtags || [],
          callToAction: parsed.callToAction || "",
          suggestions: parsed.suggestions || [],
        };
      }

      // Fallback if no JSON found
      return {
        content: text,
        hashtags: [],
        callToAction: "",
        suggestions: [],
      };
    } catch (error) {
      console.error("Error parsing response:", error);
      return {
        content: text,
        hashtags: [],
        callToAction: "",
        suggestions: [],
      };
    }
  }

  // Analyze an image to extract visible text (OCR) and generate an Indian-culture storytelling context
  async generateIndianCraftStoryFromImage(
    imageBase64: string,
    options?: { regionHint?: string; craftTypeHint?: string }
  ): Promise<{
    title: string;
    artist: string;
    description: string;
    year: string;
    keywords: string[];
    region?: string;
    craftType?: string;
  }> {
    const prompt = `You are an expert Indian art historian and curator. Analyze the provided image (inline). First perform OCR to extract any visible text (shop names, signage, labels). Then, based on the visual cues and OCR, write a culturally rooted story that helps a visitor understand the traditional significance of the craft or subject in the image.\n\nInstructions:\n- Identify likely Indian region/state and community where this craft/theme is rooted\n- Identify materials, techniques, motifs, and any religious/seasonal/festival associations\n- Explain symbolism and heritage value in a way that effectively tells the story of their craft to lay visitors\n- Keep the tone warm, respectful, and insightful; avoid making up specific personal names unless present in OCR\n- Prefer terms used in India (e.g., ghungroo, kantha, madhubani, kolam, ajrakh, bandhani, warli, pattachitra, dokra, ittar, block printing, chikankari, kathakali, kalamkari, terracotta, brassware, bidri, etc.) where relevant\n\nReturn ONLY valid JSON with the following shape:\n{\n  \"title\": \"short evocative title rooted in Indian tradition\",\n  \"artist\": \"Unknown artisan\" | \"Workshop/Collective\" | text derived from OCR if available,\n  \"description\": \"2-3 short paragraphs telling the story and traditional significance\",\n  \"year\": \"YYYY\" (best guess; otherwise current year),\n  \"keywords\": [\"max 6 tags like region, craft, motif\"],\n  \"region\": \"state/region guess if applicable\",\n  \"craftType\": \"craft or art form guess if applicable\"\n}`;

    try {
      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageBase64,
            mimeType: "image/jpeg",
          },
        },
      ]);

      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Model did not return JSON");
      }
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        title: parsed.title || "Artwork",
        artist: parsed.artist || "Unknown artisan",
        description: parsed.description || "",
        year: parsed.year || new Date().getFullYear().toString(),
        keywords: parsed.keywords || [],
        region: parsed.region,
        craftType: parsed.craftType,
      };
    } catch (error) {
      console.error("Error generating Indian craft story from image:", error);
      return {
        title: "Artwork",
        artist: "Unknown artisan",
        description:
          "A crafted piece reflecting the depth of Indian tradition and everyday aesthetics.",
        year: new Date().getFullYear().toString(),
        keywords: [],
      };
    }
  }
}

export const geminiService = new GeminiService();
