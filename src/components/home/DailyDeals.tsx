import { useState, useEffect } from "react";
import { Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  images_url: string[];
  rating: number;
  review_count: number;
  is_featured: boolean;
}

export const DailyDeals = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name, price, original_price, images_url, rating, review_count, is_featured")
        .order("created_at", { ascending: false })
        .limit(8);

      if (data) setProducts(data);
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <section className="py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-48 bg-muted rounded" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

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
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            originalPrice={product.original_price || undefined}
            image={product.images_url[0] || "/placeholder.svg"}
            rating={product.rating}
            reviews={product.review_count}
            badge={product.is_featured ? "Featured" : undefined}
          />
        ))}
      </div>
    </section>
  );
};
