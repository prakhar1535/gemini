import { NextRequest, NextResponse } from "next/server";

// YouTube API configuration
const RAPIDAPI_KEY =
  process.env.RAPIDAPI_KEY ||
  "92e1cf2749msh521dfe371e4fc6fp16d24djsnc59d1cba6a7d";

interface YouTubeVideoWithOverlay {
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
  overlay: {
    likes: number;
    comments: number;
    views: number;
    commentsList: Array<{
      author: string;
      text: string;
      likes: number;
      timeAgo: string;
    }>;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "art tutorial painting";
    const maxResults = parseInt(searchParams.get("maxResults") || "6");

    // Fetch videos from YouTube API
    const response = await fetch(
      `https://youtube138.p.rapidapi.com/search/?q=${encodeURIComponent(
        query
      )}&hl=en&gl=US&maxResults=${maxResults}`,
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

    // Transform the data and add overlay information
    const videosWithOverlay: YouTubeVideoWithOverlay[] =
      data.contents?.map((item: any) => {
        const video = item.video;

        // Generate realistic overlay data
        const baseViews =
          video.stats?.views || Math.floor(Math.random() * 100000) + 1000;
        const baseLikes =
          video.stats?.likes || Math.floor(Math.random() * 5000) + 100;
        const baseComments =
          video.stats?.comments || Math.floor(Math.random() * 500) + 10;

        // Generate dummy comments
        const commentsList = generateDummyComments(video.title);

        return {
          id: video.videoId,
          title: video.title,
          thumbnail:
            video.thumbnails?.[0]?.url || "/gallery-assets/artworks/1.jpg",
          views: baseViews,
          likes: baseLikes,
          comments: baseComments,
          publishedAt: video.publishedTimeText || new Date().toISOString(),
          channelTitle: video.author?.title || "Art Channel",
          description: video.description || "Art tutorial video",
          duration: video.lengthSeconds
            ? formatDuration(video.lengthSeconds)
            : "5:30",
          overlay: {
            likes: baseLikes,
            comments: baseComments,
            views: baseViews,
            commentsList: commentsList,
          },
        };
      }) || [];

    return NextResponse.json({ videos: videosWithOverlay });
  } catch (error) {
    console.error("YouTube videos API Error:", error);

    // Return mock data if API fails
    return NextResponse.json({ videos: getMockVideosWithOverlay() });
  }
}

function generateDummyComments(videoTitle: string): Array<{
  author: string;
  text: string;
  likes: number;
  timeAgo: string;
}> {
  const commentTemplates = [
    "Amazing tutorial! This really helped me understand the technique. Thank you!",
    "Love the way you explain everything step by step. Very clear and easy to follow.",
    "This is exactly what I was looking for. Great content!",
    "Your videos are always so helpful. Keep up the great work!",
    "I've been trying to learn this for weeks. Finally found a good explanation!",
    "The quality of your content is outstanding. Subscribed!",
    "This technique is game-changing. Can't wait to try it myself.",
    "Perfect timing! I was just about to start learning this.",
    "Your teaching style is so engaging. Love watching your videos!",
    "This is pure gold! Thank you for sharing your knowledge.",
  ];

  const authors = [
    "ArtLover23",
    "CreativeSoul",
    "PaintingPro",
    "ArtStudent",
    "DigitalArtist",
    "WatercolorFan",
    "SketchMaster",
    "ColorTheory",
    "ArtJourney",
    "CreativeMind",
    "ArtEnthusiast",
    "PaintingLife",
    "ArtisticSoul",
    "CreativeFlow",
    "ArtVibes",
  ];

  const timeAgoOptions = [
    "2m",
    "5m",
    "10m",
    "1h",
    "2h",
    "3h",
    "1d",
    "2d",
    "1w",
  ];

  const numComments = Math.floor(Math.random() * 5) + 3; // 3-7 comments
  const comments = [];

  for (let i = 0; i < numComments; i++) {
    comments.push({
      author: authors[Math.floor(Math.random() * authors.length)],
      text: commentTemplates[
        Math.floor(Math.random() * commentTemplates.length)
      ],
      likes: Math.floor(Math.random() * 50) + 1,
      timeAgo:
        timeAgoOptions[Math.floor(Math.random() * timeAgoOptions.length)],
    });
  }

  return comments;
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function getMockVideosWithOverlay(): YouTubeVideoWithOverlay[] {
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
      duration: "18:30",
      overlay: {
        likes: 445,
        comments: 78,
        views: 8930,
        commentsList: [
          {
            author: "DigitalArtist",
            text: "Your videos are always so helpful. Keep up the great work!",
            likes: 23,
            timeAgo: "1h",
          },
          {
            author: "ArtStudent",
            text: "I've been trying to learn this for weeks. Finally found a good explanation!",
            likes: 18,
            timeAgo: "2h",
          },
        ],
      },
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
      duration: "25:15",
      overlay: {
        likes: 1205,
        comments: 203,
        views: 22100,
        commentsList: [
          {
            author: "ArtEnthusiast",
            text: "The quality of your content is outstanding. Subscribed!",
            likes: 45,
            timeAgo: "3h",
          },
          {
            author: "PaintingLife",
            text: "This technique is game-changing. Can't wait to try it myself.",
            likes: 32,
            timeAgo: "1d",
          },
          {
            author: "ArtisticSoul",
            text: "Perfect timing! I was just about to start learning this.",
            likes: 28,
            timeAgo: "2d",
          },
        ],
      },
    },
  ];
}
