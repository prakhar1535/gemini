import { Product } from "@/lib/types/marketplace";

export interface ProductsResponse {
  success: boolean;
  products: Product[];
  total: number;
  categories: string[];
  error?: string;
}

export interface CategoriesResponse {
  success: boolean;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    productCount: number;
    order: number;
  }>;
  error?: string;
}

export class ProductService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  }

  async getProducts(params?: {
    category?: string;
    limit?: number;
    search?: string;
  }): Promise<ProductsResponse> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params?.category) {
        searchParams.append('category', params.category);
      }
      if (params?.limit) {
        searchParams.append('limit', params.limit.toString());
      }
      if (params?.search) {
        searchParams.append('search', params.search);
      }

      const url = `/api/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return {
        success: false,
        products: [],
        total: 0,
        categories: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getCategories(): Promise<CategoriesResponse> {
    try {
      const response = await fetch('/api/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        categories: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success && data.products.length > 0 ? data.products[0] : null;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
  }

  async createProduct(productData: Partial<Product>): Promise<{ success: boolean; productId?: string; error?: string }> {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export const productService = new ProductService();
