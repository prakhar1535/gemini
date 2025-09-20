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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Share,
  Users,
  Calendar,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";
import { useState } from "react";

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  const stats = [
    {
      label: "Total Posts",
      value: "24",
      change: "+12%",
      trend: "up",
      icon: BarChart3,
    },
    {
      label: "Total Reach",
      value: "12.5K",
      change: "+8.2%",
      trend: "up",
      icon: Eye,
    },
    {
      label: "Engagement Rate",
      value: "4.2%",
      change: "+0.5%",
      trend: "up",
      icon: Heart,
    },
    {
      label: "New Followers",
      value: "156",
      change: "+23%",
      trend: "up",
      icon: Users,
    },
  ];

  const platformStats = [
    {
      platform: "X (Twitter)",
      icon: Twitter,
      posts: 8,
      reach: "4.2K",
      engagement: "3.8%",
      followers: "+45",
    },
    {
      platform: "LinkedIn",
      icon: Linkedin,
      posts: 10,
      reach: "5.1K",
      engagement: "4.5%",
      followers: "+67",
    },
    {
      platform: "Instagram",
      icon: Instagram,
      posts: 6,
      reach: "3.2K",
      engagement: "4.1%",
      followers: "+44",
    },
  ];

  const topPosts = [
    {
      id: 1,
      content: "Excited to share our latest product update! 🚀",
      platform: "LinkedIn",
      platformIcon: Linkedin,
      reach: "2.1K",
      likes: 89,
      comments: 23,
      shares: 12,
      engagement: "5.8%",
    },
    {
      id: 2,
      content: "Behind the scenes of our team meeting today...",
      platform: "Instagram",
      platformIcon: Instagram,
      reach: "1.8K",
      likes: 156,
      comments: 34,
      shares: 8,
      engagement: "5.2%",
    },
    {
      id: 3,
      content: "Just launched our new feature! Check it out 👀",
      platform: "X",
      platformIcon: Twitter,
      reach: "1.5K",
      likes: 67,
      comments: 19,
      shares: 15,
      engagement: "4.9%",
    },
  ];

  const engagementMetrics = [
    { label: "Likes", value: "1,234", change: "+15%", trend: "up" },
    { label: "Comments", value: "89", change: "+8%", trend: "up" },
    { label: "Shares", value: "156", change: "+22%", trend: "up" },
    { label: "Saves", value: "67", change: "+5%", trend: "up" },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Track your social media performance and engagement
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span
                      className={
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }
                    >
                      {stat.change}
                    </span>
                    <span>from last period</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Platform Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
            <CardDescription>
              Performance metrics across all your social media platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {platformStats.map((platform, index) => {
                const Icon = platform.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-muted rounded-lg">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">
                          {platform.platform}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {platform.posts} posts
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-6 text-center">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {platform.reach}
                        </p>
                        <p className="text-xs text-muted-foreground">Reach</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {platform.engagement}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Engagement
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-600">
                          {platform.followers}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Followers
                        </p>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Engagement Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>
                Detailed breakdown of engagement across all platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {engagementMetrics.map((metric, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-muted rounded-lg">
                        {metric.label === "Likes" && (
                          <Heart className="h-4 w-4" />
                        )}
                        {metric.label === "Comments" && (
                          <MessageCircle className="h-4 w-4" />
                        )}
                        {metric.label === "Shares" && (
                          <Share className="h-4 w-4" />
                        )}
                        {metric.label === "Saves" && (
                          <BarChart3 className="h-4 w-4" />
                        )}
                      </div>
                      <span className="font-medium text-foreground">
                        {metric.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        {metric.value}
                      </p>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">
                          {metric.change}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
              <CardDescription>
                Your best performing content from the last {selectedPeriod}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPosts.map((post) => {
                  const Icon = post.platformIcon;
                  return (
                    <div key={post.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <Badge variant="outline">{post.platform}</Badge>
                        </div>
                        <Badge variant="secondary">{post.engagement}</Badge>
                      </div>
                      <p className="text-sm text-foreground mb-3 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {post.reach}
                          </p>
                          <p className="text-xs text-muted-foreground">Reach</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {post.likes}
                          </p>
                          <p className="text-xs text-muted-foreground">Likes</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {post.comments}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Comments
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {post.shares}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Shares
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

