"use client";

import Link from "next/link";
import ThreeGallery from "@/lib/three-gallery/ThreeGallery";
import { Gallery } from "@/lib/types/gallery";
import { useLanguage } from "@/lib/language-context";

interface GalleryPageClientProps {
  galleryData: Gallery;
  galleryId: string;
}

export function GalleryPageClient({
  galleryData,
  galleryId,
}: GalleryPageClientProps) {
  const { t } = useLanguage();

  const getArtworkText = (count: number) => {
    return count === 1 ? t("gallery.artworks") : t("gallery.artworks_plural");
  };

  const getViewsText = (count: number) => {
    return count === 1 ? t("gallery.views") : t("gallery.views_plural");
  };

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
                {galleryData.description || t("gallery.description")}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-gray-400">
                  {galleryData.images.length}{" "}
                  {getArtworkText(galleryData.images.length)}
                </span>
                <span className="text-sm text-gray-400">
                  {galleryData.metadata.viewCount}{" "}
                  {getViewsText(galleryData.metadata.viewCount)}
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
                {t("gallery.back")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Gallery */}
      <ThreeGallery
        paintingData={galleryData.paintingData}
        galleryId={galleryId}
        settings={galleryData.settings}
      />

      {/* Loading indicator */}
      <div
        id="loading-indicator"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white p-4 rounded-lg"
      >
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>{t("gallery.loading")}</span>
        </div>
      </div>

      {/* Gallery Controls */}
      <div className="absolute bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg max-w-xs">
        <h3 className="text-lg font-bold mb-2">{t("gallery.controls")}</h3>
        <div className="space-y-1 text-sm">
          <p>
            <b>W/A/S/D:</b> {t("gallery.move")}
          </p>
          <p>
            <b>Mouse:</b> {t("gallery.look")}
          </p>
          <p>
            <b>Click:</b> {t("gallery.click")}
          </p>
          <p>
            <b>ESC:</b> {t("gallery.escape")}
          </p>
        </div>
      </div>

      {/* Painting Info */}
      <div
        id="painting-info"
        className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded-lg max-w-sm opacity-0 transition-all duration-300 transform translate-y-4"
      >
        <h3 id="painting-title" className="text-xl font-bold mb-2"></h3>
        <p id="painting-artist" className="text-sm text-gray-300 mb-2"></p>
        <p id="painting-description" className="text-sm"></p>
      </div>
    </div>
  );
}

