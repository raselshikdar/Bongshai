import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CreditCard, Truck, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { districts, getThanas } from "@/data/bangladeshLocations";
import { toast } from "sonner";

type PaymentMethod = "cod" | "bkash" | "nagad";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user, profile } = useAuth();
  
  const [step, setStep] = useState(1);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  // Address form
  const [district, setDistrict] = useState("");
  const [thana, setThana] = useState("");
  const [area, setArea] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  
  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

  useEffect(() => {
    if (profile) {
      setDistrict(profile.shipping_address?.district || "");
      setThana(profile.shipping_address?.thana || "");
      setArea(profile.shipping_address?.area || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const subtotal = getTotalPrice();
  const shippingFee = subtotal > 500 ? 0 : 60;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = async () => {
    if (!user) return;
    
    if (!district || !thana || !area || !phone) {
      toast.error("Please fill in all address fields");
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_price: total,
          status: "pending",
          payment_method: paymentMethod,
          shipping_address: { district, thana, area },
          shipping_fee: shippingFee,
          notes,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Stock management can be handled separately if needed

      // Clear cart
      clearCart();

      toast.success("Order placed successfully!");
      navigate("/profile");
    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const availableThanas = getThanas(district);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "gradient-primary text-white" : "bg-muted"}`}>
                {step > 1 ? <CheckCircle className="h-5 w-5" /> : <MapPin className="h-4 w-4" />}
              </div>
              <span className="hidden sm:inline font-medium">Shipping</span>
            </div>
            <div className={`w-12 h-0.5 ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "gradient-primary text-white" : "bg-muted"}`}>
                <CreditCard className="h-4 w-4" />
              </div>
              <span className="hidden sm:inline font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                  <CardDescription>Where should we deliver your order?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>District *</Label>
                      <Select value={district} onValueChange={(v) => { setDistrict(v); setThana(""); }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((d) => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Thana *</Label>
                      <Select value={thana} onValueChange={setThana} disabled={!district}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select thana" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableThanas.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="area">Detailed Address *</Label>
                    <Input
                      id="area"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="House, Road, Area"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Order Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special instructions for delivery?"
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={() => setStep(2)}
                    className="w-full gradient-primary"
                    disabled={!district || !thana || !area || !phone}
                  >
                    Continue to Payment
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>Choose how you want to pay</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                    <div className={`flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}>
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Truck className="h-6 w-6 text-primary" />
                          <div>
                            <p className="font-medium">Cash on Delivery</p>
                            <p className="text-sm text-muted-foreground">Pay when you receive</p>
                          </div>
                        </div>
                        {paymentMethod === "cod" && (
                          <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Recommended
                          </span>
                        )}
                      </Label>
                    </div>
                    
                    <div className={`flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === "bkash" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}>
                      <RadioGroupItem value="bkash" id="bkash" />
                      <Label htmlFor="bkash" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-pink-500 rounded text-white text-xs flex items-center justify-center font-bold">b</div>
                          <div>
                            <p className="font-medium">bKash</p>
                            <p className="text-sm text-muted-foreground">Mobile payment</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className={`flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === "nagad" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}>
                      <RadioGroupItem value="nagad" id="nagad" />
                      <Label htmlFor="nagad" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">N</div>
                          <div>
                            <p className="font-medium">Nagad</p>
                            <p className="text-sm text-muted-foreground">Mobile payment</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 gradient-primary"
                      disabled={isPlacingOrder}
                    >
                      {isPlacingOrder ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Placing Order...
                        </span>
                      ) : (
                        <>
                          Place Order
                          <CheckCircle className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium">৳{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shippingFee === 0 ? <span className="text-green-600">FREE</span> : `৳${shippingFee}`}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">৳{total.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
