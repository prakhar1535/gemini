import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch categories from Fake Store API
    const response = await fetch('https://fakestoreapi.com/products/categories', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories from Fake Store API');
    }
    
    const categories = await response.json();
    
    // Transform categories to include counts and better formatting
    const transformedCategories = categories.map((category: string, index: number) => ({
      id: category.toLowerCase().replace(/\s+/g, '-').replace("'", ''),
      name: capitalizeFirst(category),
      slug: category.toLowerCase().replace(/\s+/g, '-').replace("'", ''),
      description: getCategoryDescription(category),
      productCount: Math.floor(Math.random() * 50) + 10, // Mock count
      order: index + 1,
    }));
    
    return NextResponse.json({
      success: true,
      categories: transformedCategories,
    });
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch categories',
        categories: []
      },
      { status: 500 }
    );
  }
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    "electronics": "Latest electronics and gadgets for your home and office",
    "jewelry": "Beautiful jewelry pieces for every occasion",
    "men's clothing": "Stylish and comfortable clothing for men",
    "women's clothing": "Trendy and elegant fashion for women",
  };
  
  return descriptions[category] || `Discover amazing ${category} products`;
}
