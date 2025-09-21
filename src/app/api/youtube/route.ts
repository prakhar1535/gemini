import { NextRequest, NextResponse } from "next/server";

// YouTube API configuration
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "your-youtube-api-key";
const RAPIDAPI_KEY =
  process.env.RAPIDAPI_KEY ||
  "92e1cf2749msh521dfe371e4fc6fp16d24djsnc59d1cba6a7d";

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
}

interface YouTubeChannel {
  id: string;
  title: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  thumbnail: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const query = searchParams.get("q") || "art tutorial painting";

    if (action === "search") {
      return await searchVideos(query);
    } else if (action === "channel") {
      const channelId = searchParams.get("channelId");
      if (!channelId) {
        return NextResponse.json(
          { error: "Channel ID is required" },
          { status: 400 }
        );
      }
      return await getChannelInfo(channelId);
    } else {
      return await getArtVideos();
    }
  } catch (error) {
    console.error("YouTube API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch YouTube data" },
      { status: 500 }
    );
  }
}

async function searchVideos(query: string): Promise<NextResponse> {
  try {
    // Using RapidAPI YouTube API (as shown in the image)
    const response = await fetch(
      `https://youtube138.p.rapidapi.com/search/?q=${encodeURIComponent(
        query
      )}&hl=en&gl=US`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "youtube138.p.rapidapi.com",
          "x-rapidapi-key": RAPIDAPI_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform the data to match our interface
    const videos: YouTubeVideo[] =
      data.contents?.map((item: any) => {
        const video = item.video;
        return {
          id: video.videoId,
          title: video.title,
          thumbnail:
            video.thumbnails?.[0]?.url || "/gallery-assets/artworks/1.jpg",
          views: video.stats?.views || Math.floor(Math.random() * 50000) + 1000,
          likes: video.stats?.likes || Math.floor(Math.random() * 5000) + 100,
          comments:
            video.stats?.comments || Math.floor(Math.random() * 500) + 10,
          publishedAt: video.publishedTimeText || new Date().toISOString(),
          channelTitle: video.author?.title || "Art Channel",
          description: video.description || "Art tutorial video",
        };
      }) || [];

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Search videos error:", error);
    // Return mock data if API fails
    return NextResponse.json({ videos: getMockArtVideos() });
  }
}

async function getChannelInfo(channelId: string): Promise<NextResponse> {
  try {
    const response = await fetch(
      `https://youtube138.p.rapidapi.com/channel/details/?id=${channelId}&hl=en&gl=US`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "youtube138.p.rapidapi.com",
          "x-rapidapi-key": RAPIDAPI_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    const channel: YouTubeChannel = {
      id: data.meta?.channelId || channelId,
      title: data.meta?.title || "Art Channel",
      subscriberCount:
        data.stats?.subscribers || Math.floor(Math.random() * 100000) + 1000,
      videoCount: data.stats?.videos || Math.floor(Math.random() * 100) + 10,
      viewCount:
        data.stats?.views || Math.floor(Math.random() * 1000000) + 10000,
      thumbnail: data.avatar?.[0]?.url || "/gallery-assets/artworks/1.jpg",
    };

    return NextResponse.json({ channel });
  } catch (error) {
    console.error("Get channel info error:", error);
    // Return mock data if API fails
    return NextResponse.json({
      channel: {
        id: channelId,
        title: "Art Channel",
        subscriberCount: 12500,
        videoCount: 45,
        viewCount: 250000,
        thumbnail: "/gallery-assets/artworks/1.jpg",
      },
    });
  }
}

async function getArtVideos(): Promise<NextResponse> {
  // Return mock data for art-related videos
  return NextResponse.json({ videos: getMockArtVideos() });
}

function getMockArtVideos(): YouTubeVideo[] {
  return [
    {
      id: "1",
      title: "Watercolor Painting Tutorial - Sunset Landscape",
      thumbnail: "/gallery-assets/artworks/1.jpg",
      views: 15420,
      likes: 892,
      comments: 156,
      publishedAt: "2024-01-15",
      channelTitle: "Art Studio Pro",
      description:
        "Learn how to paint a beautiful sunset landscape using watercolor techniques.",
    },
    {
      id: "2",
      title: "Digital Art Process - Fantasy Character Design",
      thumbnail: "/gallery-assets/artworks/5.jpg",
      views: 8930,
      likes: 445,
      comments: 78,
      publishedAt: "2024-01-12",
      channelTitle: "Digital Art Hub",
      description:
        "Step-by-step process of creating a fantasy character from concept to final artwork.",
    },
    {
      id: "3",
      title: "Oil Painting Techniques - Portrait Study",
      thumbnail: "/gallery-assets/artworks/10.jpg",
      views: 22100,
      likes: 1205,
      comments: 203,
      publishedAt: "2024-01-10",
      channelTitle: "Classical Art Academy",
      description:
        "Master the fundamentals of oil painting with this detailed portrait tutorial.",
    },
    {
      id: "4",
      title: "Sculpture Making - Clay Modeling Process",
      thumbnail: "/gallery-assets/artworks/15.jpg",
      views: 6750,
      likes: 312,
      comments: 45,
      publishedAt: "2024-01-08",
      channelTitle: "3D Art Workshop",
      description:
        "Learn the basics of clay modeling and sculpture creation techniques.",
    },
    {
      id: "5",
      title: "Acrylic Pouring Art - Abstract Techniques",
      thumbnail: "/gallery-assets/artworks/20.jpg",
      views: 18900,
      likes: 756,
      comments: 134,
      publishedAt: "2024-01-05",
      channelTitle: "Abstract Art Studio",
      description:
        "Create stunning abstract art using acrylic pouring techniques and color theory.",
    },
    {
      id: "6",
      title: "Pencil Drawing - Realistic Portrait",
      thumbnail: "/gallery-assets/artworks/25.jpg",
      views: 12300,
      likes: 623,
      comments: 89,
      publishedAt: "2024-01-03",
      channelTitle: "Drawing Mastery",
      description:
        "Learn to draw realistic portraits using pencil shading and proportion techniques.",
    },
  ];
}
