import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { Gallery, COLLECTIONS } from "@/lib/types/gallery";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/galleries/[id] - Get a specific gallery
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Gallery ID is required" },
        { status: 400 }
      );
    }

    // Get gallery document
    const galleryDoc = await db.collection(COLLECTIONS.GALLERIES).doc(id).get();

    if (!galleryDoc.exists) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    const gallery = {
      id: galleryDoc.id,
      ...galleryDoc.data(),
    } as Gallery;

    // Increment view count
    await db
      .collection(COLLECTIONS.GALLERIES)
      .doc(id)
      .update({
        "metadata.viewCount": gallery.metadata.viewCount + 1,
      });

    return NextResponse.json({
      success: true,
      gallery,
    });
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery" },
      { status: 500 }
    );
  }
}

// PUT /api/galleries/[id] - Update a specific gallery
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const updateData = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Gallery ID is required" },
        { status: 400 }
      );
    }

    // Check if gallery exists
    const galleryDoc = await db.collection(COLLECTIONS.GALLERIES).doc(id).get();

    if (!galleryDoc.exists) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    const updateFields: any = {
      ...updateData,
      "metadata.updatedAt": new Date(),
    };

    // Update gallery in Firestore
    await db.collection(COLLECTIONS.GALLERIES).doc(id).update(updateFields);

    // Get updated gallery
    const updatedDoc = await db.collection(COLLECTIONS.GALLERIES).doc(id).get();
    const updatedGallery = {
      id: id,
      ...updatedDoc.data(),
    } as Gallery;

    return NextResponse.json({
      success: true,
      gallery: updatedGallery,
      message: "Gallery updated successfully",
    });
  } catch (error) {
    console.error("Error updating gallery:", error);
    return NextResponse.json(
      { error: "Failed to update gallery" },
      { status: 500 }
    );
  }
}

// DELETE /api/galleries/[id] - Delete a specific gallery
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Gallery ID is required" },
        { status: 400 }
      );
    }

    // Get gallery document
    const galleryDoc = await db.collection(COLLECTIONS.GALLERIES).doc(id).get();

    if (!galleryDoc.exists) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    const gallery = galleryDoc.data() as Gallery;

    // Delete all associated images from Firestore
    for (const image of gallery.images) {
      try {
        const deleteResponse = await fetch(
          `${request.nextUrl.origin}/api/galleries/upload-images`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ imageId: image.id }),
          }
        );

        if (!deleteResponse.ok) {
          console.warn(`Failed to delete image ${image.id}`);
        }
      } catch (error) {
        console.warn(`Error deleting image ${image.id}:`, error);
      }
    }

    // Delete gallery document
    await db.collection(COLLECTIONS.GALLERIES).doc(id).delete();

    return NextResponse.json({
      success: true,
      message: "Gallery deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting gallery:", error);
    return NextResponse.json(
      { error: "Failed to delete gallery" },
      { status: 500 }
    );
  }
}
