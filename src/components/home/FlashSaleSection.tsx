import { useState, useEffect } from "react";
import { Zap, Clock } from "lucide-react";
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
}

export const FlashSaleSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 23,
    seconds: 45,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name, price, original_price, images_url, rating, review_count")
        .eq("is_flash_sale", true)
        .limit(6);

      if (data) setProducts(data);
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, "0");

  if (isLoading) {
    return (
      <section className="py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-48 bg-muted rounded" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[...Array(6)].map((_, i) => (
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg gradient-flash animate-pulse-scale">
            <Zap className="h-5 w-5 text-flash-foreground" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Flash Sale</h2>
            <p className="text-sm text-muted-foreground font-bengali">সীমিত সময়ের অফার</p>
          </div>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-2 bg-flash/10 px-4 py-2 rounded-lg">
          <Clock className="h-4 w-4 text-flash" />
          <span className="text-sm text-muted-foreground">Ends in:</span>
          <div className="flex items-center gap-1">
            <span className="bg-flash text-flash-foreground px-2 py-1 rounded text-sm font-bold min-w-[28px] text-center">
              {formatTime(timeLeft.hours)}
            </span>
            <span className="text-flash font-bold">:</span>
            <span className="bg-flash text-flash-foreground px-2 py-1 rounded text-sm font-bold min-w-[28px] text-center">
              {formatTime(timeLeft.minutes)}
            </span>
            <span className="text-flash font-bold">:</span>
            <span className="bg-flash text-flash-foreground px-2 py-1 rounded text-sm font-bold min-w-[28px] text-center">
              {formatTime(timeLeft.seconds)}
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
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
            isFlashSale
          />
        ))}
      </div>
    </section>
  );
};
