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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  Eye,
  Truck,
  Calendar,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { Order } from "@/lib/types/marketplace";

// Mock orders data
const mockOrders: Order[] = [
  {
    id: "ORD-2024-001234",
    userId: "user1",
    items: [],
    total: 499.97,
    subtotal: 499.97,
    tax: 40.00,
    shipping: 0,
    discount: 0,
    status: "delivered",
    shippingAddress: {
      firstName: "John",
      lastName: "Doe",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      phone: "+1 (555) 123-4567",
    },
    billingAddress: {
      firstName: "John",
      lastName: "Doe",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      phone: "+1 (555) 123-4567",
    },
    paymentMethod: "Credit Card ending in 4242",
    paymentStatus: "paid",
    trackingNumber: "TRK123456789",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-22"),
  },
  {
    id: "ORD-2024-001235",
    userId: "user1",
    items: [],
    total: 149.99,
    subtotal: 139.99,
    tax: 11.20,
    shipping: 9.99,
    discount: 0,
    status: "shipped",
    shippingAddress: {
      firstName: "John",
      lastName: "Doe",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      phone: "+1 (555) 123-4567",
    },
    billingAddress: {
      firstName: "John",
      lastName: "Doe",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      phone: "+1 (555) 123-4567",
    },
    paymentMethod: "Credit Card ending in 4242",
    paymentStatus: "paid",
    trackingNumber: "TRK987654321",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-26"),
  },
  {
    id: "ORD-2024-001236",
    userId: "user1",
    items: [],
    total: 79.99,
    subtotal: 74.99,
    tax: 6.00,
    shipping: 0,
    discount: 0,
    status: "pending",
    shippingAddress: {
      firstName: "John",
      lastName: "Doe",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      phone: "+1 (555) 123-4567",
    },
    billingAddress: {
      firstName: "John",
      lastName: "Doe",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      phone: "+1 (555) 123-4567",
    },
    paymentMethod: "Credit Card ending in 4242",
    paymentStatus: "paid",
    createdAt: new Date("2024-01-28"),
    updatedAt: new Date("2024-01-28"),
  },
];

export default function OrdersPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      confirmed: { color: "bg-blue-100 text-blue-800", label: "Confirmed" },
      shipped: { color: "bg-purple-100 text-purple-800", label: "Shipped" },
      delivered: { color: "bg-green-100 text-green-800", label: "Delivered" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      paid: { color: "bg-green-100 text-green-800", label: "Paid" },
      failed: { color: "bg-red-100 text-red-800", label: "Failed" },
      refunded: { color: "bg-gray-100 text-gray-800", label: "Refunded" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-muted-foreground">
              Track and manage your order history
            </p>
          </div>
          <Button asChild>
            <Link href="/marketplace">
              Continue Shopping
            </Link>
          </Button>
        </div>

        {/* Orders Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{mockOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Truck className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                  <p className="text-2xl font-bold">
                    {mockOrders.filter(order => order.status === "delivered").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Transit</p>
                  <p className="text-2xl font-bold">
                    {mockOrders.filter(order => order.status === "shipped").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(mockOrders.reduce((sum, order) => sum + order.total, 0))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>
              All your orders from the marketplace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Tracking</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono">{order.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{order.createdAt.toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell>
                      {order.trackingNumber ? (
                        <span className="font-mono text-sm">
                          {order.trackingNumber}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/orders/${order.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Orders Cards View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-mono">{order.id}</CardTitle>
                  {getStatusBadge(order.status)}
                </div>
                <CardDescription>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{order.createdAt.toLocaleDateString()}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="font-medium">{formatCurrency(order.total)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Payment</span>
                  {getPaymentStatusBadge(order.paymentStatus)}
                </div>

                {order.trackingNumber && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tracking</span>
                    <span className="font-mono text-xs">
                      {order.trackingNumber}
                    </span>
                  </div>
                )}

                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/orders/${order.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
