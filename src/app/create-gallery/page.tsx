"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Eye, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  name: string;
}

export default function CreateGalleryPage() {
  const [galleryName, setGalleryName] = useState("");
  const [galleryDescription, setGalleryDescription] = useState("");
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [galleryId, setGalleryId] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: UploadedImage[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const id = Math.random().toString(36).substr(2, 9);
        const preview = URL.createObjectURL(file);

        newImages.push({
          id,
          file,
          preview,
          name: file.name,
        });
      }
    });

    setUploadedImages((prev) => [...prev, ...newImages]);
    toast.success(`${newImages.length} image(s) uploaded successfully`);
  };

  const removeImage = (id: string) => {
    setUploadedImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  const createGallery = async () => {
    if (!galleryName.trim()) {
      toast.error("Please enter a gallery name");
      return;
    }

    if (uploadedImages.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsUploading(true);

    try {
      // Generate a unique gallery ID
      const newGalleryId = Math.random().toString(36).substr(2, 9);

      // Create FormData for image upload
      const formData = new FormData();
      formData.append("galleryId", newGalleryId);

      // Add all uploaded images
      uploadedImages.forEach((image) => {
        formData.append("images", image.file);
      });

      // Upload images to server
      const response = await fetch("/api/upload-gallery-images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload images");
      }

      const result = await response.json();
      console.log("Upload result:", result);

      setGalleryId(newGalleryId);
      toast.success("Gallery created successfully!");
    } catch (error) {
      console.error("Error creating gallery:", error);
      toast.error("Failed to create gallery. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const copyGalleryLink = () => {
    if (galleryId) {
      const link = `${window.location.origin}/gallery/${galleryId}`;
      navigator.clipboard.writeText(link);
      toast.success("Gallery link copied to clipboard!");
    }
  };

  if (galleryId) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Eye className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">
                Gallery Created Successfully!
              </CardTitle>
              <CardDescription>
                Your 3D art gallery is ready to explore
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Share your gallery with others using this link:
                </p>
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                  <LinkIcon className="w-4 h-4 text-muted-foreground" />
                  <code className="flex-1 text-sm">
                    {`${window.location.origin}/gallery/${galleryId}`}
                  </code>
                  <Button size="sm" onClick={copyGalleryLink}>
                    Copy
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button asChild className="flex-1">
                  <a
                    href={`/gallery/${galleryId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Gallery
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <a href="/create-gallery">Create Another</a>
                </Button>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  Want to see how it looks? Check out our demo gallery:
                </p>
                <Button variant="ghost" asChild>
                  <a
                    href="/gallery/demo"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Demo Gallery
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create 3D Art Gallery</h1>
          <p className="text-muted-foreground mt-2">
            Upload your images and create an immersive 3D gallery experience
          </p>
          <div className="mt-4">
            <Button variant="outline" asChild>
              <a href="/gallery/demo" target="_blank" rel="noopener noreferrer">
                <Eye className="w-4 h-4 mr-2" />
                View Demo Gallery
              </a>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gallery Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Gallery Settings</CardTitle>
              <CardDescription>
                Configure your gallery name and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="gallery-name">Gallery Name</Label>
                <Input
                  id="gallery-name"
                  value={galleryName}
                  onChange={(e) => setGalleryName(e.target.value)}
                  placeholder="My Art Gallery"
                />
              </div>

              <div>
                <Label htmlFor="gallery-description">
                  Description (Optional)
                </Label>
                <Textarea
                  id="gallery-description"
                  value={galleryDescription}
                  onChange={(e) => setGalleryDescription(e.target.value)}
                  placeholder="Describe your gallery..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Images</CardTitle>
              <CardDescription>
                Upload your artwork images (JPG, PNG, WebP)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop images here, or click to select
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <Button variant="outline" asChild>
                    <span>Choose Images</span>
                  </Button>
                </Label>
              </div>

              {uploadedImages.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">
                    Uploaded Images ({uploadedImages.length})
                  </p>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {uploadedImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.preview}
                          alt={image.name}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(image.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Create Gallery Button */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Ready to create your gallery?</p>
                <p className="text-sm text-muted-foreground">
                  {uploadedImages.length} image(s) will be displayed in your 3D
                  gallery
                </p>
              </div>
              <Button
                onClick={createGallery}
                disabled={
                  isUploading ||
                  !galleryName.trim() ||
                  uploadedImages.length === 0
                }
                size="lg"
              >
                {isUploading ? "Creating Gallery..." : "Create Gallery"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
