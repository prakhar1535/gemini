import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { COLLECTIONS, GalleryImage } from "@/lib/types/gallery";

interface RouteParams {
  params: { id: string };
}

// GET /api/galleries/[id]/images - List images in a gallery
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Gallery ID is required" },
        { status: 400 }
      );
    }

    const imagesSnapshot = await db
      .collection(COLLECTIONS.GALLERIES)
      .doc(id)
      .collection("images")
      .orderBy("order", "asc")
      .get();

    const images: GalleryImage[] = imagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as GalleryImage));

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