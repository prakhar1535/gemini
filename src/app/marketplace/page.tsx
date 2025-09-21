"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { productService, CategoriesResponse } from "@/lib/services/products";
import { useCart } from "@/lib/cart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  Star,
  ShoppingCart,
  Heart,
  Eye,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { Product, SearchFilters } from "@/lib/types/marketplace";

// Mock data - in real app, this would come from API
const mockProducts: Product[] = [
  {
    id: "1",
    title: "Wireless Bluetooth Headphones",
    description: "Premium noise-canceling headphones with 30-hour battery life",
    price: 199.99,
    originalPrice: 249.99,
    category: "Electronics",
    subcategory: "Audio",
    images: ["/placeholder-headphones.jpg"],
    thumbnail: "/placeholder-headphones.jpg",
    stock: 25,
    sku: "WBH-001",
    specifications: {
      "Battery Life": "30 hours",
      "Connectivity": "Bluetooth 5.0",
      "Noise Cancellation": "Active",
    },
    tags: ["wireless", "bluetooth", "noise-canceling"],
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
  },
  {
    id: "2",
    title: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable organic cotton t-shirt",
    price: 29.99,
    category: "Fashion",
    subcategory: "Clothing",
    images: ["/placeholder-tshirt.jpg"],
    thumbnail: "/placeholder-tshirt.jpg",
    stock: 150,
    sku: "OCT-001",
    specifications: {
      "Material": "100% Organic Cotton",
      "Care": "Machine Washable",
      "Sizes": "XS-XXL",
    },
    tags: ["organic", "cotton", "sustainable"],
    rating: 4.6,
    reviewCount: 89,
    sellerId: "seller2",
    sellerName: "EcoFashion",
    sellerRating: 4.7,
    isActive: true,
    isFeatured: false,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
    views: 3420,
    sales: 156,
  },
  {
    id: "3",
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
    id: "4",
    title: "Artisan Ceramic Coffee Mug",
    description: "Handcrafted ceramic mug perfect for your morning coffee",
    price: 24.99,
    category: "Home & Garden",
    subcategory: "Kitchen",
    images: ["/placeholder-mug.jpg"],
    thumbnail: "/placeholder-mug.jpg",
    stock: 75,
    sku: "ACM-001",
    specifications: {
      "Material": "Handcrafted Ceramic",
      "Capacity": "12 oz",
      "Dishwasher Safe": "Yes",
    },
    tags: ["ceramic", "handcrafted", "coffee"],
    rating: 4.9,
    reviewCount: 67,
    sellerId: "seller3",
    sellerName: "Artisan Crafts",
    sellerRating: 4.8,
    isActive: true,
    isFeatured: false,
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08"),
    views: 2150,
    sales: 89,
  },
  {
    id: "5",
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
  {
    id: "6",
    title: "Natural Skincare Set",
    description: "Complete skincare routine with natural and organic ingredients",
    price: 79.99,
    category: "Health & Beauty",
    subcategory: "Skincare",
    images: ["/placeholder-skincare.jpg"],
    thumbnail: "/placeholder-skincare.jpg",
    stock: 60,
    sku: "NSS-001",
    specifications: {
      "Ingredients": "100% Natural",
      "Skin Type": "All Types",
      "Cruelty Free": "Yes",
    },
    tags: ["skincare", "natural", "organic"],
    rating: 4.7,
    reviewCount: 156,
    sellerId: "seller5",
    sellerName: "Natural Beauty",
    sellerRating: 4.6,
    isActive: true,
    isFeatured: false,
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
    views: 4320,
    sales: 78,
  },
];

// Categories will be loaded from API

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{id: string; name: string; count: number}>>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { addToCart } = useCart();

  // Load products and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Load categories first
        const categoriesResponse = await productService.getCategories();
        if (categoriesResponse.success) {
          const formattedCategories = categoriesResponse.categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            count: cat.productCount
          }));
          setCategories(formattedCategories);
        }

        // Load products
        const productsResponse = await productService.getProducts({
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          search: searchQuery || undefined,
        });

        if (productsResponse.success) {
          setProducts(productsResponse.products);
          setFilteredProducts(productsResponse.products);
        } else {
          setError(productsResponse.error || 'Failed to load products');
        }
      } catch (err) {
        setError('Failed to load data');
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedCategory, searchQuery]);

  // Filter and sort products
  useEffect(() => {
    let filtered = products;

    // Sort
    switch (sortBy) {
      case "price_asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "popular":
        filtered.sort((a, b) => b.views - a.views);
        break;
      case "sales":
        filtered.sort((a, b) => b.sales - a.sales);
        break;
    }

    setFilteredProducts(filtered);
  }, [products, sortBy]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
      <div className="relative">
        <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        {product.originalPrice && (
          <Badge className="absolute top-2 left-2 bg-red-500">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </Badge>
        )}
        {product.isFeatured && (
          <Badge className="absolute top-2 right-2 bg-blue-500">
            Featured
          </Badge>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm font-medium line-clamp-2">
              {product.title}
            </CardTitle>
            <CardDescription className="text-xs text-gray-500 mt-1">
              by {product.sellerName}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            {renderStars(product.rating)}
            <span className="text-sm text-gray-600">({product.reviewCount})</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Eye className="h-3 w-3" />
              <span>{product.views}</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <ShoppingCart className="h-3 w-3" />
              <span>{product.sales}</span>
            </div>
          </div>
          
          <div className="flex space-x-2 mt-2">
            <Button 
              onClick={() => addToCart(product)}
              className="flex-1"
              size="sm"
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Add to Cart
            </Button>
            <Button asChild variant="outline" className="flex-1" size="sm">
              <Link href={`/marketplace/product/${product.id}`}>
                View Details
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div>
            <h1 className="text-3xl font-bold">Marketplace</h1>
            <p className="text-muted-foreground">
              Discover amazing products from trusted sellers
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="sales">Best Selling</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading products...</p>
          ) : error ? (
            <p className="text-sm text-red-600">Error: {error}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          )}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Error Loading Products</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredProducts.length > 0 && (
          <div className="text-center">
            <Button variant="outline" size="lg">
              Load More Products
            </Button>
          </div>
        )}

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSortBy("popular");
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
