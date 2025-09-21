import fs from "fs";
import path from "path";

interface OpenRouterMessage {
  role: "user" | "assistant" | "system";
  content: Array<{
    type: "text" | "image_url";
    text?: string;
    image_url?: {
      url: string;
    };
  }>;
}

interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content?: string;
      // Some models return images along with content
      images?: Array<{
        type?: string;
        // OpenRouter typically uses { image_url: { url: string } },
        // but some providers may inline base64 or use different keys
        image_url?: any;
      }>;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenRouterService {
  private apiKey: string;
  private baseUrl = "https://openrouter.ai/api/v1";

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || "";
    if (!this.apiKey) {
      console.warn(
        "OpenRouter API key not found. Image generation will not work."
      );
    }
  }

  private logToFile(filename: string, data: any) {
    try {
      const logDir = path.join(process.cwd(), "logs");
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      const logPath = path.join(logDir, filename);
      const timestamp = new Date().toISOString();
      const logEntry = `\n\n=== ${timestamp} ===\n${JSON.stringify(
        data,
        null,
        2
      )}\n`;
      fs.appendFileSync(logPath, logEntry);
      console.log(`Logged to ${logPath}`);
    } catch (error) {
      console.error("Failed to log to file:", error);
    }
  }

  async generateImageVariations(
    imageUrl: string,
    style: string,
    prompt?: string
  ): Promise<string[]> {
    if (!this.apiKey) {
      console.log("OpenRouter API key not found in service");
      throw new Error("OpenRouter API key not configured");
    }

    console.log("OpenRouter API key found, making request...");

    try {
      const basePrompt =
        prompt ||
        `Generate ${style} style variations of this image for social media`;
      const enhancedPrompts = [
        `${basePrompt} - Professional product photography with studio lighting, clean background, high-end commercial look, realistic and polished`,
        `${basePrompt} - Lifestyle photography with natural lighting, authentic feel, modern composition, social media ready`,
        `${basePrompt} - Editorial style with dramatic lighting, artistic composition, magazine-quality, sophisticated`,
        `${basePrompt} - Minimalist style with clean lines, soft lighting, modern aesthetic, premium quality`,
      ];

      type MappedResult = { content: string; images: any[] };
      const promises: Array<Promise<MappedResult>> = enhancedPrompts.map(
        async (enhancedPrompt) => {
          const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              "HTTP-Referer":
                process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
              "X-Title": "SocialFlow Content Studio",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash-image-preview",
              messages: [
                {
                  role: "user",
                  content: [
                    {
                      type: "text",
                      text: `Generate 4 different enhanced variations of this image for social media content. Focus on: ${enhancedPrompt}. Create professional-quality variations with different lighting, composition, and styling. Return the variations as base64 encoded images in data:image/jpeg;base64, format.`,
                    },
                    {
                      type: "image_url",
                      image_url: {
                        url: imageUrl,
                      },
                    },
                  ],
                },
              ],
              max_tokens: 1000,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.log(`OpenRouter API Error ${response.status}:`, errorText);

            // Log error to file
            this.logToFile("openrouter-error.json", {
              status: response.status,
              errorText: errorText,
              prompt: enhancedPrompt,
              imageUrl: imageUrl,
              model: "google/gemini-2.5-flash-image-preview",
            });

            throw new Error(
              `OpenRouter API error: ${response.status} - ${errorText}`
            );
          }

          const data: OpenRouterResponse = await response.json();
          const message = (data.choices?.[0]?.message || {}) as any;
          const content: string = message?.content || "";
          const images: any[] = Array.isArray(message?.images)
            ? message.images
            : [];

          // Log complete response to file
          this.logToFile("openrouter-response.json", {
            prompt: enhancedPrompt,
            fullResponse: data,
            content: content,
            contentLength: content.length,
            containsBase64: content.includes("base64"),
            containsDataImage: content.includes("data:image"),
            imagesCount: images.length,
            model: "google/gemini-2.5-flash-image-preview",
          });

          console.log(
            `OpenRouter API Response for ${enhancedPrompt}:`,
            content
          );
          console.log(`Response length: ${content.length} characters`);
          console.log(`Contains base64: ${content.includes("base64")}`);
          console.log(`Contains data:image: ${content.includes("data:image")}`);
          return { content, images };
        }
      );

      const results = await Promise.all(promises);

      // Extract images from the API responses
      // Prefer message.images[]; fallback to parsing content text
      const variations: string[] = [];

      results.forEach(({ content, images }) => {
        // Helper to normalize any image_url shape
        const normalizeUrl = (val: any): string | null => {
          if (!val) return null;
          if (typeof val === "string") return val;
          if (typeof val === "object") {
            const candidate =
              val.url || val.base64 || val.data || val.src || null;
            return typeof candidate === "string" ? candidate : null;
          }
          return null;
        };

        // 1) Prefer explicit images array
        if (Array.isArray(images) && images.length > 0) {
          for (const img of images) {
            const urlCandidate = normalizeUrl(img?.image_url ?? img);
            if (typeof urlCandidate === "string") {
              if (urlCandidate.startsWith("data:image")) {
                variations.push(urlCandidate);
                continue;
              }
              if (
                /^https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(
                  urlCandidate
                )
              ) {
                variations.push(urlCandidate);
                continue;
              }
              if (/^[A-Za-z0-9+/]{100,}={0,2}$/.test(urlCandidate)) {
                variations.push(`data:image/jpeg;base64,${urlCandidate}`);
                continue;
              }
            }
          }
        }

        // 2) Fallback: parse from content text
        const base64Regex =
          /data:image\/(jpeg|jpg|png|gif|webp);base64,([A-Za-z0-9+/=]+)/g;
        const base64Matches = content.match(base64Regex);
        if (base64Matches && base64Matches.length > 0) {
          variations.push(...base64Matches);
          return;
        }
        const urlRegex = /https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|gif|webp|svg)/gi;
        const urls = content.match(urlRegex);
        if (urls && urls.length > 0) {
          variations.push(...urls);
          return;
        }
        const rawBase64Regex = /[A-Za-z0-9+/]{100,}={0,2}/g;
        const rawBase64Matches = content.match(rawBase64Regex);
        if (rawBase64Matches && rawBase64Matches.length > 0) {
          rawBase64Matches.forEach((match) => {
            if (match.length > 100) {
              variations.push(`data:image/jpeg;base64,${match}`);
            }
          });
        }
      });

      // If we got variations from the API, return them
      console.log(
        `Extracted ${variations.length} variations:`,
        variations.slice(0, 2)
      ); // Log first 2 for debugging
      if (variations.length > 0) {
        return variations.slice(0, 4); // Return up to 4 variations
      }

      // Fallback: return original image with different enhancement parameters
      return [
        `${imageUrl}?enhance=1&style=${style}`,
        `${imageUrl}?enhance=2&style=${style}`,
        `${imageUrl}?enhance=3&style=${style}`,
        `${imageUrl}?enhance=4&style=${style}`,
      ];
    } catch (error) {
      console.error("Error generating image variations:", error);

      // Log error to file
      this.logToFile("openrouter-catch-error.json", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        imageUrl: imageUrl,
        style: style,
        prompt: prompt,
        model: "google/gemini-2.5-flash-image-preview",
      });

      throw new Error("Failed to generate image variations");
    }
  }

  async analyzeImage(imageUrl: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error("OpenRouter API key not configured");
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          "X-Title": "SocialFlow Content Studio",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze this image and provide suggestions for enhancing it for social media content. Focus on lighting, composition, colors, and overall appeal. Suggest specific improvements that would make this image more engaging for social media platforms.",
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageUrl,
                  },
                },
              ],
            },
          ],
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data: OpenRouterResponse = await response.json();
      return data.choices[0]?.message?.content || "Unable to analyze image";
    } catch (error) {
      console.error("Error analyzing image:", error);
      throw new Error("Failed to analyze image");
    }
  }

  async generateContentFromImage(
    imageUrl: string,
    platform: string,
    topic?: string
  ): Promise<{
    caption: string;
    hashtags: string[];
    suggestions: string[];
  }> {
    if (!this.apiKey) {
      throw new Error("OpenRouter API key not configured");
    }

    try {
      const prompt = topic
        ? `Generate social media content for ${platform} based on this image. Topic: ${topic}. Create an engaging caption, relevant hashtags, and content suggestions.`
        : `Generate social media content for ${platform} based on this image. Create an engaging caption, relevant hashtags, and content suggestions.`;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          "X-Title": "SocialFlow Content Studio",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageUrl,
                  },
                },
              ],
            },
          ],
          max_tokens: 800,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data: OpenRouterResponse = await response.json();
      const content = data.choices[0]?.message?.content || "";

      // Parse the response to extract caption, hashtags, and suggestions
      const lines = content.split("\n").filter((line) => line.trim());
      const caption =
        lines.find((line) => !line.startsWith("#") && !line.startsWith("•")) ||
        "";
      const hashtags = lines
        .filter((line) => line.startsWith("#"))
        .map((tag) => tag.replace("#", ""));
      const suggestions = lines
        .filter((line) => line.startsWith("•"))
        .map((suggestion) => suggestion.replace("•", "").trim());

      return {
        caption: caption.trim(),
        hashtags,
        suggestions,
      };
    } catch (error) {
      console.error("Error generating content from image:", error);
      throw new Error("Failed to generate content from image");
    }
  }
}

export const openRouterService = new OpenRouterService();
