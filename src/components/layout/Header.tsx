import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, Heart, MapPin, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
const categories = [
  "Electronics", "Fashion", "Home & Living", "Beauty", "Sports", "Groceries", "Toys", "Automotive"
];

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { cartItems, getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="gradient-primary text-primary-foreground">
        <div className="container flex h-10 items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Deliver to Dhaka</span>
            <ChevronDown className="h-3 w-3" />
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">🔥 Free Delivery on orders over ৳500</span>
            <span>Download App</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b bg-card shadow-sm">
        <div className="container flex h-16 items-center gap-4">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="flex flex-col gap-4 pt-8">
                <h2 className="text-lg font-bold">Categories</h2>
                {categories.map((cat) => (
                  <Button key={cat} variant="ghost" className="justify-start">
                    {cat}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
              <span className="text-xl font-bold text-primary-foreground">H</span>
            </div>
            <span className="hidden text-xl font-bold text-foreground sm:inline">
              Haat<span className="text-primary">Bazar</span>
            </span>
          </a>

          {/* Search bar */}
          <div className="flex flex-1 items-center gap-2 max-w-2xl mx-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products, brands and more..."
                className="pl-10 h-10 bg-muted border-0 focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="h-10 gradient-primary hover:opacity-90 transition-opacity">
              Search
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Heart className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center gradient-flash text-xs animate-cart-bounce"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>

            <Button variant="ghost" className="hidden md:flex gap-2">
              <User className="h-5 w-5" />
              <span>Login</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Categories bar - Desktop */}
      <nav className="hidden lg:block border-b bg-card/80 backdrop-blur-sm">
        <div className="container">
          <div className="flex items-center gap-6 h-10 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <a
                key={cat}
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
              >
                {cat}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};
