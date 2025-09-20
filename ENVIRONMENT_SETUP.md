# Environment Setup Guide

## Required Environment Variables

To use the AI-powered content generation features, you need to set up the following environment variables:

### 1. Create `.env.local` file

Create a `.env.local` file in the root directory of your project:

```bash
touch .env.local
```

### 2. Add Gemini API Key

Add your Gemini API key to the `.env.local` file:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Paste it into your `.env.local` file

### 4. Restart Your Development Server

After adding the environment variable, restart your development server:

```bash
npm run dev
```

## How It Works

### Image-to-Content Generation

When you upload an image and click "Generate Content from Image", the system:

1. **Analyzes the Image**: Uses Gemini's multimodal AI to understand what's in the image
2. **Identifies Key Elements**: Recognizes objects, people, settings, colors, mood, and atmosphere
3. **Generates Specific Content**: Creates platform-specific content that directly relates to what's in the image
4. **Provides Context**: Includes relevant hashtags and call-to-actions based on the image content

### Platform-Specific Content

The AI generates content tailored for each platform:

- **X (Twitter)**: Concise, engaging captions under 280 characters with relevant hashtags
- **LinkedIn**: Professional content with business value and networking focus
- **Instagram**: Lifestyle-focused content with emojis and engaging captions

### Example Output

For an image of a sunset over mountains, the AI might generate:

**Content**: "Witnessed this breathtaking sunset over the mountain peaks today! 🌅 Nature never fails to amaze with its daily masterpiece. The golden hour light painting the sky in shades of orange and pink is pure magic."

**Hashtags**: #sunset #mountains #nature #goldenhour #photography #landscape

**Call to Action**: "What's your favorite time of day to capture nature's beauty? Share your golden hour photos below!"

## Troubleshooting

### API Key Issues

If you see "Gemini API key not configured" error:

1. Check that your `.env.local` file exists in the project root
2. Verify the API key is correctly formatted
3. Restart your development server
4. Make sure there are no extra spaces or quotes around the API key

### Content Generation Issues

If content generation fails:

1. Check your internet connection
2. Verify your API key is valid and has sufficient quota
3. Try with a different image or topic
4. Check the browser console for detailed error messages

### Image Upload Issues

If image upload fails:

1. Ensure the image is under 10MB
2. Check that the file is a valid image format (PNG, JPG, GIF)
3. Try with a different image file

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your API keys secure and don't share them publicly
- The API key is used server-side for security

## Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify your environment variables are set correctly
3. Ensure you have a valid Gemini API key with sufficient quota
4. Try refreshing the page and attempting again

