import { MainLayout } from "@/components/layout/main-layout";
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

export default function Home() {
  const stats = [
    { label: "Posts Created", value: "24", change: "+12%", trend: "up" },
    { label: "Scheduled Posts", value: "8", change: "+3", trend: "up" },
    { label: "Total Reach", value: "12.5K", change: "+8.2%", trend: "up" },
    { label: "Engagement Rate", value: "4.2%", change: "+0.5%", trend: "up" },
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

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back!
            </h1>
            <p className="text-muted-foreground mt-2">
              Ready to create amazing content for your social media?
            </p>
          </div>
          <Button asChild>
            <Link href="/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Content
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from
                  last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <PenTool className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Create Content</CardTitle>
              </div>
              <CardDescription>
                Generate engaging posts for X, LinkedIn, and Instagram with AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/create">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Schedule Posts</CardTitle>
              </div>
              <CardDescription>
                Plan and schedule your content across all platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/schedule">
                  Schedule Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">View Analytics</CardTitle>
              </div>
              <CardDescription>
                Track performance and engagement across all platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/analytics">
                  View Reports
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Images className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">3D Gallery</CardTitle>
              </div>
              <CardDescription>
                Create immersive 3D art galleries with your images
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/create-gallery">
                  Create Gallery
                  <ArrowRight className="ml-2 h-4 w-4" />
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
                <CardTitle>Recent Posts</CardTitle>
                <CardDescription>
                  Your latest content across all platforms
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-muted rounded-lg">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {post.content}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{post.platform}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {post.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      post.status === "published"
                        ? "default"
                        : post.status === "scheduled"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {post.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
