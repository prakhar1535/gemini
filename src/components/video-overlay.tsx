"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Heart,
  MessageCircle,
  Eye,
  ThumbsUp,
  Play,
  X,
  Clock,
  User,
} from "lucide-react";
import Image from "next/image";
import { InstagramVideoPlayer } from "./instagram-video-player";

interface VideoComment {
  author: string;
  text: string;
  likes: number;
  timeAgo: string;
}

interface VideoOverlay {
  likes: number;
  comments: number;
  views: number;
  commentsList: VideoComment[];
}

interface YouTubeVideo {
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
  overlay: VideoOverlay;
}

interface VideoOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  query?: string;
}

export function VideoOverlay({
  isOpen,
  onClose,
  query = "art tutorial",
}: VideoOverlayProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [showInstagramPlayer, setShowInstagramPlayer] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchVideos();
    }
  }, [isOpen, query]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/youtube/videos?q=${encodeURIComponent(query)}&maxResults=6`
      );
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-red-500" />
            YouTube Videos - {query}
          </DialogTitle>
          <DialogDescription>
            Discover relevant videos with real-time engagement data
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <Card
                key={video.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300"
                onClick={() => {
                  setSelectedVideo(video);
                  setShowInstagramPlayer(true);
                }}
              >
                <CardContent className="p-0">
                  {/* Video Thumbnail with Overlay */}
                  <div className="relative">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      width={400}
                      height={225}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-red-600 rounded-full p-3">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    <Badge className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white">
                      <Clock className="w-3 h-3 mr-1" />
                      {video.duration}
                    </Badge>

                    {/* Engagement Overlay */}
                    <div className="absolute top-2 left-2 space-y-1">
                      <div className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded-full text-xs">
                        <Heart className="w-3 h-3" />
                        {formatNumber(video.overlay.likes)}
                      </div>
                      <div className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                        <MessageCircle className="w-3 h-3" />
                        {formatNumber(video.overlay.comments)}
                      </div>
                      <div className="flex items-center gap-1 bg-gray-800 text-white px-2 py-1 rounded-full text-xs">
                        <Eye className="w-3 h-3" />
                        {formatNumber(video.overlay.views)}
                      </div>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                      {video.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {video.channelTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {video.publishedAt}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Instagram-Style Video Player */}
        <InstagramVideoPlayer
          isOpen={showInstagramPlayer}
          onClose={() => {
            setShowInstagramPlayer(false);
            setSelectedVideo(null);
          }}
          video={selectedVideo}
        />
      </DialogContent>
    </Dialog>
  );
}
