"use client";

import { useState, useEffect } from "react";
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
import { useLanguage } from "@/lib/language-context";

// Mock data - in real app, this would come from API
const mockProducts: Product[] = [
  {
    id: "1",
    title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    description:
      "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
    price: 109.95,
    originalPrice: 142.94,
    discount: 23,
    rating: 4.5,
    reviewCount: 120,
    image: "/gallery-assets/artworks/0.jpg",
    category: "electronics",
    tags: ["backpack", "laptop", "travel"],
    seller: "Fake Store Official",
    inStock: true,
    viewCount: 1250,
    cartCount: 89,
  },
  {
    id: "2",
    title: "Mens Casual Premium Slim Fit T-Shirts",
    description:
      "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.",
    price: 22.3,
    originalPrice: 28.99,
    discount: 23,
    rating: 4.1,
    reviewCount: 259,
    image: "/gallery-assets/artworks/1.jpg",
    category: "clothing",
    tags: ["tshirt", "casual", "mens"],
    seller: "Fake Store Official",
    inStock: true,
    viewCount: 890,
    cartCount: 156,
  },
  {
    id: "3",
    title: "Mens Cotton Jacket",
    description:
      "Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors.",
    price: 55.99,
    originalPrice: 72.79,
    discount: 23,
    rating: 4.7,
    reviewCount: 500,
    image: "/gallery-assets/artworks/2.jpg",
    category: "clothing",
    tags: ["jacket", "cotton", "mens"],
    seller: "Fake Store Official",
    inStock: true,
    viewCount: 2100,
    cartCount: 234,
    featured: true,
  },
  {
    id: "4",
    title: "Mens Casual Slim Fit",
    description:
      "The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.",
    price: 15.99,
    originalPrice: 20.79,
    discount: 23,
    rating: 4.3,
    reviewCount: 430,
    image: "/gallery-assets/artworks/3.jpg",
    category: "clothing",
    tags: ["shirt", "casual", "mens"],
    seller: "Fake Store Official",
    inStock: true,
    viewCount: 1500,
    cartCount: 178,
  },
];

export function MarketplaceClient() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(mockProducts);
  const [categories, setCategories] = useState<
    Array<{
      id: string;
      name: string;
      slug: string;
      description: string;
      productCount: number;
      order: number;
    }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<SearchFilters>({
    category: "",
    minPrice: 0,
    maxPrice: 1000,
    rating: 0,
    inStock: true,
  });

  const { addToCart } = useCart();
  const { t } = useLanguage();

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, searchQuery, selectedCategory, sortBy, filters]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response: CategoriesResponse = await productService.getCategories();
      setCategories(response.categories);
    } catch (error) {
      console.error("Error loading categories:", error);
      // Fallback to mock categories
      setCategories([
        {
          id: "electronics",
          name: "Electronics",
          slug: "electronics",
          description: "Electronic devices",
          productCount: 0,
          order: 1,
        },
        {
          id: "clothing",
          name: "Clothing",
          slug: "clothing",
          description: "Fashion and apparel",
          productCount: 0,
          order: 2,
        },
        {
          id: "home",
          name: "Home",
          slug: "home",
          description: "Home and garden",
          productCount: 0,
          order: 3,
        },
        {
          id: "sports",
          name: "Sports",
          slug: "sports",
          description: "Sports and fitness",
          productCount: 0,
          order: 4,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default:
        // Popular (default)
        filtered.sort((a, b) => b.viewCount - a.viewCount);
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("marketplace.title")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("marketplace.subtitle")}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t("common.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("marketplace.categories")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("marketplace.categories")}
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={t("marketplace.popular")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">
                  {t("marketplace.popular")}
                </SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {t("marketplace.showing")
            .replace("{count}", filteredProducts.length.toString())
            .replace("{total}", products.length.toString())}
        </p>
      </div>

      {/* Products Grid */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }
      >
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className="group hover:shadow-lg transition-shadow"
          >
            <CardHeader className="p-0">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                {product.discount > 0 && (
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                    {product.discount}% {t("common.off")}
                  </Badge>
                )}
                {product.featured && (
                  <Badge className="absolute top-2 right-2 bg-blue-500 text-white">
                    {t("common.featured")}
                  </Badge>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div>
                  <h3 className="font-semibold text-sm line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {t("marketplace.by")} {product.seller}
                  </p>
                </div>

                <div className="flex items-center space-x-1">
                  {renderStars(product.rating)}
                  <span className="text-xs text-muted-foreground ml-1">
                    ({product.reviewCount} {t("marketplace.reviews")})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-lg">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span>
                      {product.viewCount} {t("marketplace.views")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ShoppingCart className="h-3 w-3" />
                    <span>
                      {product.cartCount} {t("marketplace.sold")}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleAddToCart(product)}
                  >
                    {t("marketplace.add_to_cart")}
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/marketplace/product/${product.id}`}>
                      {t("marketplace.view_details")}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No products found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
