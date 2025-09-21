import { NextRequest, NextResponse } from "next/server";

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

interface ShopifyAnalytics {
  totalProducts: number;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  revenue: number;
  currency: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "products") {
      return await getShopifyProducts();
    } else if (action === "analytics") {
      return await getShopifyAnalytics();
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Shopify API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Shopify data" },
      { status: 500 }
    );
  }
}

async function getShopifyProducts(): Promise<NextResponse> {
  // Mock Shopify products data for art store
  const mockProducts: ShopifyProduct[] = [
    {
      id: "1",
      title: "Watercolor Landscape Print",
      description:
        "High-quality print of original watercolor landscape painting. Perfect for home decoration.",
      price: 45.0,
      currency: "USD",
      image: "/gallery-assets/artworks/1.jpg",
      inventory: 25,
      status: "active",
      createdAt: "2024-01-15T10:30:00Z",
      tags: ["print", "watercolor", "landscape", "home-decor"],
    },
    {
      id: "2",
      title: "Digital Art NFT Collection",
      description:
        "Exclusive NFT collection featuring fantasy character designs. Limited edition.",
      price: 150.0,
      currency: "USD",
      image: "/gallery-assets/artworks/5.jpg",
      inventory: 10,
      status: "active",
      createdAt: "2024-01-12T14:20:00Z",
      tags: ["nft", "digital-art", "fantasy", "limited-edition"],
    },
    {
      id: "3",
      title: "Oil Painting Original",
      description:
        "Original oil painting portrait study. One-of-a-kind artwork.",
      price: 850.0,
      currency: "USD",
      image: "/gallery-assets/artworks/10.jpg",
      inventory: 1,
      status: "active",
      createdAt: "2024-01-10T16:45:00Z",
      tags: ["original", "oil-painting", "portrait", "one-of-a-kind"],
    },
    {
      id: "4",
      title: "Sculpture - Clay Art Piece",
      description: "Handcrafted clay sculpture. Unique contemporary art piece.",
      price: 320.0,
      currency: "USD",
      image: "/gallery-assets/artworks/15.jpg",
      inventory: 3,
      status: "active",
      createdAt: "2024-01-08T09:15:00Z",
      tags: ["sculpture", "clay", "handcrafted", "contemporary"],
    },
    {
      id: "5",
      title: "Art Supplies Bundle",
      description: "Complete set of professional art supplies for beginners.",
      price: 89.99,
      currency: "USD",
      image: "/gallery-assets/artworks/20.jpg",
      inventory: 50,
      status: "active",
      createdAt: "2024-01-05T11:00:00Z",
      tags: ["supplies", "bundle", "beginner", "professional"],
    },
  ];

  return NextResponse.json({ products: mockProducts });
}

async function getShopifyAnalytics(): Promise<NextResponse> {
  const mockAnalytics: ShopifyAnalytics = {
    totalProducts: 25,
    totalSales: 156,
    totalOrders: 89,
    averageOrderValue: 125.5,
    conversionRate: 3.2,
    revenue: 19578.0,
    currency: "USD",
  };

  return NextResponse.json({ analytics: mockAnalytics });
}
