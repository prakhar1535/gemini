"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PenTool,
  Calendar,
  BarChart3,
  TrendingUp,
  Zap,
  ArrowRight,
  Plus,
  Images,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export function DashboardClient() {
  const { t } = useLanguage();

  const stats = [
    {
      labelKey: "dashboard.metrics.posts_created",
      value: "24",
      change: "+12%",
      trend: "up",
    },
    {
      labelKey: "dashboard.metrics.scheduled_posts",
      value: "8",
      change: "+3",
      trend: "up",
    },
    {
      labelKey: "dashboard.metrics.total_reach",
      value: "12.5K",
      change: "+8.2%",
      trend: "up",
    },
    {
      labelKey: "dashboard.metrics.engagement_rate",
      value: "4.2%",
      change: "+0.5%",
      trend: "up",
    },
  ];

  const recentPosts = [
    {
      id: 1,
      platform: "LinkedIn",
      content: "Excited to share our latest product update...",
      status: "published",
      date: "2 hours ago",
    },
    {
      id: 2,
      platform: "X",
      content: "Just launched our new feature! 🚀",
      status: "scheduled",
      date: "Tomorrow at 9:00 AM",
    },
    {
      id: 3,
      platform: "Instagram",
      content: "Behind the scenes of our team meeting...",
      status: "draft",
      date: "Draft",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            {t("common.published")}
          </Badge>
        );
      case "scheduled":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {t("common.scheduled")}
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            {t("common.draft")}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("dashboard.welcome")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("dashboard.subtitle")}
          </p>
        </div>
        <Button asChild>
          <Link href="/create">
            <Plus className="w-4 h-4 mr-2" />
            {t("dashboard.create_content")}
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t(stat.labelKey)}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PenTool className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-lg">
                {t("dashboard.actions.create_content")}
              </CardTitle>
            </div>
            <CardDescription>
              Generate engaging posts for X, LinkedIn, and Instagram with AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/create">
                {t("common.get_started")}{" "}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-lg">
                {t("dashboard.actions.schedule_posts")}
              </CardTitle>
            </div>
            <CardDescription>
              Plan and schedule your content across all platforms.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link href="/schedule">
                {t("common.schedule_now")}{" "}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <CardTitle className="text-lg">
                {t("dashboard.actions.view_analytics")}
              </CardTitle>
            </div>
            <CardDescription>
              Track performance and engagement across all platforms.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link href="/analytics">
                {t("common.view_reports")}{" "}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Images className="h-5 w-5 text-orange-600" />
              </div>
              <CardTitle className="text-lg">
                {t("dashboard.actions.create_gallery")}
              </CardTitle>
            </div>
            <CardDescription>
              Create immersive 3D art galleries with your images.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link href="/create-gallery">
                {t("common.create_gallery")}{" "}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("dashboard.recent_posts")}</CardTitle>
              <CardDescription>
                {t("dashboard.recent_subtitle")}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              {t("dashboard.view_all")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {post.content}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {post.platform} • {post.date}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {getStatusBadge(post.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

