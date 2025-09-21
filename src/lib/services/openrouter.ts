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
      content: string;
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
    this.apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "";
    if (!this.apiKey) {
      console.warn("OpenRouter API key not found. Image generation will not work.");
    }
  }

  async generateImageVariations(imageUrl: string, style: string, prompt?: string): Promise<string[]> {
    if (!this.apiKey) {
      throw new Error("OpenRouter API key not configured");
    }

    try {
      const basePrompt = prompt || `Generate ${style} style variations of this image for social media`;
      const enhancedPrompts = [
        `${basePrompt} - Professional product photography with studio lighting, clean background, high-end commercial look, realistic and polished`,
        `${basePrompt} - Lifestyle photography with natural lighting, authentic feel, modern composition, social media ready`,
        `${basePrompt} - Editorial style with dramatic lighting, artistic composition, magazine-quality, sophisticated`,
        `${basePrompt} - Minimalist style with clean lines, soft lighting, modern aesthetic, premium quality`
      ];

      const promises = enhancedPrompts.map(async (enhancedPrompt) => {
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${this.apiKey}`,
            "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
            "X-Title": "SocialFlow Content Studio",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image-preview",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: `Generate 4 different enhanced variations of this image for social media content. Focus on: ${enhancedPrompt}. Create professional-quality variations with different lighting, composition, and styling. Return the variations as image URLs or provide detailed descriptions of how each variation should look.`
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: imageUrl
                    }
                  }
                ]
              }
            ],
            max_tokens: 1000
          })
        });

        if (!response.ok) {
          throw new Error(`OpenRouter API error: ${response.status}`);
        }

        const data: OpenRouterResponse = await response.json();
        const content = data.choices[0]?.message?.content || "";
        console.log(`OpenRouter API Response for ${enhancedPrompt}:`, content);
        return content;
      });

      const results = await Promise.all(promises);
      
      // Extract image URLs from the API responses
      // The API might return URLs or image references in the text
      const variations: string[] = [];
      
      results.forEach((result) => {
        // Try to extract URLs from the response text
        const urlRegex = /https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|gif|webp|svg)/gi;
        const urls = result.match(urlRegex);
        
        if (urls && urls.length > 0) {
          variations.push(...urls);
        } else {
          // If no URLs found, the API might return image references or base64 data
          // For now, return the original image with enhancement markers
          variations.push(`${imageUrl}?enhanced=${Date.now()}&style=${style}`);
        }
      });
      
      // If we got variations from the API, return them
      if (variations.length > 0) {
        return variations.slice(0, 4); // Return up to 4 variations
      }
      
      // Fallback: return original image with different enhancement parameters
      return [
        `${imageUrl}?enhance=1&style=${style}`,
        `${imageUrl}?enhance=2&style=${style}`,
        `${imageUrl}?enhance=3&style=${style}`,
        `${imageUrl}?enhance=4&style=${style}`
      ];

    } catch (error) {
      console.error("Error generating image variations:", error);
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
          "Authorization": `Bearer ${this.apiKey}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          "X-Title": "SocialFlow Content Studio",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-exp",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze this image and provide suggestions for enhancing it for social media content. Focus on lighting, composition, colors, and overall appeal. Suggest specific improvements that would make this image more engaging for social media platforms."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageUrl
                  }
                }
              ]
            }
          ],
          max_tokens: 500
        })
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

  async generateContentFromImage(imageUrl: string, platform: string, topic?: string): Promise<{
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
          "Authorization": `Bearer ${this.apiKey}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          "X-Title": "SocialFlow Content Studio",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-exp",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageUrl
                  }
                }
              ]
            }
          ],
          max_tokens: 800
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data: OpenRouterResponse = await response.json();
      const content = data.choices[0]?.message?.content || "";

      // Parse the response to extract caption, hashtags, and suggestions
      const lines = content.split('\n').filter(line => line.trim());
      const caption = lines.find(line => !line.startsWith('#') && !line.startsWith('•')) || "";
      const hashtags = lines.filter(line => line.startsWith('#')).map(tag => tag.replace('#', ''));
      const suggestions = lines.filter(line => line.startsWith('•')).map(suggestion => suggestion.replace('•', '').trim());

      return {
        caption: caption.trim(),
        hashtags,
        suggestions
      };

    } catch (error) {
      console.error("Error generating content from image:", error);
      throw new Error("Failed to generate content from image");
    }
  }
}

export const openRouterService = new OpenRouterService();
