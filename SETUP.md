# SocialFlow - AI Content Generation Platform

A comprehensive content generation platform for X (Twitter), LinkedIn, and Instagram with AI-powered content creation, scheduling, and posting capabilities.

## Features

- 🤖 **AI Content Generation**: Powered by Gemini 2.5 Flash
- 📱 **Multi-Platform Support**: X, LinkedIn, and Instagram
- 🖼️ **Image-to-Content**: Generate content from uploaded images
- 📅 **Post Scheduling**: Schedule posts across all platforms
- 📊 **Analytics Dashboard**: Track performance and engagement
- 🎨 **Beautiful UI**: Blue-white theme with Apple design system
- ⚡ **Real-time Generation**: Fast AI-powered content creation

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Gemini AI API Key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Social Media API Keys (for posting functionality)
TWITTER_API_KEY=your_twitter_api_key_here
TWITTER_API_SECRET=your_twitter_api_secret_here
TWITTER_ACCESS_TOKEN=your_twitter_access_token_here
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret_here

LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here

INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token_here

# Database (if needed)
DATABASE_URL=your_database_url_here
```

### 3. Get API Keys

#### Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file

#### Social Media API Keys

- **Twitter/X**: [Twitter Developer Portal](https://developer.twitter.com/)
- **LinkedIn**: [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
- **Instagram**: [Facebook Developers](https://developers.facebook.com/)

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── create/            # Content creation page
│   ├── schedule/          # Post scheduling page
│   ├── analytics/         # Analytics dashboard
│   └── settings/          # Settings page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── layout/           # Layout components
└── lib/                  # Utility functions and services
    ├── gemini.ts         # Gemini AI service
    └── utils.ts          # Utility functions
```

## Technologies Used

- **Next.js 15**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **shadcn/ui**: UI components
- **Gemini 2.5 Flash**: AI content generation
- **Lucide React**: Icons
- **Poppins Font**: Typography

## Features in Development

- [ ] Real-time content generation with Gemini API
- [ ] Image upload and processing
- [ ] Post scheduling and automation
- [ ] Social media API integration
- [ ] Analytics and reporting
- [ ] User authentication
- [ ] Content templates
- [ ] Team collaboration features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

