"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal, 
  ThumbsUp, 
  Send,
  Copy,
  Download
} from "lucide-react";
import { toast } from "sonner";

interface PlatformData {
  content: string;
  hashtags: string[];
  callToAction: string;
  suggestions: string[];
}

interface SocialMediaCardsProps {
  platforms: {
    "X/Twitter"?: PlatformData;
    "LinkedIn"?: PlatformData;
    "Instagram"?: PlatformData;
  };
}

export function SocialMediaCards({ platforms }: SocialMediaCardsProps) {
  const copyContent = (content: string, platform: string) => {
    navigator.clipboard.writeText(content);
    toast.success(`${platform} content copied!`);
  };

  const downloadContent = (content: string, platform: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${platform.toLowerCase()}-content.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`${platform} content downloaded!`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Instagram Card */}
      {platforms["Instagram"] && (
        <Card className="w-full w-full bg-white border border-gray-200 shadow-lg">
          <div className="p-4">
            {/* Instagram Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">socialflow.ai</p>
                  <p className="text-xs text-gray-500">Sponsored</p>
                </div>
              </div>
              <MoreHorizontal className="h-5 w-5 text-gray-600" />
            </div>

            {/* Instagram Post Content */}
            <div className="mb-3">
              <p className="text-sm leading-relaxed">
                {platforms["Instagram"].content.split('\n')[0]}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {platforms["Instagram"].hashtags.slice(0, 6).map((tag, index) => (
                  <span key={index} className="text-blue-600 text-sm">#{tag.replace('#', '')}</span>
                ))}
              </div>
            </div>

            {/* Instagram Actions */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <Heart className="h-6 w-6 text-gray-700" />
                <MessageCircle className="h-6 w-6 text-gray-700" />
                <Share2 className="h-6 w-6 text-gray-700" />
              </div>
              <Bookmark className="h-6 w-6 text-gray-700" />
            </div>

            <div className="text-sm text-gray-700 mb-3">
              <span className="font-semibold">socialflow.ai</span> {platforms["Instagram"].callToAction}
            </div>

            {/* Instagram Action Buttons */}
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => copyContent(platforms["Instagram"]!.content, "Instagram")}
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => downloadContent(platforms["Instagram"]!.content, "Instagram")}
              >
                <Download className="h-3 w-3 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Twitter/X Card */}
      {platforms["X/Twitter"] && (
        <Card className="w-full w-full bg-black border border-gray-800 text-white">
          <div className="p-4">
            {/* Twitter Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-black text-xs font-bold">AI</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">SocialFlow AI</p>
                  <p className="text-xs text-gray-400">@socialflow_ai</p>
                </div>
              </div>
              <MoreHorizontal className="h-5 w-5 text-gray-400" />
            </div>

            {/* Twitter Post Content */}
            <div className="mb-4">
              <p className="text-sm leading-relaxed">
                {platforms["X/Twitter"].content}
              </p>
            </div>

            {/* Twitter Actions */}
            <div className="flex items-center justify-between text-gray-400 text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-5 w-5" />
                  <span>12</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Share2 className="h-5 w-5" />
                  <span>8</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="h-5 w-5" />
                  <span>24</span>
                </div>
              </div>
            </div>

            {/* Twitter Action Buttons */}
            <div className="flex space-x-2 mt-3">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 bg-transparent border-gray-600 text-white hover:bg-gray-800"
                onClick={() => copyContent(platforms["X/Twitter"]!.content, "X/Twitter")}
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
                onClick={() => downloadContent(platforms["X/Twitter"]!.content, "X/Twitter")}
              >
                <Download className="h-3 w-3 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* LinkedIn Card */}
      {platforms["LinkedIn"] && (
        <Card className="w-full w-full bg-white border border-gray-200 shadow-lg">
          <div className="p-4">
            {/* LinkedIn Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">SocialFlow AI</p>
                  <p className="text-xs text-gray-500">Content Creator • 2h</p>
                </div>
              </div>
              <MoreHorizontal className="h-5 w-5 text-gray-600" />
            </div>

            {/* LinkedIn Post Content */}
            <div className="mb-4">
              <p className="text-sm leading-relaxed text-gray-800">
                {platforms["LinkedIn"].content}
              </p>
            </div>

            {/* LinkedIn Actions */}
            <div className="flex items-center justify-between text-gray-600 text-sm border-t border-gray-100 pt-3">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <ThumbsUp className="h-5 w-5" />
                  <span>Like</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-5 w-5" />
                  <span>Comment</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Send className="h-5 w-5" />
                  <span>Send</span>
                </div>
              </div>
            </div>

            {/* LinkedIn Action Buttons */}
            <div className="flex space-x-2 mt-3">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => copyContent(platforms["LinkedIn"]!.content, "LinkedIn")}
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => downloadContent(platforms["LinkedIn"]!.content, "LinkedIn")}
              >
                <Download className="h-3 w-3 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
