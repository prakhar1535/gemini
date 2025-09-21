"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
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
  Pause,
  Volume2,
  VolumeX,
  X,
  Clock,
  User,
  Send,
  Share,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import Image from "next/image";

interface VideoComment {
  author: string;
  text: string;
  likes: number;
  timeAgo: string;
  isLiked?: boolean;
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

interface InstagramVideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  video: YouTubeVideo | null;
}

export function InstagramVideoPlayer({
  isOpen,
  onClose,
  video,
}: InstagramVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [comments, setComments] = useState<VideoComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (video) {
      setComments(video.overlay.commentsList);
      setCurrentTime(0);
      setIsPlaying(false);
      setIsLiked(false);
      setIsBookmarked(false);
    }
  }, [video]);

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: VideoComment = {
        author: "You",
        text: newComment,
        likes: 0,
        timeAgo: "now",
        isLiked: false,
      };
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

  const handleCommentLike = (index: number) => {
    const updatedComments = [...comments];
    updatedComments[index].isLiked = !updatedComments[index].isLiked;
    updatedComments[index].likes += updatedComments[index].isLiked ? 1 : -1;
    setComments(updatedComments);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] p-0 overflow-hidden">
        <div className="flex h-[90vh]">
          {/* Left Side - Video Player */}
          <div className="flex-1 bg-black relative">
            {/* Video Container */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover"
              />

              {/* Play/Pause Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-20 h-20 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white fill-white" />
                  )}
                </Button>
              </div>

              {/* Video Controls */}
              <div className="absolute bottom-4 left-4 right-4">
                {/* Progress Bar */}
                <div className="w-full bg-gray-600 rounded-full h-1 mb-2">
                  <div
                    className="bg-white h-1 rounded-full transition-all duration-300"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>

                {/* Time and Controls */}
                <div className="flex items-center justify-between text-white text-sm">
                  <span>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white hover:bg-opacity-20"
                      onClick={toggleMute}
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Video Info Overlay */}
              <div className="absolute top-4 left-4 right-4">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <h3 className="font-semibold text-lg line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-sm opacity-80">{video.channelTitle}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white hover:bg-opacity-20"
                    onClick={onClose}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Comments */}
          <div className="w-80 bg-white flex flex-col">
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Comments</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowComments(!showComments)}
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Engagement Stats */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-4 mb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-2 ${
                    isLiked ? "text-red-500" : "text-gray-600"
                  }`}
                  onClick={handleLike}
                >
                  <Heart
                    className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                  />
                  {formatNumber(video.overlay.likes + (isLiked ? 1 : 0))}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-gray-600"
                >
                  <MessageCircle className="w-5 h-5" />
                  {formatNumber(comments.length)}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-gray-600"
                >
                  <Share className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-2 ${
                    isBookmarked ? "text-blue-500" : "text-gray-600"
                  }`}
                  onClick={handleBookmark}
                >
                  <Bookmark
                    className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`}
                  />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Eye className="w-4 h-4" />
                {formatNumber(video.overlay.views)} views
              </div>
            </div>

            {/* Comments Feed */}
            {showComments && (
              <>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {comments.map((comment, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {comment.author}
                            </span>
                            <span className="text-xs text-gray-500">
                              {comment.timeAgo}
                            </span>
                          </div>
                          <p className="text-sm mb-2">{comment.text}</p>
                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-6 px-2 text-xs ${
                                comment.isLiked
                                  ? "text-red-500"
                                  : "text-gray-500"
                              }`}
                              onClick={() => handleCommentLike(index)}
                            >
                              <ThumbsUp
                                className={`w-3 h-3 mr-1 ${
                                  comment.isLiked ? "fill-current" : ""
                                }`}
                              />
                              {comment.likes}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs text-gray-500"
                            >
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={commentsEndRef} />
                  </div>
                </ScrollArea>

                {/* Add Comment */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddComment()
                      }
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
