export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  images: string[];
  thumbnail: string;
  stock: number;
  sku: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  specifications: Record<string, string>;
  tags: string[];
  rating: number;
  reviewCount: number;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  sales: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
  productCount: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  createdAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedOptions?: Record<string, string>;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'customer' | 'seller' | 'admin';
  isVerified: boolean;
  createdAt: Date;
}

export interface Seller {
  id: string;
  userId: string;
  businessName: string;
  description: string;
  logo?: string;
  banner?: string;
  rating: number;
  reviewCount: number;
  totalSales: number;
  isVerified: boolean;
  categories: string[];
  location: string;
  joinedAt: Date;
}

export interface SearchFilters {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  seller?: string;
  tags?: string[];
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular' | 'sales';
}

export interface AnalyticsData {
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  topProducts: Array<{
    product: Product;
    sales: number;
    revenue: number;
  }>;
  salesByCategory: Array<{
    category: string;
    sales: number;
    revenue: number;
  }>;
  monthlySales: Array<{
    month: string;
    sales: number;
    revenue: number;
  }>;
  recentOrders: Order[];
}
