import React, { useState, useEffect } from "react";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, User } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { createOrder } from "@/lib/api";
import { AuthDialog } from "@/components/auth/auth-dialog";

export default function Cart() {
  const { cartItems, total, updateItem, removeItem, isUpdating, isRemoving } = useCart();
  const { toast } = useToast();
  const { user, isAuthenticated, login, logout, sessionId } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
    const [autoCheckout, setAutoCheckout] = useState(false);


  // Pre-fill customer info if user is logged in
  React.useEffect(() => {
    if (user) {
      setCustomerInfo(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

      useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('checkout') === 'true') {
      setAutoCheckout(true);
      // Remove the checkout parameter from URL
      window.history.replaceState({}, '', '/cart');

      toast({
        title: "Ready for Checkout",
        description: "Your item has been added to cart. Review and proceed to checkout.",
      });
    }
  }, [toast]);


  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
    } else {
      updateItem({ productId, quantity: newQuantity });
    }
  };

  const handleCheckout = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingOut(true);

    try {
      // Calculate totals
      const subtotal = total;
      const tax = Math.round(total * 0.18);
      const finalTotal = subtotal + tax;

      // Create order data with all required fields
      const orderData = {
        customerName: customerInfo.name.trim(),
        customerEmail: customerInfo.email.trim(),
        customerPhone: customerInfo.phone?.trim() || null,
        shippingAddress: customerInfo.address.trim(),
        total: finalTotal.toString(),
        status: "pending" as const,
        items: JSON.stringify(cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: parseFloat(item.product.price).toString(),
          name: item.product.name.trim(),
          sku: item.product.sku
        })))
      };

      console.log("Sending order data:", orderData);
      const newOrder = await createOrder(orderData, sessionId!);

      toast({
        title: "Order Placed Successfully!",
        description: `Your tracking number is: ${newOrder.trackingNumber}. You will receive a confirmation email shortly.`,
        duration: 8000,
      });

      // Clear the cart and reset form
      clearCart();
      setCustomerInfo({ name: "", email: "", phone: "", address: "" });
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Order Failed",
        description: error.message || "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-warm-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="text-gray-400 mb-8">
              <ShoppingBag className="w-24 h-24 mx-auto" />
            </div>
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any beautiful crafts to your cart yet. 
              Explore our collection and discover amazing handmade products.
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-terracotta hover:bg-terracotta/90">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <h1 className="font-display text-3xl font-bold text-gray-900 ml-6">
            Shopping Cart
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Cart Items ({cartItems.length})</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => clearCart()}
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear Cart
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-center space-x-4">
                      <Link href={`/products/${item.productId}`}>
                        <img
                          src={item.product.images[0] || "/placeholder-image.jpg"}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${item.productId}`}>
                          <h3 className="font-semibold text-gray-900 hover:text-terracotta transition-colors cursor-pointer">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                          SKU: {item.product.sku}
                        </p>
                        <p className="text-terracotta font-medium">
                          ₹{parseFloat(item.product.price).toLocaleString()} each
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          disabled={isUpdating || isRemoving}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>

                        <span className="font-medium min-w-[3rem] text-center">
                          {item.quantity}
                        </span>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          disabled={isUpdating || isRemoving || item.quantity >= item.product.stock}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₹{(parseFloat(item.product.price) * item.quantity).toLocaleString()}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(item.productId)}
                          disabled={isRemoving}
                          className="text-red-500 hover:text-red-700 mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {index < cartItems.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Checkout */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span>₹{(parseFloat(item.product.price) * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{Math.round(total * 0.18).toLocaleString()}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-terracotta">₹{Math.round(total * 1.18).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* User Authentication Status */}
            {isAuthenticated ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Logged in as
                    </span>
                    <Button variant="outline" size="sm" onClick={logout}>
                      Logout
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Authentication Required</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Please login or create an account to place your order.
                  </p>
                  <Button 
                    onClick={() => setShowAuthDialog(true)}
                    className="w-full"
                    variant="outline"
                  >
                    Login / Register
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Shipping Address *</Label>
                  <Textarea
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter your complete address"
                    rows={3}
                  />
                </div>

                                <Button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className={`w-full bg-terracotta hover:bg-terracotta/90`}
                  size="lg"
                >
                  {isCheckingOut ? "Processing..." : isAuthenticated ? "Place Order" : "Login to Place Order"}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By placing your order, you agree to our terms and conditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onSuccess={(userData, sessionId) => {
          login(userData, sessionId);
          toast({
            title: "Success!",
            description: "You can now complete your order.",
          });
        }}
      />
    </div>
  );
}