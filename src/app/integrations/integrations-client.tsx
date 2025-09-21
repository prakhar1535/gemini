"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Youtube,
  Instagram,
  Facebook,
  ShoppingBag,
  MessageCircle,
  BarChart3,
  ExternalLink,
  CheckCircle,
  XCircle,
  Settings,
  Play,
} from "lucide-react";
import { VideoOverlay } from "@/components/video-overlay";
import { InstagramVideoPlayer } from "@/components/instagram-video-player";

interface PlatformIntegration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  isIntegrated: boolean;
  analytics?: {
    followers?: number;
    engagement?: number;
    views?: number;
    posts?: number;
    // Instagram specific
    following?: number;
    mediaCount?: number;
    reach?: number;
    impressions?: number;
    // Shopify specific
    totalProducts?: number;
    totalSales?: number;
    totalOrders?: number;
    averageOrderValue?: number;
    conversionRate?: number;
    revenue?: number;
    currency?: string;
  };
}

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  likes: number;
  comments: number;
  publishedAt: string;
}

interface InstagramPost {
  id: string;
  caption: string;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  likeCount: number;
  commentsCount: number;
  timestamp: string;
  permalink: string;
}

interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  inventory: number;
  status: "active" | "draft" | "archived";
  createdAt: string;
  tags: string[];
}

const platforms: PlatformIntegration[] = [
  {
    id: "youtube",
    name: "YouTube",
    description: "Share your art videos and tutorials with millions of viewers",
    icon: <Youtube className="w-6 h-6" />,
    color: "bg-red-500",
    isIntegrated: true,
    analytics: {
      followers: 12500,
      engagement: 8.5,
      views: 250000,
      posts: 45,
    },
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Showcase your artwork through photos and reels",
    icon: <Instagram className="w-6 h-6" />,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    isIntegrated: true,
    analytics: {
      followers: 8500,
      following: 1200,
      mediaCount: 156,
      engagement: 6.8,
      reach: 12500,
      impressions: 45000,
    },
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "Connect with art communities and share your work",
    icon: <Facebook className="w-6 h-6" />,
    color: "bg-blue-600",
    isIntegrated: false,
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "Sell your artwork directly through your online store",
    icon: <ShoppingBag className="w-6 h-6" />,
    color: "bg-green-600",
    isIntegrated: true,
    analytics: {
      totalProducts: 25,
      totalSales: 156,
      totalOrders: 89,
      averageOrderValue: 125.5,
      conversionRate: 3.2,
      revenue: 19578.0,
      currency: "USD",
    },
  },
  {
    id: "telegram",
    name: "Telegram",
    description: "Build a community around your art through channels",
    icon: <MessageCircle className="w-6 h-6" />,
    color: "bg-blue-500",
    isIntegrated: false,
  },
];

