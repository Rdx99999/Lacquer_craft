import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package, Clock, CheckCircle, Truck, X, Eye, User, Mail, Calendar, ShoppingBag, Star, Award, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { getOrders } from "@/lib/api";

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["/api/orders"],
    queryFn: getOrders,
    enabled: isAuthenticated,
  });

  // Filter orders for current user
  const userOrders = orders.filter(order => order.userId === user?.id);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <Package className="h-4 w-4" />;
      case "cancelled":
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-warm-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">
              Please Login
            </h1>
            <p className="text-gray-600 mb-8">
              You need to be logged in to view your profile and orders.
            </p>
            <Link href="/">
              <Button size="lg" className="bg-terracotta hover:bg-terracotta/90">
                Go to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate user stats
  const totalSpent = userOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
  const completedOrders = userOrders.filter(order => order.status === "delivered").length;
  const loyaltyLevel = totalSpent > 10000 ? "Gold" : totalSpent > 5000 ? "Silver" : "Bronze";
  const nextLevelAmount = loyaltyLevel === "Bronze" ? 5000 - totalSpent : loyaltyLevel === "Silver" ? 10000 - totalSpent : 0;
  const loyaltyProgress = loyaltyLevel === "Bronze" ? (totalSpent / 5000) * 100 : loyaltyLevel === "Silver" ? ((totalSpent - 5000) / 5000) * 100 : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-cream to-sage/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-terracotta to-saffron p-8 mb-8 text-white">
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h1 className="font-display text-4xl font-bold mb-2">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-white/90 text-lg">
                  Discover your journey with authentic Indian crafts
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span>{loyaltyLevel} Member</span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Orders</p>
                  <p className="text-3xl font-bold text-blue-900">{userOrders.length}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Total Spent</p>
                  <p className="text-3xl font-bold text-green-900">₹{totalSpent.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold text-purple-900">{completedOrders}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 text-sm font-medium">Loyalty Level</p>
                  <p className="text-2xl font-bold text-amber-900">{loyaltyLevel}</p>
                </div>
                <Star className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-terracotta/10 to-saffron/10 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2 text-terracotta">
                  <User className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Name</Label>
                      <p className="text-lg font-semibold">{user?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Email</Label>
                      <p className="text-lg font-semibold">{user?.email}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100">
                <CardTitle className="flex items-center space-x-2 text-amber-700">
                  <Award className="h-5 w-5" />
                  <span>Loyalty Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-amber-600 mb-2">{loyaltyLevel}</div>
                  <div className="text-sm text-gray-600">Member Level</div>
                </div>
                {loyaltyLevel !== "Gold" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to {loyaltyLevel === "Bronze" ? "Silver" : "Gold"}</span>
                      <span>{Math.round(loyaltyProgress)}%</span>
                    </div>
                    <Progress value={loyaltyProgress} className="h-2" />
                    <p className="text-xs text-gray-500 text-center">
                      Spend ₹{nextLevelAmount.toLocaleString()} more to reach {loyaltyLevel === "Bronze" ? "Silver" : "Gold"} level
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Orders List */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-terracotta/10 to-saffron/10 rounded-t-lg">
                <CardTitle className="flex items-center justify-between text-terracotta">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>My Orders ({userOrders.length})</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your orders...</p>
                  </div>
                ) : userOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                      <Package className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">No orders yet</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                      Start your journey with authentic Indian crafts. Explore our beautiful collection of handmade products.
                    </p>
                    <Link href="/products">
                      <Button className="bg-gradient-to-r from-terracotta to-saffron hover:from-terracotta/90 hover:to-saffron/90 text-white px-8 py-3 rounded-lg font-medium shadow-lg">
                        Start Shopping
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {userOrders.map((order, index) => (
                      <div key={order.id} className="relative overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-all duration-300 group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-terracotta to-saffron"></div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <div className={`p-2 rounded-full ${
                                  order.status === "delivered" ? "bg-green-100" :
                                  order.status === "shipped" ? "bg-blue-100" :
                                  order.status === "confirmed" ? "bg-purple-100" :
                                  order.status === "cancelled" ? "bg-red-100" : "bg-yellow-100"
                                }`}>
                                  {getStatusIcon(order.status)}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                                  <p className="text-sm text-gray-500">
                                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <Badge className={`${getStatusColor(order.status)} px-3 py-1 text-xs font-medium rounded-full`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="hover:bg-terracotta hover:text-white transition-colors"
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="text-2xl font-bold text-gray-900">Order #{order.id} Details</DialogTitle>
                                  <DialogDescription className="text-lg">
                                    Tracking Number: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{order.trackingNumber}</span>
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-8">
                                  {/* Order Status */}
                                  <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold mb-3 flex items-center">
                                      <Clock className="h-5 w-5 mr-2 text-gray-600" />
                                      Order Status
                                    </h3>
                                    <div className="flex items-center space-x-3">
                                      <div className={`p-3 rounded-full ${
                                        order.status === "delivered" ? "bg-green-100" :
                                        order.status === "shipped" ? "bg-blue-100" :
                                        order.status === "confirmed" ? "bg-purple-100" :
                                        order.status === "cancelled" ? "bg-red-100" : "bg-yellow-100"
                                      }`}>
                                        {getStatusIcon(order.status)}
                                      </div>
                                      <div>
                                        <Badge className={`${getStatusColor(order.status)} px-4 py-2 text-sm font-medium rounded-full`}>
                                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </Badge>
                                        <p className="text-sm text-gray-600 mt-1">
                                          Updated on {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Order Items */}
                                  <div>
                                    <h3 className="font-semibold mb-4 flex items-center">
                                      <Package className="h-5 w-5 mr-2 text-gray-600" />
                                      Items Ordered
                                    </h3>
                                    <div className="space-y-3">
                                      {JSON.parse(order.items).map((item: any, index: number) => (
                                        <div key={index} className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                          <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                                            <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-lg font-bold text-terracotta">₹{parseFloat(item.price).toLocaleString()}</p>
                                            <p className="text-sm text-gray-500">per item</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Shipping Information */}
                                  <div className="bg-blue-50 rounded-lg p-4">
                                    <h3 className="font-semibold mb-3 flex items-center">
                                      <Truck className="h-5 w-5 mr-2 text-blue-600" />
                                      Shipping Address
                                    </h3>
                                    <p className="text-gray-700 bg-white p-3 rounded border">{order.shippingAddress}</p>
                                  </div>

                                  {/* Order Summary */}
                                  <div className="border-t pt-6">
                                    <div className="bg-gradient-to-r from-terracotta/10 to-saffron/10 rounded-lg p-6">
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="text-lg font-semibold">Total Amount</span>
                                        <span className="text-3xl font-bold text-terracotta">₹{parseFloat(order.total).toLocaleString()}</span>
                                      </div>
                                      <p className="text-sm text-gray-600">
                                        Ordered on {new Date(order.createdAt).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-sm font-medium text-gray-500 mb-1">Tracking Number</p>
                              <p className="font-mono text-sm bg-white px-2 py-1 rounded border">{order.trackingNumber}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-sm font-medium text-gray-500 mb-1">Total Amount</p>
                              <p className="text-xl font-bold text-terracotta">₹{parseFloat(order.total).toLocaleString()}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-sm font-medium text-gray-500 mb-1">Order Date</p>
                              <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}