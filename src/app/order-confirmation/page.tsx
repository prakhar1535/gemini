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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Package,
  Truck,
  CreditCard,
  ArrowRight,
  Download,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function OrderConfirmationPage() {
  const orderDetails = {
    orderId: "ORD-2024-001234",
    orderDate: new Date(),
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    total: 499.97,
    items: [
      {
        id: "1",
        title: "Wireless Bluetooth Headphones",
        thumbnail: "/placeholder-headphones.jpg",
        price: 199.99,
        quantity: 1,
        sellerName: "TechGear Pro",
      },
      {
        id: "2",
        title: "Smart Fitness Tracker",
        thumbnail: "/placeholder-fitness.jpg",
        price: 149.99,
        quantity: 2,
        sellerName: "TechGear Pro",
      },
    ],
    shippingAddress: {
      firstName: "John",
      lastName: "Doe",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      phone: "+1 (555) 123-4567",
    },
    paymentMethod: "Credit Card ending in 4242",
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
    <MainLayout>
      <div className="space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Order #{orderDetails.orderId}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>
                  Items in your order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderDetails.items.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          by {item.sellerName}
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          {renderStars(4.8)}
                          <span className="text-xs text-muted-foreground">(1,247 reviews)</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm">Quantity: {item.quantity}</span>
                          <span className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {index < orderDetails.items.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="h-5 w-5" />
                  <span>Shipping Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Delivery Address</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{orderDetails.shippingAddress.firstName} {orderDetails.shippingAddress.lastName}</p>
                      <p>{orderDetails.shippingAddress.street}</p>
                      <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zipCode}</p>
                      <p>{orderDetails.shippingAddress.phone}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Delivery Timeline</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><strong>Order Date:</strong> {orderDetails.orderDate.toLocaleDateString()}</p>
                      <p><strong>Estimated Delivery:</strong> {orderDetails.estimatedDelivery.toLocaleDateString()}</p>
                      <p><strong>Shipping Method:</strong> Standard (3-5 business days)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{orderDetails.paymentMethod}</p>
                    <p className="text-sm text-muted-foreground">
                      Payment completed successfully
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Paid
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Actions */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>$499.97</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>$40.00</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${orderDetails.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/orders">
                    View All Orders
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/marketplace">
                    Continue Shopping
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Track Your Order */}
            <Card>
              <CardHeader>
                <CardTitle>Track Your Order</CardTitle>
                <CardDescription>
                  Monitor your order status and delivery
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Order Confirmed</p>
                      <p className="text-xs text-muted-foreground">Just now</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Processing</p>
                      <p className="text-xs text-muted-foreground">Within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Truck className="h-4 w-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Shipped</p>
                      <p className="text-xs text-muted-foreground">Within 2-3 days</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Delivered</p>
                      <p className="text-xs text-muted-foreground">Estimated {orderDetails.estimatedDelivery.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full" asChild>
                  <Link href={`/orders/${orderDetails.orderId}`}>
                    Track Order Details
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>
                  We're here to help with your order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/contact">
                    Contact Support
                  </Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/faq">
                    View FAQ
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
