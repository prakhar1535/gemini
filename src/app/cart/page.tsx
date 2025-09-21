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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  ArrowLeft,
  Star,
  Truck,
  Shield,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CartItem, Product } from "@/lib/types/marketplace";
import { useCart } from "@/lib/cart";

// Mock cart data
const mockCartItems: CartItem[] = [
  {
    id: "cart-1",
    productId: "1",
    product: {
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
      specifications: {},
      tags: [],
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
    quantity: 1,
    selectedOptions: { color: "Black" },
  },
  {
    id: "cart-2",
    productId: "2",
    product: {
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
      specifications: {},
      tags: [],
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
    quantity: 2,
    selectedOptions: { size: "Medium" },
  },
];

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartItemsCount } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [shippingMethod, setShippingMethod] = useState("standard");

  const calculateShipping = () => {
    const subtotal = getCartTotal();
    if (subtotal >= 100) return 0; // Free shipping over $100
    
    switch (shippingMethod) {
      case "standard": return 9.99;
      case "express": return 19.99;
      case "overnight": return 29.99;
      default: return 9.99;
    }
  };

  const calculateTax = () => {
    return getCartTotal() * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    return getCartTotal() + calculateShipping() + calculateTax();
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

  if (cartItems.length === 0) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/marketplace">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>
          
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button asChild>
              <Link href="/marketplace">Start Shopping</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {getCartItemsCount()} item{getCartItemsCount() !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/marketplace">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.thumbnail}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="font-medium">{item.product.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          by {item.product.sellerName}
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          {renderStars(item.product.rating)}
                          <span className="text-xs text-muted-foreground">
                            ({item.product.reviewCount})
                          </span>
                        </div>
                      </div>

                      {/* Selected Options */}
                      {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                        <div className="flex space-x-2">
                          {Object.entries(item.selectedOptions).map(([key, value]) => (
                            <Badge key={key} variant="outline" className="text-xs">
                              {key}: {value}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Price and Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold">${item.product.price}</span>
                          {item.product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${item.product.originalPrice}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-3 py-1 text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <span className="font-medium">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Coupon Code */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Coupon Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                  />
                  <Button variant="outline">Apply</Button>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Shipping Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={shippingMethod === "standard"}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="text-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Standard Shipping</span>
                        <span className="text-sm">
                          {calculateSubtotal() >= 100 ? "FREE" : "$9.99"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">3-5 business days</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      checked={shippingMethod === "express"}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="text-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Express Shipping</span>
                        <span className="text-sm">$19.99</span>
                      </div>
                      <p className="text-xs text-muted-foreground">1-2 business days</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="shipping"
                      value="overnight"
                      checked={shippingMethod === "overnight"}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="text-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Overnight Shipping</span>
                        <span className="text-sm">$29.99</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Next business day</p>
                    </div>
                  </label>
                </div>

                {getCartTotal() < 100 && (
                  <p className="text-xs text-muted-foreground">
                    Add ${(100 - getCartTotal()).toFixed(2)} more for free shipping
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>
                    {calculateShipping() === 0 ? "FREE" : `$${calculateShipping().toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>

                <Button className="w-full" size="lg" asChild>
                  <Link href="/checkout">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Checkout
                  </Link>
                </Button>

                <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Shield className="h-3 w-3" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Truck className="h-3 w-3" />
                    <span>Fast Delivery</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
