export interface GalleryImage {
  id: string;
  filename: string;
  originalName: string;
  base64: string; // Base64 encoded image data
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  uploadedAt: Date;
  order: number; // For positioning in gallery
}

export interface GalleryPaintingData {
  imageId: string; // Required for gallery paintings
  imgSrc?: string; // Optional image source for display
  width: number;
  height: number;
  position: { x: number; y: number; z: number };
  rotationY: number;
  info: GalleryInfo;
}

export interface GalleryInfo {
  title: string;
  artist: string;
  description: string;
  year: string;
  link?: string;
}

export interface Gallery {
  id: string;
  name: string;
  description: string;
  imageIds: string[]; // Array of image IDs (stored in subcollection)
  images?: GalleryImage[]; // Optional array of actual image data
  paintingData: GalleryPaintingData[];
  settings: {
    backgroundColor?: string;
    lightingIntensity?: number;
    showAudioGuide?: boolean;
    showInfoPanels?: boolean;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string; // User ID
    isPublic: boolean;
    viewCount: number;
    tags: string[];
  };
}

export interface CreateGalleryRequest {
  name: string;
  description: string;
  images: File[];
  settings?: {
    backgroundColor?: string;
    lightingIntensity?: number;
    showAudioGuide?: boolean;
    showInfoPanels?: boolean;
  };
  metadata?: {
    isPublic?: boolean;
    tags?: string[];
  };
}

export interface UpdateGalleryRequest {
  name?: string;
  description?: string;
  settings?: {
    backgroundColor?: string;
    lightingIntensity?: number;
    showAudioGuide?: boolean;
    showInfoPanels?: boolean;
  };
  metadata?: {
    isPublic?: boolean;
    tags?: string[];
  };
}

// Firestore Collection Names
export const COLLECTIONS = {
  GALLERIES: "galleries",
  GALLERY_IMAGES: "galleryImages",
  USERS: "users",
} as const;

// Storage Paths
export const STORAGE_PATHS = {
  GALLERY_IMAGES: "gallery-images",
  USER_AVATARS: "user-avatars",
} as const;
