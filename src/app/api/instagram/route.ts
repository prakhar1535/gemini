import { NextRequest, NextResponse } from "next/server";

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

interface InstagramAnalytics {
  followers: number;
  following: number;
  mediaCount: number;
  engagement: number;
  reach: number;
  impressions: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "posts") {
      return await getInstagramPosts();
    } else if (action === "analytics") {
      return await getInstagramAnalytics();
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Instagram API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Instagram data" },
      { status: 500 }
    );
  }
}

async function getInstagramPosts(): Promise<NextResponse> {
  // Mock Instagram posts data for art accounts
  const mockPosts: InstagramPost[] = [
    {
      id: "1",
      caption:
        "Just finished this watercolor landscape! The colors really came alive in the sunset light. #watercolor #landscape #art",
      mediaUrl: "/gallery-assets/artworks/1.jpg",
      mediaType: "IMAGE",
      likeCount: 1240,
      commentsCount: 89,
      timestamp: "2024-01-15T10:30:00Z",
      permalink: "https://instagram.com/p/example1",
    },
    {
      id: "2",
      caption:
        "Digital art process video - creating a fantasy character from sketch to final render. Swipe to see the progression! ✨",
      mediaUrl: "/gallery-assets/artworks/5.jpg",
      mediaType: "VIDEO",
      likeCount: 2100,
      commentsCount: 156,
      timestamp: "2024-01-12T14:20:00Z",
      permalink: "https://instagram.com/p/example2",
    },
    {
      id: "3",
      caption:
        "Oil painting study - working on portrait techniques. The subtle skin tones are always the most challenging part.",
      mediaUrl: "/gallery-assets/artworks/10.jpg",
      mediaType: "IMAGE",
      likeCount: 890,
      commentsCount: 67,
      timestamp: "2024-01-10T16:45:00Z",
      permalink: "https://instagram.com/p/example3",
    },
    {
      id: "4",
      caption:
        "Sculpture in progress! Clay modeling is so therapeutic. Can't wait to see this piece finished.",
      mediaUrl: "/gallery-assets/artworks/15.jpg",
      mediaType: "CAROUSEL_ALBUM",
      likeCount: 1560,
      commentsCount: 123,
      timestamp: "2024-01-08T09:15:00Z",
      permalink: "https://instagram.com/p/example4",
    },
  ];

  return NextResponse.json({ posts: mockPosts });
}

async function getInstagramAnalytics(): Promise<NextResponse> {
  const mockAnalytics: InstagramAnalytics = {
    followers: 8500,
    following: 1200,
    mediaCount: 156,
    engagement: 6.8,
    reach: 12500,
    impressions: 45000,
  };

  return NextResponse.json({ analytics: mockAnalytics });
}
