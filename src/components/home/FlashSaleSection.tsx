import { useState, useEffect } from "react";
import { Zap, Clock } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";

const flashSaleProducts = [
  {
    id: "fs1",
    name: "Wireless Bluetooth Earbuds Pro",
    nameBn: "ওয়্যারলেস ব্লুটুথ ইয়ারবাড",
    price: 1299,
    originalPrice: 3499,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 2341,
  },
  {
    id: "fs2",
    name: "Smart Watch Fitness Tracker",
    nameBn: "স্মার্ট ওয়াচ ফিটনেস ট্র্যাকার",
    price: 899,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop",
    rating: 4.4,
    reviews: 1876,
  },
  {
    id: "fs3",
    name: "Portable Power Bank 20000mAh",
    nameBn: "পোর্টেবল পাওয়ার ব্যাংক",
    price: 799,
    originalPrice: 1999,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 3456,
  },
  {
    id: "fs4",
    name: "USB-C Fast Charging Cable",
    nameBn: "ফাস্ট চার্জিং ক্যাবল",
    price: 149,
    originalPrice: 499,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=400&fit=crop",
    rating: 4.3,
    reviews: 892,
  },
  {
    id: "fs5",
    name: "LED Ring Light with Tripod",
    nameBn: "এলইডি রিং লাইট",
    price: 599,
    originalPrice: 1499,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 1234,
  },
  {
    id: "fs6",
    name: "Mechanical Gaming Keyboard",
    nameBn: "গেমিং কীবোর্ড",
    price: 1499,
    originalPrice: 3999,
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 567,
  },
];

export const FlashSaleSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 23,
    seconds: 45,
  });

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
        {flashSaleProducts.map((product) => (
          <ProductCard key={product.id} {...product} isFlashSale />
        ))}
      </div>
    </section>
  );
};
