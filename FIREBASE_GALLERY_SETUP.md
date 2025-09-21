# Firebase 3D Gallery Setup

This document provides the complete setup for storing 3D gallery images and galleries in Firebase Storage and Firestore.

## Environment Variables Required

Add these environment variables to your `.env.local` file:

```env
# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id",...}
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Firebase Storage Structure

```
your-bucket/
├── gallery-images/
│   └── {galleryId}/
│       ├── {uuid1}.jpg
│       ├── {uuid2}.png
│       └── {uuid3}.webp
└── user-avatars/
    └── {userId}/
        └── avatar.jpg
```

## Firestore Collections Schema

### 1. `galleries` Collection

Each document represents a 3D gallery:

```typescript
{
  id: string, // Document ID
  name: string,
  description: string,
  images: GalleryImage[],
  paintingData: PaintingData[],
  settings: {
    backgroundColor?: string,
    lightingIntensity?: number,
    showAudioGuide?: boolean,
    showInfoPanels?: boolean
  },
  metadata: {
    createdAt: Date,
    updatedAt: Date,
    createdBy: string, // User ID
    isPublic: boolean,
    viewCount: number,
    tags: string[]
  }
}
```

### 2. `galleryImages` Collection

Each document represents an individual image:

```typescript
{
  id: string, // Document ID
  filename: string,
  originalName: string,
  url: string, // Public URL from Firebase Storage
  storagePath: string, // Path in Firebase Storage
  size: number, // File size in bytes
  mimeType: string,
  width?: number,
  height?: number,
  uploadedAt: Date,
  order: number // For positioning in gallery
}
```

### 3. `users` Collection (Optional - for future user management)

```typescript
{
  id: string, // Document ID
  email: string,
  displayName: string,
  avatarUrl?: string,
  createdAt: Date,
  galleries: string[], // Array of gallery IDs
  preferences: {
    defaultGallerySettings: {
      backgroundColor: string,
      lightingIntensity: number,
      showAudioGuide: boolean,
      showInfoPanels: boolean
    }
  }
}
```

## API Endpoints

### Gallery Management

#### `POST /api/galleries`

Create a new gallery with images.

**Request:**

```typescript
FormData {
  name: string,
  description: string,
  images: File[],
  isPublic?: boolean,
  tags?: string[],
  createdBy?: string
}
```

**Response:**

```typescript
{
  success: boolean,
  gallery: Gallery,
  message: string
}
```

#### `GET /api/galleries`

Get galleries with optional filtering.

**Query Parameters:**

- `userId?: string` - Filter by user
- `isPublic?: boolean` - Filter public galleries
- `limit?: number` - Limit results (default: 10)

**Response:**

```typescript
{
  success: boolean,
  galleries: Gallery[],
  count: number
}
```

#### `GET /api/galleries/[id]`

Get a specific gallery by ID.

**Response:**

```typescript
{
  success: boolean,
  gallery: Gallery
}
```

#### `PUT /api/galleries/[id]`

Update a gallery.

**Request:**

```typescript
{
  name?: string,
  description?: string,
  settings?: GallerySettings,
  metadata?: {
    isPublic?: boolean,
    tags?: string[]
  }
}
```

#### `DELETE /api/galleries/[id]`

Delete a gallery and all associated images.

### Image Management

#### `POST /api/galleries/upload-images`

Upload images for a gallery.

**Request:**

```typescript
FormData {
  galleryId: string,
  images: File[]
}
```

**Response:**

```typescript
{
  success: boolean,
  galleryId: string,
  uploadedImages: GalleryImage[],
  message: string
}
```

#### `DELETE /api/galleries/upload-images`

Delete a specific image.

**Request:**

```typescript
{
  imageId: string;
}
```

## Firebase Security Rules

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Galleries collection
    match /galleries/{galleryId} {
      allow read: if resource.data.metadata.isPublic == true;
      allow write: if request.auth != null &&
        (request.auth.uid == resource.data.metadata.createdBy ||
         !exists(/databases/$(database)/documents/galleries/$(galleryId)));
    }

    // Gallery images collection
    match /galleryImages/{imageId} {
      allow read: if true; // Images are public via Storage
      allow write: if request.auth != null;
    }

    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Gallery images
    match /gallery-images/{galleryId}/{fileName} {
      allow read: if true; // Public read access
      allow write: if request.auth != null;
    }

    // User avatars
    match /user-avatars/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Usage Examples

### Creating a Gallery

```typescript
const formData = new FormData();
formData.append("name", "My Art Gallery");
formData.append("description", "A collection of my favorite artworks");
formData.append("isPublic", "true");
formData.append("tags", JSON.stringify(["art", "personal"]));

// Add image files
images.forEach((image) => {
  formData.append("images", image);
});

const response = await fetch("/api/galleries", {
  method: "POST",
  body: formData,
});

const result = await response.json();
console.log("Gallery created:", result.gallery.id);
```

### Fetching a Gallery

```typescript
const response = await fetch(`/api/galleries/${galleryId}`);
const result = await response.json();

if (result.success) {
  const gallery = result.gallery;
  console.log("Gallery name:", gallery.name);
  console.log("Number of images:", gallery.images.length);
  console.log("View count:", gallery.metadata.viewCount);
}
```

### Updating Gallery Settings

```typescript
const response = await fetch(`/api/galleries/${galleryId}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    settings: {
      backgroundColor: "#1a1a1a",
      lightingIntensity: 0.8,
      showAudioGuide: false,
    },
  }),
});
```

## Migration from File System

If you have existing galleries stored in the file system (like the current setup in `public/gallery-assets/user-galleries/`), you can migrate them using this script:

```typescript
// Migration script (run once)
async function migrateExistingGalleries() {
  const fs = await import("fs");
  const path = await import("path");

  const userGalleriesDir = path.join(
    process.cwd(),
    "public",
    "gallery-assets",
    "user-galleries"
  );

  if (fs.existsSync(userGalleriesDir)) {
    const galleryDirs = fs.readdirSync(userGalleriesDir);

    for (const galleryId of galleryDirs) {
      const galleryPath = path.join(userGalleriesDir, galleryId);
      const images = fs
        .readdirSync(galleryPath)
        .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));

      // Upload images to Firebase Storage
      // Create gallery document in Firestore
      // Delete local files after successful migration
    }
  }
}
```

## Performance Considerations

1. **Image Optimization**: Consider implementing image resizing/compression before upload
2. **Caching**: Implement caching for frequently accessed galleries
3. **Pagination**: Use pagination for large gallery lists
4. **CDN**: Firebase Storage automatically provides CDN for better performance
5. **Lazy Loading**: Load gallery images on demand in the 3D viewer

## Error Handling

All API endpoints return consistent error responses:

```typescript
{
  success: false,
  error: string,
  details?: any
}
```

Common error scenarios:

- Invalid gallery ID (404)
- Missing required fields (400)
- Upload failures (500)
- Permission denied (403)

## Next Steps

1. Set up Firebase project and enable Storage/Firestore
2. Configure environment variables
3. Deploy security rules
4. Test API endpoints
5. Update frontend components to use new APIs
6. Implement user authentication (optional)
7. Add image optimization pipeline
8. Set up monitoring and analytics
