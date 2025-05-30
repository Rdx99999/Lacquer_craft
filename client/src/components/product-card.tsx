import { ShoppingCart, Heart } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useToast } from "@/hooks/use-toast";
import type { Product, ProductWithCategory } from "@shared/schema";
import { Star } from "lucide-react";

interface ProductCardProps {
  product: Product | ProductWithCategory;
  showCategory?: boolean;
  highlightFeatures?: string[];
}

export function ProductCard({ 
  product, 
  showCategory = true,
  highlightFeatures = [] 
}: ProductCardProps) {
  const { addToCart, isAddingToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();

  // Fetch review stats
  // const { data: reviewStats } = useQuery({
  //   queryKey: ["/api/products", product.id, "review-stats"],
  //   queryFn: () => getProductReviewStats(product.id),
  // });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock <= 0) return;

    addToCart({
      productId: product.id,
      quantity: 1,
    });

    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart.`,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const category = 'category' in product ? product.category : null;
  const productFeatures = product.features || [];
  const matchingFeatures = highlightFeatures.length > 0 
    ? productFeatures.filter(feature => 
        highlightFeatures.some(highlight => 
          feature.toLowerCase().includes(highlight.toLowerCase()) ||
          highlight.toLowerCase().includes(feature.toLowerCase())
        )
      ).slice(0, 2)
    : productFeatures.slice(0, 2);

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white h-full flex flex-col">
        <div className="relative aspect-[4/5] overflow-hidden rounded-t-lg">
          {/* Product Image */}
          <img
            src={product.images[0] || "/placeholder-image.jpg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col space-y-1 sm:space-y-2">
            {product.featured && (
              <Badge className="bg-saffron text-white text-xs">
                Featured
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="destructive" className="text-xs">
                Sold Out
              </Badge>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <Badge variant="outline" className="text-orange-600 border-orange-600 bg-white text-xs">
                Limited
              </Badge>
            )}
          </div>

          {/* Add to Cart Button - More prominent on mobile */}
          {product.stock > 0 && (
            <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="bg-terracotta hover:bg-terracotta/90 text-white shadow-lg h-8 w-8 sm:h-9 sm:w-9 p-0"
              >
                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          )}
        </div>

        <CardContent className="p-3 sm:p-4 flex-1 flex flex-col">
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              {showCategory && category && (
                <Badge variant="outline" className="text-xs">
                  {category.name}
                </Badge>
              )}
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-saffron text-saffron" />
                ))}
                <span className="text-xs text-gray-500 ml-1">4.8</span>
              </div>
            </div>

            <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] text-xs sm:text-base leading-tight">
              {product.name}
            </h3>

            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 min-h-[1.5rem] sm:min-h-[2.5rem] leading-tight">
              {product.description}
            </p>

            {/* Features - Simplified for mobile */}
            {matchingFeatures.length > 0 && (
              <div className="space-y-1 hidden sm:block">
                <div className="text-xs text-gray-500">Features:</div>
                <div className="flex flex-wrap gap-1">
                  {matchingFeatures.map((feature, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className={`text-xs ${
                        highlightFeatures.some(h => 
                          feature.toLowerCase().includes(h.toLowerCase()) ||
                          h.toLowerCase().includes(feature.toLowerCase())
                        ) ? 'bg-saffron/20 text-saffron border-saffron' : ''
                      }`}
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 sm:pt-3 mt-auto">
            <span className="text-base sm:text-lg font-bold text-terracotta">
              ₹{parseFloat(product.price).toLocaleString()}
            </span>

            <div className="flex items-center space-x-2">
              <div className="text-right">
                <div className="text-xs text-gray-500">
                  {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWishlist(product.id);
                }}
                className={`p-1 sm:p-2 transition-colors h-8 w-8 ${
                  isInWishlist(product.id) 
                    ? "bg-red-50 text-red-500 hover:bg-red-100" 
                    : "hover:bg-red-50 text-gray-400 hover:text-red-500"
                }`}
                aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}