"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Eye,
  MessageSquare,
  ThumbsUp,
  Verified,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Product, Review } from "@/lib/types/marketplace";
import { productService } from "@/lib/services/products";
import { useCart } from "@/lib/cart";

// Mock data - in real app, this would come from API
const mockProduct: Product = {
  id: "1",
  title: "Wireless Bluetooth Headphones",
  description: "Premium noise-canceling headphones with 30-hour battery life and advanced audio technology. Perfect for music lovers, professionals, and anyone who values superior sound quality.",
  price: 199.99,
  originalPrice: 249.99,
  category: "Electronics",
  subcategory: "Audio",
  images: [
    "/placeholder-headphones.jpg",
    "/placeholder-headphones-2.jpg",
    "/placeholder-headphones-3.jpg",
  ],
  thumbnail: "/placeholder-headphones.jpg",
  stock: 25,
  sku: "WBH-001",
  weight: 0.8,
  dimensions: {
    length: 20,
    width: 18,
    height: 8,
  },
  specifications: {
    "Battery Life": "30 hours",
    "Connectivity": "Bluetooth 5.0",
    "Noise Cancellation": "Active",
    "Driver Size": "40mm",
    "Frequency Response": "20Hz - 20kHz",
    "Impedance": "32 ohms",
    "Charging Time": "2 hours",
    "Weight": "250g",
  },
  tags: ["wireless", "bluetooth", "noise-canceling", "premium", "audio"],
  rating: 4.8,
  reviewCount: 1247,
  sellerId: "seller1",
  sellerName: "TechGear Pro",
  sellerRating: 4.9,
  isActive: true,
  isFeatured: true,
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-01-15"),
  views: 15420,
  sales: 342,
};

const mockReviews: Review[] = [
  {
    id: "1",
    productId: "1",
    userId: "user1",
    userName: "Alex Johnson",
    userAvatar: "/placeholder-avatar.jpg",
    rating: 5,
    title: "Excellent sound quality!",
    comment: "These headphones exceeded my expectations. The noise cancellation is incredible and the battery life is exactly as advertised. Highly recommended!",
    images: ["/placeholder-review1.jpg"],
    verified: true,
    helpful: 23,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    productId: "1",
    userId: "user2",
    userName: "Sarah Chen",
    userAvatar: "/placeholder-avatar2.jpg",
    rating: 4,
    title: "Great value for money",
    comment: "Good sound quality and comfortable to wear for long periods. The only downside is that the ear cups could be a bit larger for my ears.",
    verified: true,
    helpful: 15,
    createdAt: new Date("2024-01-18"),
  },
  {
    id: "3",
    productId: "1",
    userId: "user3",
    userName: "Mike Rodriguez",
    userAvatar: "/placeholder-avatar3.jpg",
    rating: 5,
    title: "Perfect for work and travel",
    comment: "I use these for both work calls and music. The microphone quality is excellent and the noise cancellation helps me focus. Great purchase!",
    verified: false,
    helpful: 8,
    createdAt: new Date("2024-01-16"),
  },
];

const mockRelatedProducts: Product[] = [
  {
    id: "2",
    title: "Smart Fitness Tracker",
    description: "Track your fitness goals with advanced health monitoring",
    price: 149.99,
    originalPrice: 199.99,
    category: "Electronics",
    subcategory: "Wearables",
    images: ["/placeholder-fitness.jpg"],
    thumbnail: "/placeholder-fitness.jpg",
    stock: 45,
    sku: "SFT-001",
    specifications: {
      "Battery Life": "7 days",
      "Water Resistance": "5ATM",
      "Sensors": "Heart Rate, GPS, Sleep",
    },
    tags: ["fitness", "health", "tracker"],
    rating: 4.5,
    reviewCount: 523,
    sellerId: "seller1",
    sellerName: "TechGear Pro",
    sellerRating: 4.9,
    isActive: true,
    isFeatured: true,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
    views: 8920,
    sales: 234,
  },
  {
    id: "3",
    title: "Professional Camera Lens",
    description: "High-quality 85mm portrait lens for professional photography",
    price: 899.99,
    originalPrice: 1199.99,
    category: "Electronics",
    subcategory: "Photography",
    images: ["/placeholder-lens.jpg"],
    thumbnail: "/placeholder-lens.jpg",
    stock: 12,
    sku: "PCL-001",
    specifications: {
      "Focal Length": "85mm",
      "Aperture": "f/1.4",
      "Mount": "Canon EF",
    },
    tags: ["camera", "lens", "photography"],
    rating: 4.9,
    reviewCount: 234,
    sellerId: "seller4",
    sellerName: "PhotoPro",
    sellerRating: 4.8,
    isActive: true,
    isFeatured: true,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
    views: 5670,
    sales: 45,
  },
];

