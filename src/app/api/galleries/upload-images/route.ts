import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { v4 as uuidv4 } from "uuid";
import { GalleryImage, COLLECTIONS } from "@/lib/types/gallery";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const galleryId = formData.get("galleryId") as string;
    const images = formData.getAll("images") as File[];

    if (!galleryId || !images || images.length === 0) {
      return NextResponse.json(
        { error: "Gallery ID and images are required" },
        { status: 400 }
      );
    }

    const uploadedImages: GalleryImage[] = [];

    // Process each image
    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      // Validate file type
      if (!image.type.startsWith("image/")) {
        continue; // Skip non-image files
      }

      // Convert file to buffer and compress
      const bytes = await image.arrayBuffer();
      const originalBuffer = Buffer.from(bytes);

      // Compress image using Sharp (aggressive compression for Firestore)
      const compressedBuffer = await sharp(originalBuffer)
        .resize(800, 800, {
          // Resize to max 800x800
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({
          quality: 60, // 60% quality for smaller size
          progressive: true,
          mozjpeg: true, // Better compression
        })
        .toBuffer();

      // Convert compressed image to base64
      let base64 = compressedBuffer.toString("base64");
      let dataUrl = `data:image/jpeg;base64,${base64}`;

      // If still too large, compress more aggressively
      if (base64.length > 1000000) {
        // 1MB limit with some buffer
        console.log(
          `Image ${i + 1} still too large (${(
            base64.length /
            1024 /
            1024
          ).toFixed(2)}MB), compressing further...`
        );

        const ultraCompressedBuffer = await sharp(originalBuffer)
          .resize(600, 600, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .jpeg({
            quality: 40,
            progressive: true,
            mozjpeg: true,
          })
          .toBuffer();

        base64 = ultraCompressedBuffer.toString("base64");
        dataUrl = `data:image/jpeg;base64,${base64}`;

        console.log(
          `Ultra compressed size: ${(base64.length / 1024 / 1024).toFixed(2)}MB`
        );
      }

      // Generate unique filename
      const fileExtension = image.name.split(".").pop() || "jpg";
      const fileName = `${uuidv4()}.${fileExtension}`;

      // Create gallery image document
      const galleryImage: GalleryImage = {
        id: uuidv4(),
        filename: fileName,
        originalName: image.name,
        base64: dataUrl, // Store as data URL
        size: compressedBuffer.length, // Use compressed size
        mimeType: "image/jpeg", // Always JPEG after compression
        uploadedAt: new Date(),
        order: i,
      };

      // Save to Firestore subcollection
      await db
        .collection(COLLECTIONS.GALLERIES)
        .doc(galleryId)
        .collection("images")
        .doc(galleryImage.id)
        .set(galleryImage);

      uploadedImages.push(galleryImage);
    }

    return NextResponse.json({
      success: true,
      galleryId,
      uploadedImages,
      message: `Successfully uploaded ${uploadedImages.length} images`,
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    return NextResponse.json(
      { error: "Failed to upload images" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { imageId } = await request.json();

    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    // Get image document from Firestore (need to find which gallery it belongs to)
    // For now, we'll need the galleryId in the request
    const { galleryId } = await request.json();

    if (!galleryId) {
      return NextResponse.json(
        { error: "Gallery ID is required for deletion" },
        { status: 400 }
      );
    }

    const imageDoc = await db
      .collection(COLLECTIONS.GALLERIES)
      .doc(galleryId)
      .collection("images")
      .doc(imageId)
      .get();

    if (!imageDoc.exists) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Delete from Firestore subcollection
    await db
      .collection(COLLECTIONS.GALLERIES)
      .doc(galleryId)
      .collection("images")
      .doc(imageId)
      .delete();

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
