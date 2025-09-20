"use client";

import { MainLayout } from "@/components/layout/main-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  Send,
  Twitter,
  Linkedin,
  Instagram,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ScheduledPost {
  id: string;
  content: string;
  platforms: string[];
  scheduledDate: string;
  scheduledTime: string;
  status: "scheduled" | "published" | "failed";
  createdAt: string;
}

export default function SchedulePage() {
  const [posts, setPosts] = useState<ScheduledPost[]>([
    {
      id: "1",
      content: "Excited to share our latest product update! 🚀",
      platforms: ["x", "linkedin"],
      scheduledDate: "2024-01-20",
      scheduledTime: "09:00",
      status: "scheduled",
      createdAt: "2024-01-19T10:30:00Z",
    },
    {
      id: "2",
      content: "Behind the scenes of our team meeting today...",
      platforms: ["instagram"],
      scheduledDate: "2024-01-19",
      scheduledTime: "14:00",
      status: "published",
      createdAt: "2024-01-19T08:00:00Z",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    content: "",
    platforms: [] as string[],
    scheduledDate: "",
    scheduledTime: "",
  });

  const platformIcons = {
    x: Twitter,
    linkedin: Linkedin,
    instagram: Instagram,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.content ||
      !formData.platforms.length ||
      !formData.scheduledDate ||
      !formData.scheduledTime
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newPost: ScheduledPost = {
      id: Date.now().toString(),
      content: formData.content,
      platforms: formData.platforms,
      scheduledDate: formData.scheduledDate,
      scheduledTime: formData.scheduledTime,
      status: "scheduled",
      createdAt: new Date().toISOString(),
    };

    setPosts([...posts, newPost]);
    setFormData({
      content: "",
      platforms: [],
      scheduledDate: "",
      scheduledTime: "",
    });
    setShowForm(false);
    toast.success("Post scheduled successfully!");
  };

  const handleDelete = (id: string) => {
    setPosts(posts.filter((post) => post.id !== id));
    toast.success("Post deleted successfully!");
  };

  const handlePublishNow = (id: string) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, status: "published" } : post
      )
    );
    toast.success("Post published successfully!");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Schedule Posts
            </h1>
            <p className="text-muted-foreground mt-2">
              Plan and schedule your content across all platforms
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Post
          </Button>
        </div>

        {/* Schedule Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Schedule New Post</CardTitle>
              <CardDescription>
                Create a new scheduled post for your social media platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="What do you want to post?"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Platforms</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["x", "linkedin", "instagram"] as const).map(
                      (platform) => {
                        const Icon = platformIcons[platform];
                        const isSelected =
                          formData.platforms.includes(platform);
                        return (
                          <Button
                            key={platform}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            className="flex flex-col items-center space-y-2 h-auto py-4"
                            onClick={() => {
                              const platforms = isSelected
                                ? formData.platforms.filter(
                                    (p) => p !== platform
                                  )
                                : [...formData.platforms, platform];
                              setFormData({ ...formData, platforms });
                            }}
                          >
                            <Icon className="h-5 w-5" />
                            <span className="capitalize">{platform}</span>
                          </Button>
                        );
                      }
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          scheduledDate: e.target.value,
                        })
                      }
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          scheduledTime: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit">Schedule Post</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Scheduled Posts */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Scheduled Posts</h2>

          {posts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No scheduled posts
                </h3>
                <p className="text-muted-foreground mb-4">
                  Schedule your first post to get started
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Post
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(post.status)}
                          <Badge className={getStatusColor(post.status)}>
                            {post.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(
                              post.scheduledDate + "T" + post.scheduledTime
                            ).toLocaleString()}
                          </span>
                        </div>

                        <p className="text-foreground">{post.content}</p>

                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            Platforms:
                          </span>
                          {post.platforms.map((platform) => {
                            const Icon =
                              platformIcons[
                                platform as keyof typeof platformIcons
                              ];
                            return (
                              <div
                                key={platform}
                                className="flex items-center space-x-1"
                              >
                                <Icon className="h-4 w-4" />
                                <span className="text-sm capitalize">
                                  {platform}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {post.status === "scheduled" && (
                          <Button
                            size="sm"
                            onClick={() => handlePublishNow(post.id)}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Publish Now
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