interface ProductPageProps {
  params: { id: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    comment: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { addToCart, isLoading: isCartLoading } = useCart();

  useEffect(() => {
    const loadProductData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Load the specific product
        const fetchedProduct = await productService.getProductById(params.id);
        
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          
          // Load related products from the same category
          const relatedResponse = await productService.getProducts({
            category: fetchedProduct.category.toLowerCase(),
            limit: 3
          });
          
          if (relatedResponse.success) {
            // Filter out the current product and limit to 3
            const filtered = relatedResponse.products
              .filter(p => p.id !== params.id)
              .slice(0, 3);
            setRelatedProducts(filtered);
          }
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product');
        console.error('Error loading product:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProductData();
  }, [params.id]);

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    };
    
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${sizeClasses[size]} ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, selectedOptions);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity, selectedOptions);
    // Redirect to checkout
    window.location.href = "/checkout";
  };

  const handleSubmitReview = () => {
    // Submit review logic
    console.log("Submit review:", newReview);
    setShowReviewDialog(false);
    setNewReview({ rating: 5, title: "", comment: "" });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Product Not Found</h3>
            <p className="text-muted-foreground mb-4">{error || 'The product you are looking for does not exist.'}</p>
            <Button asChild>
              <Link href="/marketplace">Back to Marketplace</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/marketplace" className="hover:text-foreground">
            Marketplace
          </Link>
          <span>/</span>
          <Link href={`/marketplace?category=${product.category.toLowerCase()}`} className="hover:text-foreground">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.title}</span>
        </div>

        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/marketplace">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Link>
        </Button>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      index === selectedImageIndex
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Badges */}
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h1 className="text-2xl font-bold">{product.title}</h1>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {renderStars(product.rating, "md")}
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
                <Badge variant="secondary">{product.category}</Badge>
                {product.isFeatured && (
                  <Badge variant="default">Featured</Badge>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold">${product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                    <Badge className="bg-red-500">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                SKU: {product.sku} | Stock: {product.stock} available
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Product Options */}
            <div className="space-y-4">
              <h3 className="font-semibold">Options</h3>
              
              {/* Color Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Color</label>
                <div className="flex space-x-2">
                  {["Black", "White", "Blue"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedOptions({...selectedOptions, color})}
                      className={`px-4 py-2 border rounded-md text-sm ${
                        selectedOptions.color === color
                          ? "border-primary bg-primary/10"
                          : "border-gray-300"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-sm font-medium mb-2 block">Quantity</label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleAddToCart} 
                className="w-full" 
                size="lg"
                disabled={isCartLoading || !product}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isCartLoading ? "Adding..." : "Add to Cart"}
              </Button>
              <Button 
                onClick={handleBuyNow} 
                variant="outline" 
                className="w-full" 
                size="lg"
                disabled={isCartLoading || !product}
              >
                Buy Now
              </Button>
            </div>

            {/* Seller Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Sold by</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {product.sellerName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{product.sellerName}</p>
                    <div className="flex items-center space-x-1">
                      {renderStars(product.sellerRating, "sm")}
                      <span className="text-xs text-muted-foreground">
                        ({product.sellerRating})
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center space-y-1">
                <Truck className="h-6 w-6 text-green-600" />
                <span className="text-xs">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <Shield className="h-6 w-6 text-blue-600" />
                <span className="text-xs">2 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <RotateCcw className="h-6 w-6 text-purple-600" />
                <span className="text-xs">30 Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="specifications" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            <TabsTrigger value="related">Related Products</TabsTrigger>
          </TabsList>
          
          <TabsContent value="specifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b">
                      <span className="font-medium">{key}</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Customer Reviews</h3>
                <p className="text-muted-foreground">
                  {product.reviewCount} reviews with an average rating of {product.rating}
                </p>
              </div>
              <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
                <DialogTrigger asChild>
                  <Button>Write a Review</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Rating</label>
                      <div className="flex space-x-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => setNewReview({...newReview, rating: i + 1})}
                            className="text-2xl"
                          >
                            <Star
                              className={`h-8 w-8 ${
                                i < newReview.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Title</label>
                      <Input
                        value={newReview.title}
                        onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                        placeholder="Summarize your experience"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Review</label>
                      <Textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                        placeholder="Tell others about your experience with this product"
                        rows={4}
                      />
                    </div>
                    <Button onClick={handleSubmitReview} className="w-full">
                      Submit Review
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {review.userName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium">{review.userName}</span>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">
                              <Verified className="h-3 w-3 mr-1" />
                              Verified Purchase
                            </Badge>
                          )}
                          <div className="flex items-center space-x-1">
                            {renderStars(review.rating, "sm")}
                          </div>
                        </div>
                        <h4 className="font-medium mb-1">{review.title}</h4>
                        <p className="text-muted-foreground mb-3">{review.comment}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {review.createdAt.toLocaleDateString()}
                          </span>
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Helpful ({review.helpful})
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="shipping" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Standard Shipping:</strong> 3-5 business days - FREE</p>
                  <p><strong>Express Shipping:</strong> 1-2 business days - $9.99</p>
                  <p><strong>Same Day Delivery:</strong> Available in select areas - $19.99</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Returns & Exchanges</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Return Period:</strong> 30 days from delivery</p>
                  <p><strong>Return Shipping:</strong> FREE for defective items</p>
                  <p><strong>Exchange:</strong> Available for size/color changes</p>
                  <p><strong>Refund Processing:</strong> 3-5 business days</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="related" className="space-y-4">
            <h3 className="text-lg font-semibold">Related Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100">
                    <img
                      src={relatedProduct.thumbnail}
                      alt={relatedProduct.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="pt-4">
                    <h4 className="font-medium line-clamp-2 mb-2">{relatedProduct.title}</h4>
                    <div className="flex items-center space-x-1 mb-2">
                      {renderStars(relatedProduct.rating, "sm")}
                      <span className="text-xs text-muted-foreground">
                        ({relatedProduct.reviewCount})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">${relatedProduct.price}</span>
                      {relatedProduct.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          ${relatedProduct.originalPrice}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
