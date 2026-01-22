import { Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";

const dailyDeals = [
  {
    id: "dd1",
    name: "Men's Casual Cotton Shirt - Premium Quality",
    nameBn: "পুরুষদের ক্যাজুয়াল শার্ট",
    price: 599,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 234,
  },
  {
    id: "dd2",
    name: "Women's Summer Dress Collection",
    nameBn: "মহিলাদের সামার ড্রেস",
    price: 799,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 567,
    badge: "Bestseller",
  },
  {
    id: "dd3",
    name: "Stainless Steel Kitchen Cookware Set",
    nameBn: "স্টেইনলেস স্টিল রান্নার সেট",
    price: 2499,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1584990347449-a6a2671e5d70?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 890,
  },
  {
    id: "dd4",
    name: "Kids Educational Building Blocks",
    nameBn: "বাচ্চাদের শিক্ষামূলক খেলনা",
    price: 349,
    originalPrice: 799,
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 1234,
    badge: "Top Rated",
  },
  {
    id: "dd5",
    name: "Premium Face Care Combo Pack",
    nameBn: "ফেস কেয়ার কম্বো প্যাক",
    price: 699,
    originalPrice: 1499,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    rating: 4.4,
    reviews: 456,
  },
  {
    id: "dd6",
    name: "Sports Running Shoes - Breathable",
    nameBn: "স্পোর্টস রানিং শু",
    price: 1299,
    originalPrice: 2999,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 789,
  },
  {
    id: "dd7",
    name: "Organic Honey 500g - Pure Natural",
    nameBn: "অর্গানিক মধু",
    price: 399,
    originalPrice: 699,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 2345,
    badge: "Organic",
  },
  {
    id: "dd8",
    name: "Laptop Backpack Anti-Theft Design",
    nameBn: "ল্যাপটপ ব্যাকপ্যাক",
    price: 899,
    originalPrice: 1999,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 678,
  },
];

export const DailyDeals = () => {
  return (
    <section className="py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-secondary">
            <Tag className="h-5 w-5 text-secondary-foreground" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Daily Deals</h2>
            <p className="text-sm text-muted-foreground font-bengali">প্রতিদিনের বিশেষ অফার</p>
          </div>
        </div>

        <Button variant="ghost" className="text-primary hover:text-primary/80 gap-1">
          View All
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4">
        {dailyDeals.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
};
