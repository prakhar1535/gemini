import { NextRequest, NextResponse } from "next/server";
import { openRouterService } from "@/lib/services/openrouter";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, style, prompt } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Use OpenRouter API for actual image generation
    console.log(`Generating ${style} variations for image:`, imageUrl);
    
    try {
      const variations = await openRouterService.generateImageVariations(
        imageUrl,
        style,
        prompt
      );

      return NextResponse.json({
        success: true,
        variations,
        style: style || "general",
        prompt: prompt || "Enhanced image for social media",
        note: "Generated using OpenRouter API with Gemini 2.5 Flash Image Preview"
      });
    } catch (openRouterError) {
      console.log("OpenRouter failed, using fallback enhancement:", openRouterError);
      
      // Fallback to mock enhancement if OpenRouter fails
      await new Promise(resolve => setTimeout(resolve, 1000));

        // Create mock enhanced variations based on style
        // Using the original image with different filter parameters to simulate enhancement
        const variations = [];
        const baseUrl = imageUrl.split('?')[0]; // Remove any existing query parameters
        
        // Generate variations that use the original image with different enhancement parameters
        switch (style) {
          case "professional":
            variations.push(`${baseUrl}?enhance=professional&brightness=1.2&contrast=1.1&saturation=0.9&blur=0&sharpen=1.5`);
            variations.push(`${baseUrl}?enhance=professional&brightness=1.1&contrast=1.2&saturation=0.8&blur=0&sharpen=1.8`);
            variations.push(`${baseUrl}?enhance=professional&brightness=1.3&contrast=1.0&saturation=1.0&blur=0&sharpen=2.0`);
            break;
          case "lifestyle":
            variations.push(`${baseUrl}?enhance=lifestyle&brightness=1.1&contrast=1.1&saturation=1.2&blur=0.5&sharpen=1.0`);
            variations.push(`${baseUrl}?enhance=lifestyle&brightness=1.2&contrast=1.0&saturation=1.3&blur=0.3&sharpen=0.8`);
            variations.push(`${baseUrl}?enhance=lifestyle&brightness=1.0&contrast=1.1&saturation=1.4&blur=0.7&sharpen=1.2`);
            break;
          case "editorial":
            variations.push(`${baseUrl}?enhance=editorial&brightness=0.9&contrast=1.5&saturation=0.7&blur=0&sharpen=2.5`);
            variations.push(`${baseUrl}?enhance=editorial&brightness=0.8&contrast=1.6&saturation=0.6&blur=0&sharpen=3.0`);
            variations.push(`${baseUrl}?enhance=editorial&brightness=1.0&contrast=1.4&saturation=0.8&blur=0&sharpen=2.2`);
            break;
          case "minimalist":
            variations.push(`${baseUrl}?enhance=minimalist&brightness=1.1&contrast=0.9&saturation=0.5&blur=1.0&sharpen=0.5`);
            variations.push(`${baseUrl}?enhance=minimalist&brightness=1.2&contrast=0.8&saturation=0.4&blur=1.2&sharpen=0.3`);
            variations.push(`${baseUrl}?enhance=minimalist&brightness=1.0&contrast=1.0&saturation=0.6&blur=0.8&sharpen=0.7`);
            break;
          default:
            variations.push(imageUrl); // Return original if no style specified
        }

      return NextResponse.json({
        success: true,
        variations,
        style: style || "general",
        prompt: prompt || "Enhanced image for social media",
        note: "This is a demonstration using the original image with enhancement parameters. In production, integrate with DALL-E, Midjourney, or other AI image enhancement APIs to generate actual enhanced variations."
      });
    }

  } catch (error) {
    console.error("Error enhancing image:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to enhance image"
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('imageUrl');

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: "Image URL is required" },
        { status: 400 }
      );
    }

    if (!process.env.NEXT_PUBLIC_OPENROUTER_API_KEY) {
      return NextResponse.json(
        { success: false, error: "OpenRouter API key not configured" },
        { status: 500 }
      );
    }

    const analysis = await openRouterService.analyzeImage(imageUrl);
    
    return NextResponse.json({
      success: true,
      analysis,
    });

  } catch (error) {
    console.error("Error analyzing image:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to analyze image"
      },
      { status: 500 }
    );
  }
}
