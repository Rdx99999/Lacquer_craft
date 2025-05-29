
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";

interface WishlistItem {
  id: number;
  name: string;
  price: string;
  image: string;
  addedAt: string;
}

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart, isAddingToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    try {
      const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistItems(savedWishlist);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      setWishlistItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = (productId: number) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    
    toast({
      title: "Removed from Wishlist",
      description: "Item has been removed from your wishlist.",
    });
  };

  const addToCartFromWishlist = (item: WishlistItem) => {
    addToCart({
      productId: item.id,
      quantity: 1,
    });

    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.setItem('wishlist', JSON.stringify([]));
    
    toast({
      title: "Wishlist Cleared",
      description: "All items have been removed from your wishlist.",
    });
  };

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
                onClick={clearWishlist}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
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
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/80 hover:bg-white text-red-500 rounded-full flex items-center justify-center transition-colors duration-200"
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
                      <Link href={`/products/${item.id}`}>
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
