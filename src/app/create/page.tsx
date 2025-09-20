"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  PenTool,
  Camera,
  Image as ImageIcon,
  Zap,
  Copy,
  Download,
  Upload,
  Sparkles,
  Twitter,
  Linkedin,
  Instagram,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateContentPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<
    "x" | "linkedin" | "instagram"
  >("x");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<
    "professional" | "casual" | "friendly" | "authoritative"
  >("professional");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeCallToAction, setIncludeCallToAction] = useState(true);
  const [imageDescription, setImageDescription] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [generatedCallToAction, setGeneratedCallToAction] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isGeneratingFromImage, setIsGeneratingFromImage] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const platformIcons = {
    x: Twitter,
    linkedin: Linkedin,
    instagram: Instagram,
  };

  const handleGenerateContent = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic for your content");
      return;
    }

    setIsGenerating(true);
    try {
      // Check if Gemini API key is available
      if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        toast.error(
          "Gemini API key not configured. Please add your API key in the settings."
        );
        return;
      }

      // Prepare content generation request
      const request = {
        platform: selectedPlatform,
        topic: topic,
        tone: tone,
        length: length,
        includeHashtags: includeHashtags,
        includeCallToAction: includeCallToAction,
        imageDescription: imageDescription,
      };

      let response;

      if (uploadedImage) {
        // If image is uploaded, use image-to-content generation
        const base64 = uploadedImage.split(",")[1];
        const apiResponse = await fetch("/api/generate-content", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "image",
            data: {
              base64,
              platform: selectedPlatform,
              additionalPrompt: `Generate engaging social media content for ${selectedPlatform} about "${topic}" with ${tone} tone. The content should be ${length} length and relate to the uploaded image. ${
                imageDescription
                  ? `Additional context: ${imageDescription}`
                  : ""
              }`,
            },
          }),
        });

        if (!apiResponse.ok) {
          throw new Error("Failed to generate content from image");
        }

        response = await apiResponse.json();
      } else {
        // Regular text-based content generation
        const apiResponse = await fetch("/api/generate-content", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "text",
            data: request,
          }),
        });

        if (!apiResponse.ok) {
          throw new Error("Failed to generate content");
        }

        response = await apiResponse.json();
      }

      if (response.content && response.content.trim()) {
        setGeneratedContent(response.content);
        setGeneratedHashtags(response.hashtags || []);
        setGeneratedCallToAction(response.callToAction || "");
        setSuggestions(response.suggestions || []);
        toast.success("Content generated successfully!");
      } else {
        throw new Error("Empty response from AI service");
      }
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      toast.success("Image uploaded successfully!");
    }
  };

  const handleGenerateFromImage = async () => {
    if (!uploadedImage || !imageFile) {
      toast.error("Please upload an image first");
      return;
    }

    setIsGeneratingFromImage(true);
    try {
      // Convert image to base64 for Gemini API
      const base64 = uploadedImage.split(",")[1];

      // Check if Gemini API key is available
      if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        toast.error(
          "Gemini API key not configured. Please add your API key in the settings."
        );
        return;
      }

      // Use API route to analyze the image and generate content
      const apiResponse = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "image",
          data: {
            base64,
            platform: selectedPlatform,
            additionalPrompt: `Generate engaging social media content for ${selectedPlatform} based on this image. Make it specific to what you see in the image.`,
          },
        }),
      });

      if (!apiResponse.ok) {
        throw new Error("Failed to generate content from image");
      }

      const response = await apiResponse.json();

      if (response.content && response.content.trim()) {
        setGeneratedContent(response.content);
        setGeneratedHashtags(response.hashtags || []);
        setGeneratedCallToAction(response.callToAction || "");
        setSuggestions(response.suggestions || []);
        toast.success("Content generated from image successfully!");
      } else {
        throw new Error("Empty response from AI service");
      }
    } catch (error) {
      console.error("Error generating content from image:", error);
      toast.error("Failed to generate content from image. Please try again.");
    } finally {
      setIsGeneratingFromImage(false);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setImageFile(null);
    toast.success("Image removed");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Please drop a valid image file");
      }
    }
  };

  const handleCopyContent = () => {
    const fullContent = `${generatedContent}\n\n${generatedHashtags.join(
      " "
    )}\n\n${generatedCallToAction}`;
    navigator.clipboard.writeText(fullContent);
    toast.success("Content copied to clipboard!");
  };

  const handleDownloadContent = () => {
    const fullContent = `${generatedContent}\n\n${generatedHashtags.join(
      " "
    )}\n\n${generatedCallToAction}`;
    const blob = new Blob([fullContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `content-${selectedPlatform}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Content downloaded!");
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Create Content
            </h1>
            <p className="text-muted-foreground mt-2">
              Generate engaging posts for your social media platforms with AI
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Content Generation Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PenTool className="h-5 w-5" />
                  <span>Content Settings</span>
                </CardTitle>
                <CardDescription>
                  Configure your content generation preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Platform Selection */}
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["x", "linkedin", "instagram"] as const).map(
                      (platform) => {
                        const Icon = platformIcons[platform];
                        return (
                          <Button
                            key={platform}
                            variant={
                              selectedPlatform === platform
                                ? "default"
                                : "outline"
                            }
                            className="flex flex-col items-center space-y-2 h-auto py-4"
                            onClick={() => setSelectedPlatform(platform)}
                          >
                            <Icon className="h-5 w-5" />
                            <span className="capitalize">{platform}</span>
                          </Button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Topic Input */}
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic or Theme</Label>
                  <Input
                    id="topic"
                    placeholder="What do you want to post about?"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>

                {/* Tone and Length */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tone</Label>
                    <Select
                      value={tone}
                      onValueChange={(value: any) => setTone(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">
                          Professional
                        </SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="authoritative">
                          Authoritative
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Length</Label>
                    <Select
                      value={length}
                      onValueChange={(value: any) => setLength(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="long">Long</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hashtags">Include Hashtags</Label>
                    <Switch
                      id="hashtags"
                      checked={includeHashtags}
                      onCheckedChange={setIncludeHashtags}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cta">Include Call to Action</Label>
                    <Switch
                      id="cta"
                      checked={includeCallToAction}
                      onCheckedChange={setIncludeCallToAction}
                    />
                  </div>
                </div>

                {/* Image Description */}
                <div className="space-y-2">
                  <Label htmlFor="image-description">
                    Image Description (Optional)
                  </Label>
                  <Textarea
                    id="image-description"
                    placeholder="Describe the image you want to include with your post..."
                    value={imageDescription}
                    onChange={(e) => setImageDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerateContent}
                  disabled={isGenerating || !topic.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Generate Content
                      {uploadedImage && (
                        <span className="ml-2 text-xs opacity-75">
                          (with image)
                        </span>
                      )}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="h-5 w-5" />
                  <span>Upload Image</span>
                </CardTitle>
                <CardDescription>
                  Upload an image to generate content from it
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragOver
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload
                      className={`mx-auto h-12 w-12 mb-4 transition-colors ${
                        isDragOver ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <p
                      className={`text-sm transition-colors ${
                        isDragOver ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {isDragOver
                        ? "Drop your image here"
                        : "Click to upload an image or drag and drop"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </label>
                </div>
                {uploadedImage && (
                  <div className="mt-4 space-y-3">
                    <div className="relative">
                      <img
                        src={uploadedImage}
                        alt="Uploaded"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={handleGenerateFromImage}
                        disabled={isGeneratingFromImage}
                      >
                        {isGeneratingFromImage ? (
                          <>
                            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Generate Content from Image
                          </>
                        )}
                      </Button>
                    </div>
                    {imageFile && (
                      <div className="text-xs text-muted-foreground">
                        <p>File: {imageFile.name}</p>
                        <p>
                          Size: {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Generated Content */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Generated Content</span>
                  {generatedContent && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyContent}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadContent}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardTitle>
                <CardDescription>
                  Your AI-generated content for {selectedPlatform}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedContent ? (
                  <>
                    {uploadedImage && (
                      <div className="mb-4">
                        <img
                          src={uploadedImage}
                          alt="Post image"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-foreground whitespace-pre-wrap">
                        {generatedContent}
                      </p>
                    </div>

                    {generatedHashtags.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Hashtags</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {generatedHashtags.map((hashtag, index) => (
                            <Badge key={index} variant="secondary">
                              {hashtag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {generatedCallToAction && (
                      <div>
                        <Label className="text-sm font-medium">
                          Call to Action
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {generatedCallToAction}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Sparkles className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>Generated content will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Suggestions</CardTitle>
                  <CardDescription>
                    AI recommendations to improve your content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {suggestion}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
