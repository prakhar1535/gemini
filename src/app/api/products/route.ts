import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/lib/types/marketplace";

// Fetch products from Fake Store API
async function fetchFakeStoreProducts(): Promise<any[]> {
  try {
    const response = await fetch('https://fakestoreapi.com/products', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch products from Fake Store API');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Fake Store products:', error);
    return [];
  }
}

// Fetch categories from Fake Store API
async function fetchFakeStoreCategories(): Promise<string[]> {
  try {
    const response = await fetch('https://fakestoreapi.com/products/categories', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories from Fake Store API');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Transform Fake Store API data to our Product interface
function transformFakeStoreProduct(apiProduct: any): Product {
  return {
    id: `fake-${apiProduct.id}`,
    title: apiProduct.title,
    description: apiProduct.description,
    price: apiProduct.price,
    originalPrice: Math.round(apiProduct.price * 1.3 * 100) / 100, // Add 30% markup as original price
    category: capitalizeFirst(apiProduct.category),
    subcategory: getSubcategory(apiProduct.category),
    images: [apiProduct.image],
    thumbnail: apiProduct.image,
    stock: Math.floor(Math.random() * 100) + 10, // Random stock between 10-110
    sku: `FS-${apiProduct.id.toString().padStart(3, '0')}`,
    weight: Math.round((Math.random() * 2 + 0.1) * 100) / 100, // Random weight between 0.1-2.1 kg
    dimensions: {
      length: Math.round((Math.random() * 20 + 5) * 100) / 100,
      width: Math.round((Math.random() * 15 + 3) * 100) / 100,
      height: Math.round((Math.random() * 10 + 2) * 100) / 100,
    },
    specifications: {
      "Brand": "Fake Store",
      "Material": "Premium Quality",
      "Origin": "International",
      "Warranty": "1 Year",
    },
    tags: generateTags(apiProduct.category, apiProduct.title),
    rating: apiProduct.rating?.rate || 4.0,
    reviewCount: apiProduct.rating?.count || Math.floor(Math.random() * 500) + 10,
    sellerId: "fakestore-seller",
    sellerName: "Fake Store Official",
    sellerRating: 4.8,
    isActive: true,
    isFeatured: Math.random() > 0.7, // 30% chance of being featured
    createdAt: new Date(),
    updatedAt: new Date(),
    views: Math.floor(Math.random() * 5000) + 100,
    sales: Math.floor(Math.random() * 200) + 10,
  };
}

// Helper functions
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getSubcategory(category: string): string {
  const subcategories: Record<string, string[]> = {
    "electronics": ["Audio", "Computers", "Phones", "Cameras"],
    "jewelry": ["Necklaces", "Rings", "Earrings", "Bracelets"],
    "men's clothing": ["Shirts", "Pants", "Jackets", "Accessories"],
    "women's clothing": ["Dresses", "Tops", "Skirts", "Outerwear"],
  };
  
  const subs = subcategories[category] || ["General"];
  return subs[Math.floor(Math.random() * subs.length)];
}

function generateTags(category: string, title: string): string[] {
  const categoryTags: Record<string, string[]> = {
    "electronics": ["electronics", "tech", "digital", "modern"],
    "jewelry": ["jewelry", "accessories", "luxury", "fashion"],
    "men's clothing": ["men", "clothing", "fashion", "style"],
    "women's clothing": ["women", "clothing", "fashion", "style"],
  };
  
  const baseTags = categoryTags[category] || [category];
  const titleWords = title.toLowerCase().split(' ').slice(0, 3);
  
  return [...baseTags, ...titleWords].slice(0, 5);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    const search = searchParams.get('search');
    const id = searchParams.get('id');

    // If requesting a specific product by ID
    if (id) {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${id.replace('fake-', '')}`, {
          next: { revalidate: 3600 }
        });
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const apiProduct = await response.json();
        const transformedProduct = transformFakeStoreProduct(apiProduct);
        
        return NextResponse.json({
          success: true,
          products: [transformedProduct],
          total: 1,
        });
      } catch (error) {
        return NextResponse.json(
          { success: false, error: 'Product not found', products: [], total: 0 },
          { status: 404 }
        );
      }
    }

    // Fetch products from Fake Store API
    const fakeStoreProducts = await fetchFakeStoreProducts();
    
    // Transform to our Product interface
    const transformedProducts = fakeStoreProducts.map(transformFakeStoreProduct);
    
    // Filter by category if specified
    let filteredProducts = transformedProducts;
    if (category && category !== 'all') {
      filteredProducts = transformedProducts.filter(
        product => product.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Search filter if specified
    if (search) {
      filteredProducts = filteredProducts.filter(product =>
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    // Apply limit if specified
    if (limit) {
      const limitNum = parseInt(limit);
      filteredProducts = filteredProducts.slice(0, limitNum);
    }
    
    return NextResponse.json({
      success: true,
      products: filteredProducts,
      total: filteredProducts.length,
      categories: await fetchFakeStoreCategories(),
    });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products',
        products: [],
        total: 0,
        categories: []
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In a real application, you would save this to your database
    // For now, we'll just return a success response
    console.log('New product to be saved:', body);
    
    return NextResponse.json({
      success: true,
      message: 'Product saved successfully',
      productId: `custom-${Date.now()}`,
    });
    
  } catch (error) {
    console.error('Error saving product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save product' },
      { status: 500 }
    );
  }
}
