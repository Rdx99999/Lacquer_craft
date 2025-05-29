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

export function ProductCard({ product, showCategory = true, highlightFeatures = [] }: ProductCardProps) {
  const { addToCart, isAddingToCart } = useCart();
  const { toast } = useToast();

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
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {product.featured && (
              <Badge className="bg-saffron text-white">
                Featured
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="destructive">
                Sold Out
              </Badge>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <Badge variant="outline" className="text-orange-600 border-orange-600 bg-white">
                Limited
              </Badge>
            )}
          </div>

          {/* Add to Cart Button */}
          {product.stock > 0 && (
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="bg-terracotta hover:bg-terracotta/90 text-white shadow-lg"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <CardContent className="p-4 flex-1 flex flex-col">
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

            <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>

            <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
              {product.description}
            </p>

            {/* Features */}
            {matchingFeatures.length > 0 && (
              <div className="space-y-1">
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

          <div className="flex items-center justify-between pt-3 mt-auto">
            <span className="text-lg font-bold text-terracotta">
              ₹{parseFloat(product.price).toLocaleString()}
            </span>

            <div className="text-right">
              <div className="text-xs text-gray-500">
                {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}