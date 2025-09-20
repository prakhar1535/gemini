import { notFound } from "next/navigation";
import ThreeGallery from "@/lib/three-gallery/ThreeGallery";
import {
  defaultPaintingData,
  generatePaintingDataFromImages,
} from "@/lib/three-gallery/paintingData";

interface GalleryPageProps {
  params: {
    id: string;
  };
}

// Function to get user gallery data
async function getUserGalleryData(galleryId: string) {
  // For demo purposes, return demo gallery data
  if (galleryId === "demo") {
    return {
      id: galleryId,
      name: "Demo Gallery",
      images: ["0.jpg", "1.jpg", "2.jpg", "3.jpg"],
      createdAt: new Date(),
    };
  }

  // For user galleries, check if the gallery directory exists
  const fs = await import("fs");
  const path = await import("path");

  const galleryDir = path.join(
    process.cwd(),
    "public",
    "gallery-assets",
    "user-galleries",
    galleryId
  );

  try {
    // Check if gallery directory exists
    if (!fs.existsSync(galleryDir)) {
      return null; // Gallery doesn't exist
    }

    // Read the directory to get uploaded images
    const files = fs.readdirSync(galleryDir);
    const imageFiles = files
      .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .sort((a, b) => {
        // Sort by number if files are named 1.jpg, 2.jpg, etc.
        const aNum = parseInt(a.split(".")[0]);
        const bNum = parseInt(b.split(".")[0]);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return aNum - bNum;
        }
        return a.localeCompare(b);
      });

    if (imageFiles.length === 0) {
      return null; // No images found
    }

    return {
      id: galleryId,
      name: "My Art Gallery",
      images: imageFiles,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error("Error reading gallery directory:", error);
    return null;
  }
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { id } = await params;

  // Get user gallery data
  const galleryData = await getUserGalleryData(id);

  if (!galleryData) {
    notFound();
  }

  // Generate painting data from user images or use default
  const paintingData =
    galleryData.images.length > 0
      ? generatePaintingDataFromImages(galleryData.images, id)
      : defaultPaintingData;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {galleryData.name}
              </h1>
              <p className="text-gray-300">Personal 3D Art Gallery</p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/"
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Gallery */}
      <ThreeGallery paintingData={paintingData} galleryId={id} />
    </div>
  );
}

export async function generateMetadata({ params }: GalleryPageProps) {
  const { id } = await params;
  const galleryData = await getUserGalleryData(id);

  return {
    title: galleryData
      ? `${galleryData.name} - 3D Gallery`
      : "Gallery Not Found",
    description: "Explore your personal 3D art gallery",
  };
}
