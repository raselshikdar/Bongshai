import { 
  Smartphone, 
  Shirt, 
  Home, 
  Sparkles, 
  Dumbbell, 
  ShoppingBag, 
  Baby, 
  Car 
} from "lucide-react";
import { CategoryCircle } from "./CategoryCircle";

const categories = [
  { name: "Electronics", nameBn: "ইলেকট্রনিক্স", icon: Smartphone, color: "bg-secondary" },
  { name: "Fashion", nameBn: "ফ্যাশন", icon: Shirt, color: "gradient-primary" },
  { name: "Home & Living", nameBn: "হোম ও লিভিং", icon: Home, color: "bg-success" },
  { name: "Beauty", nameBn: "বিউটি", icon: Sparkles, color: "gradient-flash" },
  { name: "Sports", nameBn: "স্পোর্টস", icon: Dumbbell, color: "bg-secondary" },
  { name: "Groceries", nameBn: "মুদি সামগ্রী", icon: ShoppingBag, color: "bg-success" },
  { name: "Baby & Toys", nameBn: "বেবি ও টয়", icon: Baby, color: "gradient-primary" },
  { name: "Automotive", nameBn: "অটোমোটিভ", icon: Car, color: "gradient-trust" },
];

export const FeaturedCategories = () => {
  return (
    <section className="py-6">
      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
        Shop by Category
      </h2>
      <p className="text-sm text-muted-foreground font-bengali mb-6">
        ক্যাটাগরি অনুযায়ী কেনাকাটা করুন
      </p>

      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-8 md:overflow-visible">
        {categories.map((category) => (
          <CategoryCircle key={category.name} {...category} />
        ))}
      </div>
    </section>
  );
};
