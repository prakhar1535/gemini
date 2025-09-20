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
}

export const geminiService = new GeminiService();
