
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { getWishlist, removeFromWishlist as removeFromWishlistAPI, clearWishlist as clearWishlistAPI } from "@/lib/api";

interface WishlistItem {
  id: number;
  productId: number;
  name: string;
  price: string;
  image: string;
  addedAt: string;
}

export default function Wishlist() {
  const { user } = useAuth();
  const { addToCart, isAddingToCart } = useCart();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch wishlist from server
  const { data: wishlistItems = [], isLoading, error } = useQuery({
    queryKey: ["/api/wishlist", user?.id],
    queryFn: () => user ? getWishlist(user.id) : Promise.resolve([]),
    enabled: !!user,
  });

  // Remove from wishlist mutation
  const removeFromWishlistMutation = useMutation({
    mutationFn: ({ productId }: { productId: number }) => 
      user ? removeFromWishlistAPI(user.id, productId) : Promise.reject("No user"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist", user?.id] });
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist.",
        variant: "destructive",
      });
    },
  });

  // Clear wishlist mutation
  const clearWishlistMutation = useMutation({
    mutationFn: () => user ? clearWishlistAPI(user.id) : Promise.reject("No user"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist", user?.id] });
      toast({
        title: "Wishlist Cleared",
        description: "All items have been removed from your wishlist.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear wishlist.",
        variant: "destructive",
      });
    },
  });

  const handleRemoveFromWishlist = (productId: number) => {
    removeFromWishlistMutation.mutate({ productId });
  };

  const addToCartFromWishlist = (item: WishlistItem) => {
    addToCart({
      productId: item.productId,
      quantity: 1,
    });

    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const handleClearWishlist = () => {
    clearWishlistMutation.mutate();
  };

  // Show login message if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign in to view your wishlist</h1>
            <p className="text-gray-600 mb-6">
              You need to be signed in to save and view your wishlist items.
            </p>
            <Link href="/">
              <Button className="bg-terracotta hover:bg-terracotta/90 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go to Homepage
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Heart className="h-8 w-8 text-terracotta" />
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            {wishlistItems.length > 0 && (
              <Badge className="bg-terracotta text-white">
                {wishlistItems.length} items
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <Link href="/products">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            {wishlistItems.length > 0 && (
              <Button 
                variant="outline" 
                onClick={handleClearWishlist}
                disabled={clearWishlistMutation.isPending}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {clearWishlistMutation.isPending ? "Clearing..." : "Clear All"}
              </Button>
            )}
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start browsing our collection and add items to your wishlist to save them for later.
            </p>
            <Link href="/products">
              <Button className="bg-terracotta hover:bg-terracotta/90 text-white">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => handleRemoveFromWishlist(item.productId)}
                    disabled={removeFromWishlistMutation.isPending}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/80 hover:bg-white text-red-500 rounded-full flex items-center justify-center transition-colors duration-200 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Added {new Date(item.addedAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-terracotta">
                        ₹{parseFloat(item.price).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => addToCartFromWishlist(item)}
                        disabled={isAddingToCart}
                        className="flex-1 bg-terracotta hover:bg-terracotta/90 text-white"
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add to Cart
                      </Button>
                      <Link href={`/products/${item.productId}`}>
                        <Button size="sm" variant="outline" className="flex-1">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