export default function IntegrationsClient() {
  const [integratedPlatforms, setIntegratedPlatforms] = useState<
    PlatformIntegration[]
  >(platforms.filter((p) => p.isIntegrated));
  const [availablePlatforms, setAvailablePlatforms] = useState<
    PlatformIntegration[]
  >(platforms.filter((p) => !p.isIntegrated));
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);
  const [shopifyProducts, setShopifyProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [showVideoOverlay, setShowVideoOverlay] = useState(false);
  const [videoQuery, setVideoQuery] = useState("art tutorial");
  const [showInstagramPlayer, setShowInstagramPlayer] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  // Fetch YouTube videos from API
  const fetchYouTubeVideos = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "/api/youtube?action=search&q=art tutorial painting"
      );
      const data = await response.json();
      setYoutubeVideos(data.videos || []);
    } catch (error) {
      console.error("Failed to fetch YouTube videos:", error);
      // Fallback to mock data
      const mockVideos: YouTubeVideo[] = [
        {
          id: "1",
          title: "Watercolor Painting Tutorial - Sunset Landscape",
          thumbnail: "/gallery-assets/artworks/1.jpg",
          views: 15420,
          likes: 892,
          comments: 156,
          publishedAt: "2024-01-15",
        },
        {
          id: "2",
          title: "Digital Art Process - Fantasy Character Design",
          thumbnail: "/gallery-assets/artworks/5.jpg",
          views: 8930,
          likes: 445,
          comments: 78,
          publishedAt: "2024-01-12",
        },
        {
          id: "3",
          title: "Oil Painting Techniques - Portrait Study",
          thumbnail: "/gallery-assets/artworks/10.jpg",
          views: 22100,
          likes: 1205,
          comments: 203,
          publishedAt: "2024-01-10",
        },
        {
          id: "4",
          title: "Sculpture Making - Clay Modeling Process",
          thumbnail: "/gallery-assets/artworks/15.jpg",
          views: 6750,
          likes: 312,
          comments: 45,
          publishedAt: "2024-01-08",
        },
      ];
      setYoutubeVideos(mockVideos);
    }
    setLoading(false);
  };

  // Fetch Instagram posts from API
  const fetchInstagramPosts = async () => {
    try {
      const response = await fetch("/api/instagram?action=posts");
      const data = await response.json();
      setInstagramPosts(data.posts || []);
    } catch (error) {
      console.error("Failed to fetch Instagram posts:", error);
    }
  };

  // Fetch Shopify products from API
  const fetchShopifyProducts = async () => {
    try {
      const response = await fetch("/api/shopify?action=products");
      const data = await response.json();
      setShopifyProducts(data.products || []);
    } catch (error) {
      console.error("Failed to fetch Shopify products:", error);
    }
  };

  useEffect(() => {
    fetchYouTubeVideos();
    fetchInstagramPosts();
    fetchShopifyProducts();
  }, []);

  const handleIntegration = (platformId: string) => {
    const platform = availablePlatforms.find((p) => p.id === platformId);
    if (platform) {
      setAvailablePlatforms((prev) => prev.filter((p) => p.id !== platformId));
      setIntegratedPlatforms((prev) => [
        ...prev,
        { ...platform, isIntegrated: true },
      ]);
    }
  };

  const handleDisconnect = (platformId: string) => {
    const platform = integratedPlatforms.find((p) => p.id === platformId);
    if (platform) {
      setIntegratedPlatforms((prev) => prev.filter((p) => p.id !== platformId));
      setAvailablePlatforms((prev) => [
        ...prev,
        { ...platform, isIntegrated: false },
      ]);
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

  const handleVideoClick = (query: string) => {
    setVideoQuery(query);
    setShowVideoOverlay(true);
  };

  const handleInstagramStyleVideo = () => {
    // Use the first video from the fetched videos or create a mock one
    if (youtubeVideos.length > 0) {
      setSelectedVideo(youtubeVideos[0]);
    } else {
      // Create a mock video for demonstration
      const mockVideo: YouTubeVideo = {
        id: "demo",
        title: "Watercolor Painting Tutorial - Sunset Landscape",
        thumbnail: "/gallery-assets/artworks/1.jpg",
        views: 15420,
        likes: 892,
        comments: 156,
        publishedAt: "2024-01-15",
        channelTitle: "Art Studio Pro",
        description:
          "Learn how to paint a beautiful sunset landscape using watercolor techniques.",
        duration: "12:45",
        overlay: {
          likes: 892,
          comments: 156,
          views: 15420,
          commentsList: [
            {
              author: "ArtLover23",
              text: "Amazing tutorial! This really helped me understand the technique. Thank you!",
              likes: 12,
              timeAgo: "2m",
            },
            {
              author: "CreativeSoul",
              text: "Love the way you explain everything step by step. Very clear and easy to follow.",
              likes: 8,
              timeAgo: "5m",
            },
            {
              author: "PaintingPro",
              text: "This is exactly what I was looking for. Great content!",
              likes: 15,
              timeAgo: "10m",
            },
          ],
        },
      };
      setSelectedVideo(mockVideo);
    }
    setShowInstagramPlayer(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Platform Integrations</h1>
        <p className="text-muted-foreground">
          Connect your art with popular platforms and track your performance
          across all channels.
        </p>
      </div>

      <Tabs defaultValue="integrated" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="integrated">
            Integrated Platforms ({integratedPlatforms.length})
          </TabsTrigger>
          <TabsTrigger value="available">
            Available Platforms ({availablePlatforms.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="integrated" className="space-y-6">
          {integratedPlatforms.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Settings className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Integrations Yet
                </h3>
                <p className="text-muted-foreground text-center">
                  Connect your first platform to start tracking your art's
                  performance across social media.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {integratedPlatforms.map((platform) => (
                <Card key={platform.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg ${platform.color} text-white`}
                        >
                          {platform.icon}
                        </div>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {platform.name}
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Connected
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            {platform.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {platform.id === "youtube" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleVideoClick("art tutorial painting")
                              }
                            >
                              <Play className="w-4 h-4 mr-2" />
                              View Videos
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleInstagramStyleVideo}
                            >
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Instagram Style
                            </Button>
                          </>
                        )}
                        <Button variant="outline" size="sm">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Analytics
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDisconnect(platform.id)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {platform.analytics && (
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {platform.id === "youtube" && (
                          <>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                {formatNumber(
                                  platform.analytics.followers || 0
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Subscribers
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">
                                {platform.analytics.engagement || 0}%
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Engagement
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600">
                                {formatNumber(platform.analytics.views || 0)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Total Views
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-orange-600">
                                {platform.analytics.posts || 0}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Videos
                              </div>
                            </div>
                          </>
                        )}

                        {platform.id === "instagram" && (
                          <>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-pink-600">
                                {formatNumber(
                                  platform.analytics.followers || 0
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Followers
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600">
                                {formatNumber(
                                  platform.analytics.following || 0
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Following
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                {platform.analytics.mediaCount || 0}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Posts
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">
                                {platform.analytics.engagement || 0}%
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Engagement
                              </div>
                            </div>
                          </>
                        )}

                        {platform.id === "shopify" && (
                          <>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">
                                {platform.analytics.totalProducts || 0}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Products
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                {platform.analytics.totalOrders || 0}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Orders
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600">
                                ${platform.analytics.revenue || 0}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Revenue
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-orange-600">
                                {platform.analytics.conversionRate || 0}%
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Conversion
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* YouTube specific content */}
                      {platform.id === "youtube" && (
                        <div>
                          <h4 className="font-semibold mb-4 flex items-center gap-2">
                            <Youtube className="w-5 h-5" />
                            Recent Videos Performance
                          </h4>
                          {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="animate-pulse">
                                  <div className="bg-gray-200 h-32 rounded-lg mb-2"></div>
                                  <div className="bg-gray-200 h-4 rounded mb-1"></div>
                                  <div className="bg-gray-200 h-3 rounded w-2/3"></div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {youtubeVideos.map((video) => (
                                <div
                                  key={video.id}
                                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                  <div className="flex gap-3">
                                    <img
                                      src={video.thumbnail}
                                      alt={video.title}
                                      className="w-20 h-20 object-cover rounded-lg"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-medium text-sm line-clamp-2 mb-2">
                                        {video.title}
                                      </h5>
                                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                          👁️ {formatNumber(video.views)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          ❤️ {formatNumber(video.likes)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          💬 {video.comments}
                                        </span>
                                      </div>
                                      <div className="text-xs text-muted-foreground mt-1">
                                        {new Date(
                                          video.publishedAt
                                        ).toLocaleDateString()}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Instagram specific content */}
                      {platform.id === "instagram" && (
                        <div>
                          <h4 className="font-semibold mb-4 flex items-center gap-2">
                            <Instagram className="w-5 h-5" />
                            Recent Posts Performance
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {instagramPosts.slice(0, 4).map((post) => (
                              <div
                                key={post.id}
                                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                              >
                                <div className="flex gap-3">
                                  <img
                                    src={post.mediaUrl}
                                    alt="Instagram post"
                                    className="w-20 h-20 object-cover rounded-lg"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm line-clamp-2 mb-2">
                                      {post.caption}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        ❤️ {formatNumber(post.likeCount)}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        💬 {post.commentsCount}
                                      </span>
                                      <span className="text-xs">
                                        {post.mediaType}
                                      </span>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {new Date(
                                        post.timestamp
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Shopify specific content */}
                      {platform.id === "shopify" && (
                        <div>
                          <h4 className="font-semibold mb-4 flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5" />
                            Top Selling Products
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {shopifyProducts.slice(0, 4).map((product) => (
                              <div
                                key={product.id}
                                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                              >
                                <div className="flex gap-3">
                                  <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-20 h-20 object-cover rounded-lg"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-sm line-clamp-1 mb-1">
                                      {product.title}
                                    </h5>
                                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                      {product.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-semibold text-green-600">
                                        ${product.price}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {product.inventory} in stock
                                      </span>
                                    </div>
                                    <div className="flex gap-1 mt-2">
                                      {product.tags.slice(0, 2).map((tag) => (
                                        <span
                                          key={tag}
                                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-6">
          <div className="grid gap-6">
            {availablePlatforms.map((platform) => (
              <Card
                key={platform.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${platform.color} text-white`}
                      >
                        {platform.icon}
                      </div>
                      <div>
                        <CardTitle>{platform.name}</CardTitle>
                        <CardDescription>
                          {platform.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleIntegration(platform.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

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
