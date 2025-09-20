# SocialFlow - AI Content Generation Platform

A comprehensive content generation platform for X (Twitter), LinkedIn, and Instagram with AI-powered content creation, scheduling, and posting capabilities.

![SocialFlow Dashboard](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=SocialFlow+Dashboard)

## ✨ Features

- 🤖 **AI Content Generation**: Powered by Gemini 2.5 Flash for intelligent content creation
- 📱 **Multi-Platform Support**: Create content for X, LinkedIn, and Instagram
- 🖼️ **Image-to-Content**: Generate engaging posts from uploaded images
- 📅 **Post Scheduling**: Schedule posts across all platforms with ease
- 📊 **Analytics Dashboard**: Track performance and engagement metrics
- 🎨 **Beautiful UI**: Blue-white theme with Apple design system and Poppins font
- ⚡ **Real-time Generation**: Fast AI-powered content creation
- 🔄 **Content Templates**: Pre-built templates for different content types
- 👥 **Team Collaboration**: Share and collaborate on content creation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Gemini API key

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd khojtest
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Add your API keys to `.env.local`:

   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **AI**: Google Gemini 2.5 Flash
- **Icons**: Lucide React
- **Font**: Poppins (Google Fonts)
- **State Management**: React Hooks
- **Notifications**: Sonner

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── create/            # Content creation page
│   ├── schedule/          # Post scheduling page
│   ├── analytics/         # Analytics dashboard
│   ├── settings/          # Settings page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Dashboard home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── layout/           # Layout components (Sidebar, Header, MainLayout)
└── lib/                  # Utility functions and services
    ├── gemini.ts         # Gemini AI service
    └── utils.ts          # Utility functions
```

## 🎯 Key Features

### Content Generation

- **AI-Powered**: Uses Gemini 2.5 Flash for intelligent content creation
- **Platform-Specific**: Tailored content for X, LinkedIn, and Instagram
- **Customizable**: Choose tone, length, and style preferences
- **Image Support**: Generate content from uploaded images

### Post Scheduling

- **Multi-Platform**: Schedule posts across all connected platforms
- **Flexible Timing**: Choose date and time for optimal engagement
- **Bulk Operations**: Manage multiple posts efficiently
- **Status Tracking**: Monitor scheduled, published, and failed posts

### Analytics Dashboard

- **Performance Metrics**: Track reach, engagement, and follower growth
- **Platform Comparison**: Compare performance across platforms
- **Top Posts**: Identify your best-performing content
- **Export Reports**: Download analytics data

### Settings & Configuration

- **Account Management**: Connect and manage social media accounts
- **API Keys**: Secure storage of third-party API keys
- **Notifications**: Customizable notification preferences
- **Appearance**: Theme and language customization

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Gemini AI API Key (Required)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Social Media API Keys (Optional - for posting functionality)
TWITTER_API_KEY=your_twitter_api_key_here
TWITTER_API_SECRET=your_twitter_api_secret_here
TWITTER_ACCESS_TOKEN=your_twitter_access_token_here
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret_here

LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here

INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token_here
```

### Getting API Keys

1. **Gemini API Key**

   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env.local` file

2. **Social Media API Keys**
   - **Twitter/X**: [Twitter Developer Portal](https://developer.twitter.com/)
   - **LinkedIn**: [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
   - **Instagram**: [Facebook Developers](https://developers.facebook.com/)

## 🎨 Design System

### Color Palette

- **Primary**: Blue (#3B82F6)
- **Secondary**: Light Blue (#EFF6FF)
- **Background**: White (#FFFFFF)
- **Text**: Dark Gray (#1F2937)
- **Muted**: Light Gray (#F9FAFB)

### Typography

- **Font Family**: Poppins (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Apple Design System**: Clean, minimal, and user-friendly

### Components

- Built with shadcn/ui for consistency
- Responsive design for all screen sizes
- Accessible components with proper ARIA labels
- Smooth animations and transitions

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Google Gemini](https://ai.google.dev/) for the AI capabilities
- [Lucide](https://lucide.dev/) for the beautiful icons

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Check the documentation
- Contact the development team

---

Made with ❤️ by the SocialFlow team
