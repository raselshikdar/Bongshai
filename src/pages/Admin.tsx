import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Plus,
  Edit, Trash2, Upload, X, Save, Eye, Search, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  stock: number;
  category: string;
  images_url: string[];
  is_featured: boolean;
  is_flash_sale: boolean;
  created_at: string;
}

interface Order {
  id: string;
  user_id: string;
  total_price: number;
  status: string;
  payment_method: string;
  shipping_address: {
    district: string;
    thana: string;
    area: string;
  };
  created_at: string;
  profiles?: {
    name: string;
    phone: string;
  };
}

interface Analytics {
  totalSales: number;
  totalOrders: number;
  totalUsers: number;
  pendingOrders: number;
}

const categories = [
  "Electronics", "Fashion", "Home & Living", "Beauty", "Sports", "Groceries", "Toys", "Automotive"
];

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({ totalSales: 0, totalOrders: 0, totalUsers: 0, pendingOrders: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  // Product form
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    stock: "",
    category: "",
    images_url: [] as string[],
    is_featured: false,
    is_flash_sale: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/");
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    setIsLoading(true);
    
    // Fetch products
    const { data: productsData } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (productsData) setProducts(productsData);

    // Fetch orders with user profiles
    const { data: ordersData } = await supabase
      .from("orders")
      .select(`
        *,
        profiles(name, phone)
      `)
      .order("created_at", { ascending: false });

    if (ordersData) {
      setOrders(ordersData.map((order: any) => ({
        ...order,
        shipping_address: order.shipping_address as Order["shipping_address"],
      })));
    }

    // Fetch analytics
    const { data: salesData } = await supabase
      .from("orders")
      .select("total_price, status");

    const { count: usersCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    if (salesData) {
      const totalSales = salesData
        .filter((o: any) => o.status === "delivered")
        .reduce((sum: number, o: any) => sum + Number(o.total_price), 0);
      const pendingOrders = salesData.filter((o: any) => o.status === "pending").length;

      setAnalytics({
        totalSales,
        totalOrders: salesData.length,
        totalUsers: usersCount || 0,
        pendingOrders,
      });
    }

    setIsLoading(false);
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      original_price: "",
      stock: "",
      category: "",
      images_url: [],
      is_featured: false,
      is_flash_sale: false,
    });
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      original_price: product.original_price?.toString() || "",
      stock: product.stock.toString(),
      category: product.category,
      images_url: product.images_url,
      is_featured: product.is_featured,
      is_flash_sale: product.is_flash_sale,
    });
    setIsProductDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSaving(true);

    const productData = {
      name: productForm.name,
      description: productForm.description || null,
      price: parseFloat(productForm.price),
      original_price: productForm.original_price ? parseFloat(productForm.original_price) : null,
      stock: parseInt(productForm.stock) || 0,
      category: productForm.category,
      images_url: productForm.images_url,
      is_featured: productForm.is_featured,
      is_flash_sale: productForm.is_flash_sale,
    };

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id);

      if (error) {
        toast.error("Failed to update product");
      } else {
        toast.success("Product updated!");
        fetchData();
      }
    } else {
      const { error } = await supabase
        .from("products")
        .insert(productData);

      if (error) {
        toast.error("Failed to add product");
      } else {
        toast.success("Product added!");
        fetchData();
      }
    }

    setIsSaving(false);
    setIsProductDialogOpen(false);
    resetProductForm();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete product");
    } else {
      toast.success("Product deleted");
      fetchData();
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: "pending" | "processing" | "shipped" | "delivered" | "cancelled") => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      toast.error("Failed to update order status");
    } else {
      toast.success("Order status updated");
      fetchData();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const file = files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (error) {
      toast.error("Failed to upload image");
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    setProductForm((prev) => ({
      ...prev,
      images_url: [...prev.images_url, publicUrl],
    }));
    toast.success("Image uploaded!");
  };

  const removeImage = (index: number) => {
    setProductForm((prev) => ({
      ...prev,
      images_url: prev.images_url.filter((_, i) => i !== index),
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter((o) =>
    orderStatusFilter === "all" || o.status === orderStatusFilter
  );

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r hidden lg:block">
        <div className="flex h-16 items-center gap-2 px-6 border-b">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
            <span className="text-xl font-bold text-primary-foreground">H</span>
          </div>
          <span className="text-xl font-bold">
            Haat<span className="text-primary">Bazar</span>
          </span>
        </div>
        <nav className="p-4 space-y-2">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium">
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link to="/" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted text-muted-foreground">
            <Eye className="h-5 w-5" />
            View Store
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64">
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" asChild>
            <Link to="/">View Store</Link>
          </Button>
        </header>

        <div className="p-6">
          {/* Analytics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Sales</CardDescription>
                <CardTitle className="text-3xl text-green-600">
                  ৳{analytics.totalSales.toLocaleString()}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Orders</CardDescription>
                <CardTitle className="text-3xl">{analytics.totalOrders}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Pending Orders</CardDescription>
                <CardTitle className="text-3xl text-yellow-600">{analytics.pendingOrders}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Users</CardDescription>
                <CardTitle className="text-3xl">{analytics.totalUsers}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList>
              <TabsTrigger value="products" className="gap-2">
                <Package className="h-4 w-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                <ShoppingCart className="h-4 w-4" />
                Orders
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Product Inventory</CardTitle>
                    <Dialog open={isProductDialogOpen} onOpenChange={(open) => {
                      setIsProductDialogOpen(open);
                      if (!open) resetProductForm();
                    }}>
                      <DialogTrigger asChild>
                        <Button className="gradient-primary">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Product
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                          <DialogDescription>
                            Fill in the product details below
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Name *</Label>
                              <Input
                                value={productForm.name}
                                onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))}
                                placeholder="Product name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Category *</Label>
                              <Select
                                value={productForm.category}
                                onValueChange={(v) => setProductForm((p) => ({ ...p, category: v }))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((c) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              value={productForm.description}
                              onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))}
                              placeholder="Product description"
                              rows={3}
                            />
                          </div>
                          
                          <div className="grid gap-4 sm:grid-cols-3">
                            <div className="space-y-2">
                              <Label>Price *</Label>
                              <Input
                                type="number"
                                value={productForm.price}
                                onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))}
                                placeholder="0"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Original Price</Label>
                              <Input
                                type="number"
                                value={productForm.original_price}
                                onChange={(e) => setProductForm((p) => ({ ...p, original_price: e.target.value }))}
                                placeholder="0"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Stock *</Label>
                              <Input
                                type="number"
                                value={productForm.stock}
                                onChange={(e) => setProductForm((p) => ({ ...p, stock: e.target.value }))}
                                placeholder="0"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Product Images</Label>
                            <div className="flex flex-wrap gap-2">
                              {productForm.images_url.map((url, idx) => (
                                <div key={idx} className="relative w-20 h-20">
                                  <img src={url} alt="" className="w-full h-full object-cover rounded-lg" />
                                  <button
                                    onClick={() => removeImage(idx)}
                                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                              <label className="w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                                <Upload className="h-6 w-6 text-muted-foreground" />
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                              </label>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={productForm.is_featured}
                                onCheckedChange={(v) => setProductForm((p) => ({ ...p, is_featured: v }))}
                              />
                              <Label>Featured Product</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={productForm.is_flash_sale}
                                onCheckedChange={(v) => setProductForm((p) => ({ ...p, is_flash_sale: v }))}
                              />
                              <Label>Flash Sale</Label>
                            </div>
                          </div>

                          <div className="flex justify-end gap-4">
                            <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSaveProduct} disabled={isSaving} className="gradient-primary">
                              <Save className="h-4 w-4 mr-2" />
                              {isSaving ? "Saving..." : "Save Product"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={product.images_url[0] || "/placeholder.svg"}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <span className="font-medium">{product.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>
                            <div>
                              <span className="font-medium">৳{product.price.toLocaleString()}</span>
                              {product.original_price && (
                                <span className="text-sm text-muted-foreground line-through ml-2">
                                  ৳{product.original_price.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
                              {product.stock}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {product.is_featured && <Badge className="bg-purple-100 text-purple-800">Featured</Badge>}
                              {product.is_flash_sale && <Badge className="bg-orange-100 text-orange-800">Flash Sale</Badge>}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredProducts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No products found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order Management</CardTitle>
                  <div className="flex items-center gap-4 mt-4">
                    <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                      <SelectTrigger className="w-48">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Orders</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.profiles?.name || "N/A"}</p>
                              <p className="text-sm text-muted-foreground">{order.profiles?.phone}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            ৳{order.total_price.toLocaleString()}
                          </TableCell>
                          <TableCell className="capitalize">
                            {order.payment_method === "cod" ? "COD" : order.payment_method}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(order.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onValueChange={(v) => handleUpdateOrderStatus(order.id, v)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredOrders.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No orders found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Admin;
