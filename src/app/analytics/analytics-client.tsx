"use client";

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
import { useLanguage } from "@/lib/language-context";

export function AnalyticsClient() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const { t } = useLanguage();

  const stats = [
    {
      labelKey: "analytics.metrics.total_posts",
      value: "24",
      change: "+12%",
      trend: "up",
      icon: BarChart3,
    },
    {
      labelKey: "analytics.metrics.total_reach",
      value: "12.5K",
      change: "+8.2%",
      trend: "up",
      icon: Eye,
    },
    {
      labelKey: "analytics.metrics.engagement_rate",
      value: "4.2%",
      change: "+0.5%",
      trend: "up",
      icon: Heart,
    },
    {
      labelKey: "analytics.metrics.new_followers",
      value: "156",
      change: "+23%",
      trend: "up",
      icon: Users,
    },
  ];

  const platforms = [
    {
      name: "X (Twitter)",
      icon: Twitter,
      posts: 8,
      reach: "4.2K",
      engagement: "3.8%",
      followers: "+45",
      color: "bg-blue-100 text-blue-600",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      posts: 10,
      reach: "5.1K",
      engagement: "4.5%",
      followers: "+67",
      color: "bg-blue-100 text-blue-600",
    },
    {
      name: "Instagram",
      icon: Instagram,
      posts: 6,
      reach: "3.2K",
      engagement: "4.1%",
      followers: "+44",
      color: "bg-pink-100 text-pink-600",
    },
  ];

  const engagementMetrics = [
    {
      labelKey: "analytics.likes",
      value: "1,234",
      change: "+15%",
      trend: "up",
      icon: Heart,
    },
    {
      labelKey: "analytics.comments",
      value: "89",
      change: "+8%",
      trend: "up",
      icon: MessageCircle,
    },
    {
      labelKey: "analytics.shares",
      value: "156",
      change: "+22%",
      trend: "up",
      icon: Share,
    },
    {
      labelKey: "analytics.saves",
      value: "67",
      change: "0%",
      trend: "neutral",
      icon: Eye,
    },
  ];

  const topPosts = [
    {
      platform: "LinkedIn",
      content: "Excited to share our latest product update!",
      reach: "2.1K",
      likes: 89,
      comments: 23,
      shares: 12,
      engagement: "5.8%",
      icon: Linkedin,
    },
    {
      platform: "Instagram",
      content: "Behind the scenes of our team meeting...",
      reach: "1.8K",
      likes: 156,
      comments: 34,
      shares: 8,
      engagement: "5.2%",
      icon: Instagram,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("analytics.title")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("analytics.subtitle")}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={t("analytics.date_range")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">{t("analytics.date_range")}</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">{t("analytics.export")}</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t(stat.labelKey)}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                )}
                <span
                  className={
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }
                >
                  {stat.change}
                </span>
                from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Platform Performance */}
      <Card>
        <CardHeader>
          <CardTitle>{t("analytics.platform_performance")}</CardTitle>
          <CardDescription>{t("analytics.platform_subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {platforms.map((platform, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${platform.color}`}>
                    <platform.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{platform.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {platform.posts} posts
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm font-medium">{platform.reach}</p>
                    <p className="text-xs text-muted-foreground">Reach</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{platform.engagement}</p>
                    <p className="text-xs text-muted-foreground">Engagement</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-green-600">
                      {platform.followers}
                    </p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <Button variant="outline" size="sm">
                    {t("analytics.view_details")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>{t("analytics.engagement_metrics")}</CardTitle>
          <CardDescription>
            {t("analytics.engagement_subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {engagementMetrics.map((metric, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {t(metric.labelKey)}
                  </span>
                </div>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                  ) : metric.trend === "down" ? (
                    <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                  ) : null}
                  <span
                    className={
                      metric.trend === "up"
                        ? "text-green-600"
                        : metric.trend === "down"
                        ? "text-red-600"
                        : "text-muted-foreground"
                    }
                  >
                    {metric.change}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Posts */}
      <Card>
        <CardHeader>
          <CardTitle>{t("analytics.top_posts")}</CardTitle>
          <CardDescription>{t("analytics.top_subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPosts.map((post, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <post.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{post.content}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <span>{post.reach} Reach</span>
                        <span>{post.likes} Likes</span>
                        <span>{post.comments} Comments</span>
                        <span>{post.shares} Shares</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="ml-4">
                    {post.engagement} engagement
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
