import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package, Clock, CheckCircle, Truck, X, Eye } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-warm-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">
            Manage your account and track your orders
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Name</Label>
                  <p className="text-lg">{user?.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Email</Label>
                  <p className="text-lg">{user?.email}</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h3 className="font-medium">Order Statistics</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Total Orders</p>
                      <p className="font-semibold">{userOrders.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total Spent</p>
                      <p className="font-semibold">
                        ₹{userOrders.reduce((sum, order) => sum + parseFloat(order.total), 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>My Orders ({userOrders.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <p>Loading your orders...</p>
                  </div>
                ) : userOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-6">Start shopping to see your orders here.</p>
                    <Link href="/products">
                      <Button className="bg-terracotta hover:bg-terracotta/90">
                        Start Shopping
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(order.status)}
                              <span className="font-medium">Order #{order.id}</span>
                            </div>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Order #{order.id} Details</DialogTitle>
                                <DialogDescription>
                                  Tracking Number: {order.trackingNumber}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-6">
                                {/* Order Status */}
                                <div>
                                  <h3 className="font-medium mb-2">Order Status</h3>
                                  <div className="flex items-center space-x-2">
                                    {getStatusIcon(order.status)}
                                    <Badge className={getStatusColor(order.status)}>
                                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </Badge>
                                  </div>
                                </div>

                                {/* Order Items */}
                                <div>
                                  <h3 className="font-medium mb-2">Items Ordered</h3>
                                  <div className="space-y-2">
                                    {JSON.parse(order.items).map((item: any, index: number) => (
                                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <div>
                                          <p className="font-medium">{item.name}</p>
                                          <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                                        </div>
                                        <div className="text-right">
                                          <p>Qty: {item.quantity}</p>
                                          <p className="font-medium">₹{parseFloat(item.price).toLocaleString()}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Shipping Information */}
                                <div>
                                  <h3 className="font-medium mb-2">Shipping Address</h3>
                                  <p className="text-gray-700">{order.shippingAddress}</p>
                                </div>

                                {/* Order Summary */}
                                <div className="border-t pt-4">
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium">Total Amount</span>
                                    <span className="text-xl font-bold">₹{parseFloat(order.total).toLocaleString()}</span>
                                  </div>
                                  <p className="text-sm text-gray-500 mt-1">
                                    Ordered on {new Date(order.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Tracking Number</p>
                            <p className="font-mono font-medium">{order.trackingNumber}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Total Amount</p>
                            <p className="font-semibold">₹{parseFloat(order.total).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Order Date</p>
                            <p>{new Date(order.createdAt).toLocaleDateString()}</p>
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