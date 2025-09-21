import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { GalleryImage } from "@/lib/types/gallery";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/galleries/[id]/images - Get all images for a specific gallery
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Gallery ID is required" },
        { status: 400 }
      );
    }

    // Get all images from the gallery's subcollection
    const imagesSnapshot = await db
      .collection("galleries")
      .doc(id)
      .collection("images")
      .orderBy("order", "asc")
      .get();

    const images: GalleryImage[] = [];

    imagesSnapshot.forEach((doc) => {
      images.push({
        id: doc.id,
        ...doc.data(),
      } as GalleryImage);
    });

    return NextResponse.json({
      success: true,
      images,
      count: images.length,
    });
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery images" },
      { status: 500 }
    );
  }
}
