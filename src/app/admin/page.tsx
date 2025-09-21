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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  Eye,
  Star,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Product, AnalyticsData, Order } from "@/lib/types/marketplace";
import { productService } from "@/lib/services/products";

// Mock analytics data
const mockAnalytics: AnalyticsData = {
  totalProducts: 1247,
  totalSales: 8934,
  totalRevenue: 245678.90,
  totalOrders: 5678,
  averageOrderValue: 43.25,
  conversionRate: 3.2,
  topProducts: [
    {
      product: {
        id: "1",
        title: "Wireless Bluetooth Headphones",
        description: "Premium noise-canceling headphones",
        price: 199.99,
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
      sales: 342,
      revenue: 68395.58,
    },
    {
      product: {
        id: "2",
        title: "Smart Fitness Tracker",
        description: "Track your fitness goals",
        price: 149.99,
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
      sales: 234,
      revenue: 35097.66,
    },
  ],
  salesByCategory: [
    { category: "Electronics", sales: 3456, revenue: 156789.45 },
    { category: "Fashion", sales: 2345, revenue: 45678.90 },
    { category: "Home & Garden", sales: 1234, revenue: 23456.78 },
    { category: "Health & Beauty", sales: 567, revenue: 12345.67 },
    { category: "Sports & Outdoors", sales: 332, revenue: 8407.10 },
  ],
  monthlySales: [
    { month: "Jan", sales: 234, revenue: 12345.67 },
    { month: "Feb", sales: 345, revenue: 15678.90 },
    { month: "Mar", sales: 456, revenue: 23456.78 },
    { month: "Apr", sales: 567, revenue: 34567.89 },
    { month: "May", sales: 678, revenue: 45678.90 },
    { month: "Jun", sales: 789, revenue: 56789.01 },
  ],
  recentOrders: [
    {
      id: "ORD-001",
      userId: "user1",
      items: [],
      total: 199.99,
      subtotal: 199.99,
      tax: 16.00,
      shipping: 0,
      discount: 0,
      status: "delivered",
      shippingAddress: {
        firstName: "John",
        lastName: "Doe",
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
      billingAddress: {
        firstName: "John",
        lastName: "Doe",
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
      paymentMethod: "Credit Card",
      paymentStatus: "paid",
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-01-22"),
    },
  ],
};

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
];

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData>(mockAnalytics);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      inactive: { color: "bg-gray-100 text-gray-800", label: "Inactive" },
      featured: { color: "bg-blue-100 text-blue-800", label: "Featured" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getOrderStatusBadge = (status: string) => {
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

  // Load products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await productService.getProducts();
        if (response.success) {
          setProducts(response.products);
          // Update analytics with real data
          setAnalytics(prev => ({
            ...prev,
            totalProducts: response.products.length,
            totalSales: response.products.reduce((sum, p) => sum + p.sales, 0),
            totalRevenue: response.products.reduce((sum, p) => sum + (p.price * p.sales), 0),
          }));
        } else {
          setError(response.error || 'Failed to load products');
        }
      } catch (err) {
        setError('Failed to load products');
        console.error('Error loading products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your marketplace and track performance
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12.5%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(analytics.totalOrders)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8.2%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(analytics.totalProducts)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+3</span> this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+0.5%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>
                  Your best-selling products by revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topProducts.map((item, index) => (
                    <div key={item.product.id} className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={item.product.thumbnail}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.sales} sales • {formatCurrency(item.revenue)} revenue
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(item.revenue)}</div>
                        <div className="text-sm text-muted-foreground">{item.sales} sales</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sales by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>
                  Revenue breakdown by product category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.salesByCategory.map((category) => (
                    <div key={category.category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span className="font-medium">{category.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(category.revenue)}</div>
                        <div className="text-sm text-muted-foreground">{category.sales} sales</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            {/* Product Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Product Management</CardTitle>
                    <CardDescription>
                      Manage your product inventory and listings
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="fashion">Fashion</SelectItem>
                          <SelectItem value="home">Home & Garden</SelectItem>
                          <SelectItem value="health">Health & Beauty</SelectItem>
                        </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="featured">Featured</SelectItem>
                        </SelectContent>
                  </Select>
                </div>

                {/* Products Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={product.thumbnail}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium">{product.title}</div>
                              <div className="text-sm text-muted-foreground">
                                by {product.sellerName}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(product.price)}</TableCell>
                        <TableCell>
                          <span className={product.stock < 10 ? "text-red-600 font-medium" : ""}>
                            {product.stock}
                          </span>
                        </TableCell>
                        <TableCell>{product.sales}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {product.isActive && getStatusBadge("active")}
                            {product.isFeatured && getStatusBadge("featured")}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Latest orders from your marketplace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics.recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono">{order.id}</TableCell>
                        <TableCell>
                          {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(order.total)}</TableCell>
                        <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          <Badge className={order.paymentStatus === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                            {order.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.createdAt.toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Monthly Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales Trend</CardTitle>
                <CardDescription>
                  Revenue and sales volume over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.monthlySales.map((month) => (
                    <div key={month.month} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 text-center font-medium">{month.month}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(month.revenue / Math.max(...analytics.monthlySales.map(m => m.revenue))) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(month.revenue)}</div>
                        <div className="text-sm text-muted-foreground">{month.sales} sales</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Marketplace Settings</CardTitle>
                <CardDescription>
                  Configure your marketplace preferences and policies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">General Settings</h3>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Marketplace Name</label>
                      <Input defaultValue="SocialFlow Marketplace" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Default Currency</label>
                      <Select defaultValue="usd">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD</SelectItem>
                          <SelectItem value="eur">EUR</SelectItem>
                          <SelectItem value="gbp">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Commission Settings</h3>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Default Commission Rate (%)</label>
                      <Input type="number" defaultValue="5" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Transaction Fee</label>
                      <Input type="number" defaultValue="2.9" />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
