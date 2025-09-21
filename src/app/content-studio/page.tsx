"use client";

import { useState, useRef } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
// Removed direct import - will use API instead

interface EnhancedImage {
  id: string;
  url: string;
  style: string;
  prompt: string;
  isGenerated: boolean;
}

export default function ContentStudioPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [enhancedImages, setEnhancedImages] = useState<EnhancedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [enhancementPrompt, setEnhancementPrompt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const styles = [
    {
      id: "professional",
      name: "Professional Product",
      description: "Studio lighting, clean background, commercial quality",
      icon: "💼",
    },
    {
      id: "lifestyle",
      name: "Lifestyle",
      description: "Natural lighting, authentic feel, social media ready",
      icon: "🌅",
    },
    {
      id: "editorial",
      name: "Editorial",
      description: "Dramatic lighting, artistic composition, magazine style",
      icon: "📰",
    },
    {
      id: "minimalist",
      name: "Minimalist",
      description: "Clean lines, soft lighting, modern aesthetic",
      icon: "✨",
    },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setUploadedImage(imageUrl);
        setEnhancedImages([]);
        toast.success("Image uploaded successfully!");
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please upload a valid image file");
    }
  };

  const generateEnhancedImages = async () => {
    if (!uploadedImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setEnhancedImages([]);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const basePrompt = enhancementPrompt || "Enhance this image for professional social media content";
      
      // Generate 4 different style variations
      const newImages: EnhancedImage[] = [];
      
      for (let i = 0; i < styles.length; i++) {
        const style = styles[i];
        const enhancedPrompt = `${basePrompt} - ${style.description}`;
        
        try {
          const response = await fetch('/api/enhance-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageUrl: uploadedImage,
              style: style.id,
              prompt: enhancedPrompt,
            }),
          });

          const data = await response.json();
          
          if (data.success && data.variations.length > 0) {
            // Create multiple images for each variation
            data.variations.forEach((variationUrl: string, index: number) => {
              newImages.push({
                id: `${style.id}-${Date.now()}-${index}`,
                url: variationUrl,
                style: style.name,
                prompt: enhancedPrompt,
                isGenerated: true,
              });
            });
          } else {
            throw new Error(data.error || 'Failed to generate variation');
          }
        } catch (error) {
          console.error(`Error generating ${style.name} variation:`, error);
          // Add placeholder for failed generation
          newImages.push({
            id: `${style.id}-${Date.now()}`,
            url: uploadedImage, // Fallback to original
            style: style.name,
            prompt: enhancedPrompt,
            isGenerated: false,
          });
        }
        
        setGenerationProgress(((i + 1) / styles.length) * 90);
      }

      clearInterval(progressInterval);
      setGenerationProgress(100);
      setEnhancedImages(newImages);
      
      toast.success("Image enhancements generated successfully!");
      
    } catch (error) {
      console.error("Error generating enhanced images:", error);
      toast.error("Failed to generate enhanced images. Please try again.");
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 1000);
    }
  };

  const regenerateStyle = async (styleId: string) => {
    if (!uploadedImage) return;

    const style = styles.find(s => s.id === styleId);
    if (!style) return;

    setIsGenerating(true);
    
    try {
      const basePrompt = enhancementPrompt || "Enhance this image for professional social media content";
      const enhancedPrompt = `${basePrompt} - ${style.description}`;
      
      const response = await fetch('/api/enhance-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: uploadedImage,
          style: styleId,
          prompt: enhancedPrompt,
        }),
      });

      const data = await response.json();
      
      if (data.success && data.variations.length > 0) {
        // Remove existing images for this style and add new ones
        setEnhancedImages(prev => {
          const filtered = prev.filter(img => img.style !== style.name);
          const newVariations = data.variations.map((variationUrl: string, index: number) => ({
            id: `${style.id}-${Date.now()}-${index}`,
            url: variationUrl,
            style: style.name,
            prompt: enhancedPrompt,
            isGenerated: true,
          }));
          return [...filtered, ...newVariations];
        });
        toast.success(`${style.name} variations regenerated!`);
      } else {
        throw new Error(data.error || 'Failed to regenerate variation');
      }
    } catch (error) {
      console.error(`Error regenerating ${style.name}:`, error);
      toast.error(`Failed to regenerate ${style.name} variation`);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Button variant="ghost" size="sm" asChild>
                <a href="/create">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Chat
                </a>
              </Button>
            </div>
            <h1 className="text-3xl font-bold">Content Studio</h1>
            <p className="text-muted-foreground">
              Professional image enhancement and content generation
            </p>
          </div>
          <div className="flex space-x-2">
            <Badge variant="secondary" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Palette className="h-3 w-3 mr-1" />
              Multi-Style
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Image
                </CardTitle>
                <CardDescription>
                  Upload an image to enhance for social media
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!uploadedImage ? (
                  <div
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <Image
                        src={uploadedImage}
                        alt="Uploaded image"
                        width={300}
                        height={300}
                        className="rounded-lg object-cover w-full"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setUploadedImage(null);
                          setEnhancedImages([]);
                        }}
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Description/Prompt Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Enhancement Prompt (Optional)</label>
                      <textarea
                        placeholder="Describe how you want to enhance your image... (e.g., 'Make it look professional for LinkedIn', 'Add dramatic lighting', 'Create a lifestyle shot')"
                        className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        value={enhancementPrompt}
                        onChange={(e) => setEnhancementPrompt(e.target.value)}
                      />
                    </div>
                    
                    <Button
                      onClick={generateEnhancedImages}
                      disabled={isGenerating}
                      className="w-full"
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
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {isGenerating && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Generating styles...</span>
                      <span>{generationProgress}%</span>
                    </div>
                    <Progress value={generationProgress} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Images Grid */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Enhanced Variations</CardTitle>
                <CardDescription>
                  Choose from professionally enhanced versions of your image
                </CardDescription>
              </CardHeader>
              <CardContent>
                {enhancedImages.length === 0 ? (
                  <div className="text-center py-12">
                    <Palette className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Upload an image and click "Generate Enhancements" to see professional variations
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {enhancedImages.map((image) => (
                      <div key={image.id} className="space-y-3">
                        <div className="relative group">
                          <Image
                            src={image.url}
                            alt={image.style}
                            width={400}
                            height={400}
                            className="rounded-lg object-cover w-full aspect-square"
                          />
                          
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => downloadImage(image.url, `${image.style.toLowerCase().replace(' ', '-')}-enhanced.jpg`)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => regenerateStyle(styles.find(s => s.name === image.style)?.id || '')}
                                disabled={isGenerating}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {image.isGenerated ? (
                            <Badge className="absolute top-2 left-2 bg-green-500">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              AI Enhanced
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="absolute top-2 left-2">
                              Failed
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{image.style}</h3>
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(image.prompt)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => downloadImage(image.url, `${image.style.toLowerCase().replace(' ', '-')}-enhanced.jpg`)}
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {styles.find(s => s.name === image.style)?.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Style Information */}
        <Card>
          <CardHeader>
            <CardTitle>Enhancement Styles</CardTitle>
            <CardDescription>
              Each style applies different professional techniques to your image
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {styles.map((style) => (
                <div key={style.id} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl mb-2">{style.icon}</div>
                  <h3 className="font-medium mb-1">{style.name}</h3>
                  <p className="text-sm text-muted-foreground">{style.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
