"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Image as ImageIcon,
  Paperclip,
  Sparkles,
  User,
  Bot,
  Download,
  Copy,
  Trash2,
  Camera,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { SocialMediaCards } from "@/components/social-media-cards";
import { VideoOverlay } from "@/components/video-overlay";
import { InstagramVideoPlayer } from "@/components/instagram-video-player";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
  timestamp: Date;
}

export function CreateContentClient() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your AI content assistant. You can ask me to create social media content, upload images for enhancement, or get content suggestions. What would you like to create today?\n\n💡 **Note**: Make sure you have your Gemini API key configured in your `.env.local` file for content generation to work properly. Check the ENVIRONMENT_SETUP.md file for setup instructions.",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [showVideoOverlay, setShowVideoOverlay] = useState(false);
  const [videoQuery, setVideoQuery] = useState("art tutorial");
  const [showInstagramPlayer, setShowInstagramPlayer] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{
    id: string;
    title: string;
    thumbnail: string;
    views: number;
    likes: number;
    comments: number;
    publishedAt: string;
    channelTitle: string;
    description: string;
    duration: string;
    overlay: {
      likes: number;
      comments: number;
      views: number;
      commentsList: Array<{
        author: string;
        text: string;
        likes: number;
        timeAgo: string;
      }>;
    };
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageUrl = e.target?.result as string;
            setUploadedImages((prev) => [...prev, imageUrl]);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && uploadedImages.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      image: uploadedImages[0], // For simplicity, just use the first image
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setUploadedImages([]);
    setIsLoading(true);

    try {
      // Call the real content generation API
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: uploadedImages.length > 0 ? "image" : "text",
          data:
            uploadedImages.length > 0
              ? {
                  base64: uploadedImages[0].split(",")[1], // Remove data:image/... prefix
                  platform: "instagram", // Default platform
                  additionalPrompt: currentInput,
                }
              : {
                  topic: currentInput,
                  platform: "multi", // Request content for all platforms
                  tone: "engaging",
                  length: "medium",
                  includeHashtags: true,
                  includeCallToAction: true,
                },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error?.includes("API key")) {
          throw new Error("API key not configured");
        }
        throw new Error("Failed to generate content");
      }

      const data = await response.json();

      // Handle different response formats
      let content = "";
      let hashtags = [];
      let callToAction = "";

      if (data.content) {
        // Single content response
        content = data.content;
        hashtags = data.hashtags || [];
        callToAction = data.callToAction || "";
      } else if (data["Instagram"] || data["X/Twitter"] || data["LinkedIn"]) {
        // Multi-platform response - combine all platforms
        const platforms = [];
        if (data["Instagram"])
          platforms.push(`Instagram: ${data["Instagram"].content}`);
        if (data["X/Twitter"])
          platforms.push(`Twitter: ${data["X/Twitter"].content}`);
        if (data["LinkedIn"])
          platforms.push(`LinkedIn: ${data["LinkedIn"].content}`);
        content = platforms.join("\n\n");
      } else {
        // Fallback
        content = JSON.stringify(data, null, 2);
      }

      // Format the final content
      let finalContent = content;
      if (hashtags.length > 0) {
        finalContent += `\n\nHashtags: ${hashtags.join(" ")}`;
      }
      if (callToAction) {
        finalContent += `\n\nCall to Action: ${callToAction}`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: finalContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Content generation error:", error);

      let errorContent = "Sorry, I couldn't generate content right now. ";

      // Check if it's an API key issue
      if (error instanceof Error && error.message.includes("API key")) {
        errorContent +=
          "Please check if the Gemini API key is configured in your environment variables. ";
        toast.error(
          "API key not configured. Please check your .env.local file."
        );

        // Show demo content when API key is missing
        const demoMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `**Demo Content for "${currentInput}":**

**Instagram:**
🌟 Just discovered something amazing about ${currentInput}! The way it connects with our daily lives is truly inspiring. Every moment is a chance to learn and grow! ✨

**X/Twitter:**
Just had an incredible insight about ${currentInput}! Sometimes the simplest things teach us the most profound lessons. What's your take on this? 🤔

**LinkedIn:**
Professional insight: ${currentInput} represents a key opportunity for growth in our industry. The data shows significant potential for innovation and development.

*Note: This is demo content. Configure your Gemini API key to get real AI-generated content.*`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, demoMessage]);
        return;
      } else {
        toast.error("Failed to generate content");
      }

      errorContent += "Please try again or check your internet connection.";

      // Show error message in chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: errorContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "Hi! I'm your AI content assistant. You can ask me to create social media content, upload images for enhancement, or get content suggestions. What would you like to create today?\n\n💡 **Note**: Make sure you have your Gemini API key configured in your `.env.local` file for content generation to work properly. Check the ENVIRONMENT_SETUP.md file for setup instructions.",
        timestamp: new Date(),
      },
    ]);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Content copied to clipboard");
  };

  const handleSave = (_content: string) => {
    // In a real app, this would save to a database
    toast.success("Content saved successfully");
  };

  const handleVideoClick = (query: string) => {
    setVideoQuery(query);
    setShowVideoOverlay(true);
  };

  const handleInstagramStyleVideo = () => {
    // Create a mock video for demonstration
    const mockVideo = {
      id: "demo",
      title: "AI-Generated Art Tutorial - Digital Painting",
      thumbnail: "/gallery-assets/artworks/5.jpg",
      views: 25420,
      likes: 1292,
      comments: 256,
      publishedAt: "2024-01-20",
      channelTitle: "AI Art Studio",
      description:
        "Learn how to create stunning digital art using AI-assisted techniques.",
      duration: "15:30",
      overlay: {
        likes: 1292,
        comments: 256,
        views: 25420,
        commentsList: [
          {
            author: "DigitalArtist",
            text: "This AI technique is revolutionary! Can't wait to try it myself.",
            likes: 23,
            timeAgo: "1m",
          },
          {
            author: "ArtTech",
            text: "Amazing how AI can enhance our creative process. Great tutorial!",
            likes: 18,
            timeAgo: "3m",
          },
          {
            author: "CreativeAI",
            text: "The results are incredible. This changes everything!",
            likes: 31,
            timeAgo: "5m",
          },
        ],
      },
    };
    setSelectedVideo(mockVideo);
    setShowInstagramPlayer(true);
  };

  const getLatestGeneratedContent = () => {
    // Find the latest assistant message with generated content
    const latestAssistantMessage = messages
      .filter((msg) => msg.role === "assistant" && msg.id !== "1") // Exclude initial welcome message
      .pop();

    if (!latestAssistantMessage) {
      return {};
    }

    // Parse the content to extract platform-specific content
    const content = latestAssistantMessage.content;

    // Try to extract platform-specific content
    const platforms: Record<
      string,
      {
        content: string;
        hashtags: string;
        callToAction: string;
      }
    > = {};

    if (content.includes("Instagram:")) {
      const instagramMatch = content.match(/Instagram:\s*([^]+?)(?=\n\n|$)/);
      if (instagramMatch) {
        platforms.Instagram = {
          content: instagramMatch[1].trim(),
          hashtags: extractHashtags(content),
          callToAction: extractCallToAction(content),
          suggestions: [],
        };
      }
    }

    if (content.includes("Twitter:")) {
      const twitterMatch = content.match(/Twitter:\s*([^]+?)(?=\n\n|$)/);
      if (twitterMatch) {
        platforms["X/Twitter"] = {
          content: twitterMatch[1].trim(),
          hashtags: extractHashtags(content),
          callToAction: extractCallToAction(content),
          suggestions: [],
        };
      }
    }

    if (content.includes("LinkedIn:")) {
      const linkedinMatch = content.match(/LinkedIn:\s*([^]+?)(?=\n\n|$)/);
      if (linkedinMatch) {
        platforms.LinkedIn = {
          content: linkedinMatch[1].trim(),
          hashtags: extractHashtags(content),
          callToAction: extractCallToAction(content),
          suggestions: [],
        };
      }
    }

    // If no platform-specific content found, use the general content
    if (Object.keys(platforms).length === 0) {
      platforms.Instagram = {
        content: content.split("\n\n")[0] || content,
        hashtags: extractHashtags(content),
        callToAction: extractCallToAction(content),
        suggestions: [],
      };
    }

    return platforms;
  };

  const extractHashtags = (content: string) => {
    const hashtagMatch = content.match(/Hashtags:\s*([^\n]+)/);
    if (hashtagMatch) {
      return hashtagMatch[1].split(" ").filter((tag) => tag.startsWith("#"));
    }
    return [];
  };

  const extractCallToAction = (content: string) => {
    const ctaMatch = content.match(/Call to Action:\s*([^\n]+)/);
    return ctaMatch ? ctaMatch[1].trim() : "";
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("create_content.title")}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t("create_content.subtitle")}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleVideoClick("art tutorial painting")}
          >
            <Camera className="h-4 w-4 mr-2" />
            View Videos
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleInstagramStyleVideo}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Instagram Style
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearChat}>
            <Trash2 className="h-4 w-4 mr-2" />
            {t("create_content.clear_chat")}
          </Button>
          <Button size="sm" asChild>
            <a href="/content-studio">
              <Camera className="h-4 w-4 mr-2" />
              {t("create_content.content_studio")}
            </a>
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 min-h-0">
        {/* Chat Interface */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <Card className="flex-1 flex flex-col min-h-0 max-h-full">
            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
              <ScrollArea className="flex-1 p-4 max-h-[calc(90vh-200px)]">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex max-w-[80%] ${
                          message.role === "user"
                            ? "flex-row-reverse"
                            : "flex-row"
                        }`}
                      >
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback>
                            {message.role === "user" ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Bot className="h-4 w-4" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`ml-3 mr-3 ${
                            message.role === "user" ? "ml-0 mr-3" : "mr-0 ml-3"
                          }`}
                        >
                          <div
                            className={`rounded-lg p-3 max-w-full ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {message.image && (
                              <div className="mb-2">
                                <Image
                                  src={message.image}
                                  alt="Uploaded"
                                  width={200}
                                  height={200}
                                  className="rounded-lg object-cover"
                                />
                              </div>
                            )}
                            <div className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere">
                              {message.content}
                            </div>
                          </div>
                          {message.role === "assistant" && (
                            <div className="flex items-center space-x-2 mt-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCopy(message.content)}
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                {t("create_content.copy")}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSave(message.content)}
                              >
                                <Download className="h-3 w-3 mr-1" />
                                {t("create_content.save")}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <div className="bg-muted rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-sm">
                                Generating content...
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area - Fixed Height */}
              <div className="border-t p-4 bg-background flex-shrink-0">
                {uploadedImages.length > 0 && (
                  <div className="mb-3 flex space-x-2 overflow-x-auto">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative flex-shrink-0">
                        <Image
                          src={image}
                          alt={`Uploaded ${index + 1}`}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-5 w-5 p-0"
                          onClick={() =>
                            setUploadedImages((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Input
                    placeholder={t("create_content.type_message")}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={isLoading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2 mt-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {t("create_content.ai_powered")}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <ImageIcon className="h-3 w-3 mr-1" />
                    {t("create_content.upload_images")}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {t("create_content.multi_platform")}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Social Media Cards */}
        <div className="lg:col-span-1 flex flex-col min-h-0 max-h-[calc(100vh-120px)]">
          <SocialMediaCards platforms={getLatestGeneratedContent()} />
        </div>
      </div>

      {/* Video Overlay Modal */}
      <VideoOverlay
        isOpen={showVideoOverlay}
        onClose={() => setShowVideoOverlay(false)}
        query={videoQuery}
      />

      {/* Instagram-Style Video Player */}
      <InstagramVideoPlayer
        isOpen={showInstagramPlayer}
        onClose={() => {
          setShowInstagramPlayer(false);
          setSelectedVideo(null);
        }}
        video={selectedVideo}
      />
    </div>
  );
}
