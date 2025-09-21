import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Handle legacy format where data might be directly in body
    const requestData = data || body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    if (type === "image") {
      const { base64, platform, additionalPrompt } = requestData;

      const prompt = `
You are an expert social media content creator. Analyze this image carefully and generate engaging content for ${platform.toUpperCase()}.

INSTRUCTIONS:
1. First, describe what you see in the image in detail
2. Identify the key elements, objects, people, settings, colors, mood, and atmosphere
3. Consider the context and potential story behind the image
4. Generate content that is SPECIFIC to what you observe in the image

Platform Guidelines:
- X/Twitter: Create a concise, engaging caption that complements the image. Use relevant hashtags. Keep it under 280 characters.
- LinkedIn: Write a professional caption that adds business value and encourages engagement. Focus on insights, lessons, or professional relevance.
- Instagram: Create an engaging, lifestyle-focused caption with emojis and relevant hashtags. Make it personal and relatable.

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

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64,
            mimeType: "image/jpeg",
          },
        },
      ]);

      const response = await result.response;
      const text = response.text();

      // Parse the JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json({
          content: parsed.content || "",
          hashtags: parsed.hashtags || [],
          callToAction: parsed.callToAction || "",
          suggestions: parsed.suggestions || [],
        });
      }

      return NextResponse.json({
        content: text,
        hashtags: [],
        callToAction: "",
        suggestions: [],
      });
    } else {
      // Regular text-based content generation
      const {
        platform,
        topic,
        tone,
        length,
        includeHashtags,
        includeCallToAction,
        imageDescription,
      } = requestData;

      const prompt = `
Generate engaging social media content for ${platform.toUpperCase()} with the following specifications:

Topic: ${topic}
Tone: ${tone}
Length: ${length}
${
  imageDescription
    ? `Image Description: ${imageDescription} - Make sure the content relates to and complements this image description.`
    : ""
}

Platform Guidelines:
- X/Twitter: Keep it concise, engaging, and conversational. Use relevant hashtags and mentions when appropriate.
- LinkedIn: Professional tone, industry insights, thought leadership. Focus on business value and networking.
- Instagram: Visual storytelling, lifestyle content, engaging captions. Use emojis and relevant hashtags.

Requirements:
- Create compelling, engaging content that resonates with the target audience
- Use appropriate tone and style for the platform
- ${includeHashtags ? "Include 3-5 relevant hashtags" : "No hashtags needed"}
- ${
        includeCallToAction
          ? "Include a clear call-to-action"
          : "No call-to-action needed"
      }
- Make it shareable and engaging
- Consider trending topics and current events if relevant
${
  imageDescription
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

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Try to parse JSON response first
      try {
        // Remove markdown code blocks if present
        let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          
          // Handle multi-platform response
          if (parsed['X/Twitter'] || parsed['LinkedIn'] || parsed['Instagram']) {
            return NextResponse.json(parsed);
          }
          
          // Handle single content response
          return NextResponse.json({
            content: parsed.content || cleanText,
            hashtags: parsed.hashtags || [],
            callToAction: parsed.callToAction || "",
            suggestions: parsed.suggestions || [],
          });
        }
      } catch (parseError) {
        console.log("JSON parsing failed, using raw text:", parseError);
      }

      // Fallback: return the raw text as content
      return NextResponse.json({
        content: text,
        hashtags: [],
        callToAction: "",
        suggestions: [],
      });
    }
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}

