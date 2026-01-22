import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { HeroBanner } from "@/components/home/HeroBanner";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { FlashSaleSection } from "@/components/home/FlashSaleSection";
import { DailyDeals } from "@/components/home/DailyDeals";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-4 md:py-6">
        <HeroBanner />
        <FeaturedCategories />
        <FlashSaleSection />
        <DailyDeals />
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
