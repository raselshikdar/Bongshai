import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background mt-12">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
                <span className="text-xl font-bold text-primary-foreground">H</span>
              </div>
              <span className="text-xl font-bold">
                Haat<span className="text-primary">Bazar</span>
              </span>
            </div>
            <p className="text-sm text-muted mb-4">
              Bangladesh's most trusted online shopping destination. Quality products at unbeatable prices.
            </p>
            <p className="text-sm text-muted font-bengali">
              বাংলাদেশের সবচেয়ে বিশ্বস্ত অনলাইন শপিং গন্তব্য
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="#" className="hover:text-primary transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Payment Methods</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Sell on HaatBazar</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Gulshan, Dhaka 1212, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@haatbazar.com</span>
              </li>
            </ul>

            <div className="flex gap-4 mt-4">
              <a href="#" className="text-muted hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-muted/20 mt-8 pt-8 text-center text-sm text-muted">
          <p>© 2024 HaatBazar. All rights reserved. Made with ❤️ in Bangladesh</p>
        </div>
      </div>
    </footer>
  );
};
