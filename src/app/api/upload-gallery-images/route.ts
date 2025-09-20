import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

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

    // Create gallery directory
    const galleryDir = join(
      process.cwd(),
      "public",
      "gallery-assets",
      "user-galleries",
      galleryId
    );
    await mkdir(galleryDir, { recursive: true });

    const uploadedImages: string[] = [];

    // Process each image
    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      // Validate file type
      if (!image.type.startsWith("image/")) {
        continue; // Skip non-image files
      }

      // Generate unique filename
      const fileExtension = image.name.split(".").pop() || "jpg";
      const fileName = `${i + 1}.${fileExtension}`;
      const filePath = join(galleryDir, fileName);

      // Convert file to buffer and save
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      uploadedImages.push(fileName);
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


