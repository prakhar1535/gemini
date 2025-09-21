"use client";

import { useState, useRef, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
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
} from "lucide-react";
import { toast } from "sonner";
import { SocialMediaCards } from "@/components/social-media-cards";
import Image from "next/image";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
  timestamp: Date;
}

export default function CreateContentPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I&apos;m your AI content assistant. You can ask me to create social media content, upload images for enhancement, or get content suggestions. What would you like to create today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setUploadedImages((prev) => [...prev, imageUrl]);
          toast.success("Image uploaded successfully!");
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && uploadedImages.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      image: uploadedImages[uploadedImages.length - 1],
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Call the existing generate-content API
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: uploadedImages.length > 0 ? "image" : "text",
          data: uploadedImages.length > 0 ? {
            base64: uploadedImages[uploadedImages.length - 1].split(',')[1], // Remove data:image/jpeg;base64, prefix
            platform: "general",
            additionalPrompt: inputMessage || "Create engaging social media content for this image"
          } : {
            platform: "general",
            topic: inputMessage,
            tone: "friendly",
            length: "medium",
            includeHashtags: true,
            includeCallToAction: true,
            imageDescription: ""
          }
        }),
      });

      const data = await response.json();

      let responseContent = "";
      
      // Check if this is a multi-platform response (direct platform keys)
      if (data['X/Twitter'] || data['LinkedIn'] || data['Instagram']) {
        responseContent = "Here's your content for different platforms:\n\n";
        
        Object.entries(data).forEach(([platform, platformData]) => {
          if (typeof platformData === 'object' && platformData !== null) {
            const typedData = platformData as {
              content?: string;
              hashtags?: string[];
              callToAction?: string;
              suggestions?: string[];
            };
            responseContent += `📱 ${platform}:\n`;
            if (typedData.content) {
              responseContent += `${typedData.content}\n`;
            }
            if (typedData.hashtags && Array.isArray(typedData.hashtags)) {
              responseContent += `🏷️ Hashtags: ${typedData.hashtags.join(' ')}\n`;
            }
            if (typedData.callToAction) {
              responseContent += `🎯 Call-to-Action: ${typedData.callToAction}\n`;
            }
            if (typedData.suggestions && Array.isArray(typedData.suggestions)) {
              responseContent += `💡 Suggestions: ${typedData.suggestions.join(', ')}\n`;
            }
            responseContent += "\n";
          }
        });
      } else if (data.content) {
        // Handle single content response
        responseContent = data.content;
        if (data.hashtags && Array.isArray(data.hashtags)) {
          responseContent += "\n\n" + data.hashtags.join(" ");
        }
        if (data.callToAction) {
          responseContent += "\n\n" + data.callToAction;
        }
        if (data.suggestions && Array.isArray(data.suggestions)) {
          responseContent += "\n💡 Suggestions:\n" + data.suggestions.map((s: string) => "• " + s).join("\n");
        }
      } else {
        responseContent = "I've generated some content for you!";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setUploadedImages([]);
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // Helper functions to extract platform-specific content
  const extractPlatformContent = (text: string, platform: string): string => {
    const regex = new RegExp(`📱 ${platform}:\\s*([^📱🏷️🎯💡]+)`, 's');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  };

  const extractHashtags = (text: string, _platform: string): string[] => {
    const regex = new RegExp(`🏷️ Hashtags: (.+?)(?=🎯|💡|$)`, 's');
    const match = text.match(regex);
    if (match) {
      return match[1].split(/\s+/).filter(tag => tag.startsWith('#'));
    }
    return [];
  };

  const extractCallToAction = (text: string, _platform: string): string => {
    const regex = new RegExp(`🎯 Call-to-Action: (.+?)(?=💡|$)`, 's');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  };

  const extractSuggestions = (text: string, _platform: string): string[] => {
    const regex = new RegExp(`💡 Suggestions: (.+?)(?=📱|$)`, 's');
    const match = text.match(regex);
    if (match) {
      return match[1].split(/[,•]/).map(s => s.trim()).filter(s => s.length > 0);
    }
    return [];
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Hi! I&apos;m your AI content assistant. You can ask me to create social media content, upload images for enhancement, or get content suggestions. What would you like to create today?",
        timestamp: new Date(),
      },
    ]);
    setUploadedImages([]);
    toast.success("Chat cleared!");
  };

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-8rem)] flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h1 className="text-2xl font-bold">Content Creator</h1>
            <p className="text-muted-foreground">
              Chat with AI to create amazing social media content
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={clearChat}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Chat
            </Button>
            <Button asChild>
              <a href="/content-studio">
                <Camera className="h-4 w-4 mr-2" />
                Content Studio
              </a>
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback>
                      {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <Card className={`ml-3 mr-3 ${message.role === "user" ? "bg-primary text-primary-foreground" : ""}`}>
                    <CardContent className="p-4">
                      {message.image && (
                        <div className="mb-3">
                          <Image
                            src={message.image}
                            alt="Uploaded content"
                            width={200}
                            height={200}
                            className="rounded-lg object-cover"
                          />
                        </div>
                      )}
                      {/* Check if this is multi-platform content */}
                      {message.role === "assistant" && message.content.includes("Here's your content for different platforms:") ? (
                        <div className="space-y-4">
                          <div className="text-sm text-gray-600 mb-4">
                            Here&apos;s your content for different platforms:
                          </div>
                          <SocialMediaCards platforms={{
                            "Instagram": message.content.includes("📱 Instagram:") ? {
                              content: extractPlatformContent(message.content, "Instagram"),
                              hashtags: extractHashtags(message.content, "Instagram"),
                              callToAction: extractCallToAction(message.content, "Instagram"),
                              suggestions: extractSuggestions(message.content, "Instagram")
                            } : undefined,
                            "X/Twitter": message.content.includes("📱 X/Twitter:") ? {
                              content: extractPlatformContent(message.content, "X/Twitter"),
                              hashtags: extractHashtags(message.content, "X/Twitter"),
                              callToAction: extractCallToAction(message.content, "X/Twitter"),
                              suggestions: extractSuggestions(message.content, "X/Twitter")
                            } : undefined,
                            "LinkedIn": message.content.includes("📱 LinkedIn:") ? {
                              content: extractPlatformContent(message.content, "LinkedIn"),
                              hashtags: extractHashtags(message.content, "LinkedIn"),
                              callToAction: extractCallToAction(message.content, "LinkedIn"),
                              suggestions: extractSuggestions(message.content, "LinkedIn")
                            } : undefined
                          }} />
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      )}
                      
                      {message.role === "assistant" && !message.content.includes("Here's your content for different platforms:") && (
                        <div className="mt-3 flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(message.content)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <Card className="ml-3">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>AI is thinking...</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Uploaded Images Preview */}
        {uploadedImages.length > 0 && (
          <div className="p-4 border-t bg-muted/50">
            <div className="flex items-center space-x-2 mb-2">
              <ImageIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Uploaded Images:</span>
            </div>
            <div className="flex space-x-2">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    src={image}
                    alt={`Uploaded ${index + 1}`}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-6 border-t">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message... (e.g., 'Create a post about sustainable living' or 'Enhance this image for Instagram')"
                className="flex-1"
                disabled={isLoading}
              />
              
              <Button 
                onClick={handleSendMessage}
                disabled={isLoading || (!inputMessage.trim() && uploadedImages.length === 0)}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
              <Badge variant="outline" className="text-xs">
                Upload images for enhancement
              </Badge>
              <Badge variant="outline" className="text-xs">
                Multi-platform content
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}