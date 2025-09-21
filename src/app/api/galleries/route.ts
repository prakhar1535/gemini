import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { v4 as uuidv4 } from "uuid";
import {
  Gallery,
  CreateGalleryRequest,
  UpdateGalleryRequest,
  COLLECTIONS,
} from "@/lib/types/gallery";
import { generatePaintingDataFromImages } from "@/lib/three-gallery/paintingData";

// GET /api/galleries - Get all galleries or filter by user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const isPublic = searchParams.get("isPublic");
    const limit = parseInt(searchParams.get("limit") || "10");

    let query = db.collection(COLLECTIONS.GALLERIES);

    // Apply filters
    if (userId) {
      query = query.where("metadata.createdBy", "==", userId);
    }

    if (isPublic === "true") {
      query = query.where("metadata.isPublic", "==", true);
    }

    // Order by creation date (newest first)
    query = query.orderBy("metadata.createdAt", "desc").limit(limit);

    const snapshot = await query.get();
    const galleries: Gallery[] = [];

    snapshot.forEach((doc) => {
      galleries.push({
        id: doc.id,
        ...doc.data(),
      } as Gallery);
    });

    return NextResponse.json({
      success: true,
      galleries,
      count: galleries.length,
    });
  } catch (error) {
    console.error("Error fetching galleries:", error);
    return NextResponse.json(
      { error: "Failed to fetch galleries" },
      { status: 500 }
    );
  }
}

// POST /api/galleries - Create a new gallery
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const images = formData.getAll("images") as File[];
    const isPublic = formData.get("isPublic") === "true";
    const tags = formData.get("tags")
      ? JSON.parse(formData.get("tags") as string)
      : [];
    const createdBy = (formData.get("createdBy") as string) || "anonymous";

    if (!name || !images || images.length === 0) {
      return NextResponse.json(
        { error: "Name and images are required" },
        { status: 400 }
      );
    }

    const galleryId = uuidv4();
    const now = new Date();

    // First, upload images to Firebase Storage
    const imageUploadFormData = new FormData();
    imageUploadFormData.append("galleryId", galleryId);
    images.forEach((image) => {
      imageUploadFormData.append("images", image);
    });

    const uploadResponse = await fetch(
      `${request.nextUrl.origin}/api/galleries/upload-images`,
      {
        method: "POST",
        body: imageUploadFormData,
      }
    );

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload images");
    }

    const uploadResult = await uploadResponse.json();
    const uploadedImages = uploadResult.uploadedImages;

    // Generate painting data from uploaded images (using image IDs)
    const imageIds = uploadedImages.map((img: any) => img.id);
    const paintingData = generatePaintingDataFromImages(imageIds, galleryId);

    // Create gallery document
    const gallery: Omit<Gallery, "id"> = {
      name,
      description,
      imageIds: uploadedImages.map((img: any) => img.id),
      paintingData,
      settings: {
        backgroundColor: "#000000",
        lightingIntensity: 1.0,
        showAudioGuide: true,
        showInfoPanels: true,
      },
      metadata: {
        createdAt: now,
        updatedAt: now,
        createdBy,
        isPublic,
        viewCount: 0,
        tags,
      },
    };

    // Save to Firestore
    const docRef = await db
      .collection(COLLECTIONS.GALLERIES)
      .doc(galleryId)
      .set(gallery);

    return NextResponse.json({
      success: true,
      gallery: {
        id: galleryId,
        ...gallery,
      },
      message: "Gallery created successfully",
    });
  } catch (error) {
    console.error("Error creating gallery:", error);
    return NextResponse.json(
      { error: "Failed to create gallery" },
      { status: 500 }
    );
  }
}

// PUT /api/galleries - Update an existing gallery
export async function PUT(request: NextRequest) {
  try {
    const {
      galleryId,
      ...updateData
    }: UpdateGalleryRequest & { galleryId: string } = await request.json();

    if (!galleryId) {
      return NextResponse.json(
        { error: "Gallery ID is required" },
        { status: 400 }
      );
    }

    // Check if gallery exists
    const galleryDoc = await db
      .collection(COLLECTIONS.GALLERIES)
      .doc(galleryId)
      .get();

    if (!galleryDoc.exists) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    const updateFields: any = {
      ...updateData,
      "metadata.updatedAt": new Date(),
    };

    // Update gallery in Firestore
    await db
      .collection(COLLECTIONS.GALLERIES)
      .doc(galleryId)
      .update(updateFields);

    // Get updated gallery
    const updatedDoc = await db
      .collection(COLLECTIONS.GALLERIES)
      .doc(galleryId)
      .get();
    const updatedGallery = {
      id: galleryId,
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

// DELETE /api/galleries - Delete a gallery
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const galleryId = searchParams.get("galleryId");

    if (!galleryId) {
      return NextResponse.json(
        { error: "Gallery ID is required" },
        { status: 400 }
      );
    }

    // Get gallery document
    const galleryDoc = await db
      .collection(COLLECTIONS.GALLERIES)
      .doc(galleryId)
      .get();

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
    await db.collection(COLLECTIONS.GALLERIES).doc(galleryId).delete();

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
