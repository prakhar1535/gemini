import { notFound } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import ThreeGallery from "@/lib/three-gallery/ThreeGallery";
import { defaultPaintingData } from "@/lib/three-gallery/paintingData";
import { Gallery } from "@/lib/types/gallery";

interface GalleryPageProps {
  params: {
    id: string;
  };
}

// Function to get gallery data from Firestore
async function getGalleryData(
  galleryId: string,
  baseUrl?: string
): Promise<Gallery | null> {
  // For demo purposes, return demo gallery data
  if (galleryId === "demo") {
    return {
      id: galleryId,
      name: "Demo Gallery",
      description: "A demonstration gallery showcasing sample artworks",
      imageIds: ["demo-1", "demo-2", "demo-3", "demo-4"],
      images: [
        {
          id: "demo-1",
          filename: "0.jpg",
          originalName: "demo-0.jpg",
          base64: "/gallery-assets/artworks/0.jpg", // For demo, use regular URLs
          size: 1024,
          mimeType: "image/jpeg",
          uploadedAt: new Date(),
          order: 0,
        },
        {
          id: "demo-2",
          filename: "1.jpg",
          originalName: "demo-1.jpg",
          base64: "/gallery-assets/artworks/1.jpg", // For demo, use regular URLs
          size: 1024,
          mimeType: "image/jpeg",
          uploadedAt: new Date(),
          order: 1,
        },
        {
          id: "demo-3",
          filename: "2.jpg",
          originalName: "demo-2.jpg",
          base64: "/gallery-assets/artworks/2.jpg", // For demo, use regular URLs
          size: 1024,
          mimeType: "image/jpeg",
          uploadedAt: new Date(),
          order: 2,
        },
        {
          id: "demo-4",
          filename: "3.jpg",
          originalName: "demo-3.jpg",
          base64: "/gallery-assets/artworks/3.jpg", // For demo, use regular URLs
          size: 1024,
          mimeType: "image/jpeg",
          uploadedAt: new Date(),
          order: 3,
        },
      ],
      paintingData: defaultPaintingData.map((painting, index) => ({
        ...painting,
        imageId: `demo-${index + 1}`,
      })),
      settings: {
        backgroundColor: "#000000",
        lightingIntensity: 1.0,
        showAudioGuide: true,
        showInfoPanels: true,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "demo",
        isPublic: true,
        viewCount: 0,
        tags: ["demo", "sample"],
      },
    };
  }

  try {
    // Fetch gallery from API
    const apiBaseUrl =
      baseUrl || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${apiBaseUrl}/api/galleries/${galleryId}`, {
      cache: "no-store", // Always fetch fresh data
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch gallery: ${response.statusText}`);
    }

    const result = await response.json();
    const gallery = result.gallery;

    // Fetch images from subcollection
    if (gallery.imageIds && gallery.imageIds.length > 0) {
      const imagesResponse = await fetch(
        `${apiBaseUrl}/api/galleries/${galleryId}/images`,
        {
          cache: "no-store",
        }
      );

      if (imagesResponse.ok) {
        const imagesResult = await imagesResponse.json();
        gallery.images = imagesResult.images;

        // Update paintingData with actual image sources
        if (gallery.paintingData && gallery.images) {
          gallery.paintingData = gallery.paintingData.map((painting, index) => {
            const image = gallery.images.find(
              (img) => img.id === painting.imageId
            );
            return {
              ...painting,
              imgSrc: image ? image.base64 : painting.imgSrc,
            };
          });
        }
      }
    }

    return gallery;
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return null;
  }
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { id } = await params;

  // Get the request URL from headers for proper base URL detection
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const baseUrl = `${protocol}://${host}`;

  // Get gallery data from Firestore
  const galleryData = await getGalleryData(id, baseUrl);

  if (!galleryData) {
    notFound();
  }

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
              <p className="text-gray-300">
                {galleryData.description || "3D Art Gallery"}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-gray-400">
                  {galleryData.images.length} artwork
                  {galleryData.images.length !== 1 ? "s" : ""}
                </span>
                <span className="text-sm text-gray-400">
                  {galleryData.metadata.viewCount} view
                  {galleryData.metadata.viewCount !== 1 ? "s" : ""}
                </span>
                {galleryData.metadata.tags.length > 0 && (
                  <div className="flex space-x-1">
                    {galleryData.metadata.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-white/10 text-white text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Gallery */}
      <ThreeGallery
        paintingData={galleryData.paintingData}
        galleryId={id}
        settings={galleryData.settings}
      />
    </div>
  );
}

export async function generateMetadata({ params }: GalleryPageProps) {
  const { id } = await params;

  // Get the request URL from headers for proper base URL detection
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const baseUrl = `${protocol}://${host}`;

  const galleryData = await getGalleryData(id, baseUrl);

  return {
    title: galleryData
      ? `${galleryData.name} - 3D Gallery`
      : "Gallery Not Found",
    description:
      galleryData?.description || "Explore your personal 3D art gallery",
  };
}
