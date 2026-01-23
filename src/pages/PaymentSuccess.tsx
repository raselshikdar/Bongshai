import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Package, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [isUpdating, setIsUpdating] = useState(true);

  useEffect(() => {
    const updateOrderStatus = async () => {
      if (orderId) {
        try {
          // Update order status to processing (payment confirmed)
          const { error } = await supabase
            .from("orders")
            .update({ status: "processing" })
            .eq("id", orderId);

          if (error) {
            console.error("Failed to update order status:", error);
          }
        } catch (err) {
          console.error("Error updating order:", err);
        }
      }
      setIsUpdating(false);
    };

    updateOrderStatus();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-12">
        <div className="max-w-lg mx-auto text-center">
          <Card className="border-green-200 dark:border-green-900">
            <CardContent className="pt-8 pb-8 space-y-6">
              {isUpdating ? (
                <>
                  <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
                  <p className="text-muted-foreground">Processing your payment...</p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                  </div>
                  
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">
                      Payment Successful!
                    </h1>
                    <p className="text-muted-foreground">
                      Thank you for your order. Your payment has been processed successfully.
                    </p>
                  </div>

                  {orderId && (
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="font-mono text-sm font-medium">{orderId.slice(0, 8)}...</p>
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <Button 
                      onClick={() => navigate("/profile")} 
                      className="gradient-primary w-full"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      View My Orders
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/")}
                      className="w-full"
                    >
                      Continue Shopping
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
