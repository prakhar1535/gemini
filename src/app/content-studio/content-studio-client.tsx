"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Camera,
  Upload,
  Sparkles,
  Download,
  Copy,
  RefreshCw,
  Star,
  Palette,
  Zap,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";

interface EnhancedImage {
  id: string;
  url: string;
  style: string;
  prompt: string;
  isGenerated: boolean;
}

export function ContentStudioClient() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [enhancedImages, setEnhancedImages] = useState<EnhancedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [enhancementPrompt, setEnhancementPrompt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const styles = [
    {
      id: "professional",
      nameKey: "content_studio.professional",
      descriptionKey: "content_studio.professional_desc",
      icon: Star,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: "lifestyle",
      nameKey: "content_studio.lifestyle",
      descriptionKey: "content_studio.lifestyle_desc",
      icon: Camera,
      color: "bg-green-100 text-green-600",
    },
    {
      id: "editorial",
      nameKey: "content_studio.editorial",
      descriptionKey: "content_studio.editorial_desc",
      icon: Palette,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: "minimalist",
      nameKey: "content_studio.minimalist",
      descriptionKey: "content_studio.minimalist_desc",
      icon: Zap,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setEnhancedImages([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateEnhancements = async () => {
    if (!uploadedImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      clearInterval(progressInterval);
      setGenerationProgress(100);

      // Mock enhanced images
      const mockEnhancedImages: EnhancedImage[] = styles.map(
        (style, index) => ({
          id: `enhanced-${index}`,
          url: uploadedImage, // In real app, this would be the enhanced image URL
          style: style.id,
          prompt: `Enhanced with ${style.id} style`,
          isGenerated: true,
        })
      );

      setEnhancedImages(mockEnhancedImages);
      toast.success("Enhancements generated successfully!");
    } catch (error) {
      toast.error("Failed to generate enhancements");
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleDownload = (image: EnhancedImage) => {
    // In real app, this would download the actual enhanced image
    toast.success("Download started");
  };

  const handleCopy = (image: EnhancedImage) => {
    navigator.clipboard.writeText(image.url);
    toast.success("Image URL copied to clipboard");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("content_studio.title")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("content_studio.subtitle")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>{t("content_studio.upload_image")}</span>
            </CardTitle>
            <CardDescription>{t("content_studio.upload_text")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {uploadedImage ? (
                <div className="space-y-4">
                  <div className="relative mx-auto w-48 h-48">
                    <Image
                      src={uploadedImage}
                      alt="Uploaded"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedImage(null);
                      setEnhancedImages([]);
                    }}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Upload Different Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Camera className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {t("content_studio.upload_text")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("content_studio.upload_formats")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Variations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>{t("content_studio.enhanced_variations")}</span>
            </CardTitle>
            <CardDescription>
              {t("content_studio.enhanced_text")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {enhancedImages.length > 0 ? (
              <div className="space-y-4">
                {enhancedImages.map((image) => (
                  <div key={image.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">
                        {styles.find((s) => s.id === image.style)?.nameKey
                          ? t(styles.find((s) => s.id === image.style)!.nameKey)
                          : image.style}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopy(image)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(image)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="relative w-full h-32">
                      <Image
                        src={image.url}
                        alt={image.style}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  {t("content_studio.enhanced_text")}
                </p>
              </div>
            )}

            {isGenerating && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Generating enhancements...</span>
                  <span>{generationProgress}%</span>
                </div>
                <Progress value={generationProgress} className="w-full" />
              </div>
            )}

            <Button
              className="w-full mt-4"
              onClick={handleGenerateEnhancements}
              disabled={!uploadedImage || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Enhancements
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Enhancement Styles */}
      <Card>
        <CardHeader>
          <CardTitle>{t("content_studio.styles")}</CardTitle>
          <CardDescription>
            {t("content_studio.styles_subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {styles.map((style) => (
              <div
                key={style.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedStyle === style.id
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-muted-foreground/50"
                }`}
                onClick={() => setSelectedStyle(style.id)}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`p-2 rounded-lg ${style.color}`}>
                    <style.icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-medium text-sm">{t(style.nameKey)}</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t(style.descriptionKey)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
