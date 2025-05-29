import { ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import type { Product, ProductWithCategory } from "@shared/schema";

interface ProductCardProps {
  product: Product | ProductWithCategory;
  showCategory?: boolean;
}

export function ProductCard({ product, showCategory = false }: ProductCardProps) {
  const { addToCart, isAddingToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation();

    addToCart({
      productId: product.id,
      quantity: 1,
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const category = "category" in product ? product.category : null;

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group cursor-pointer hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <div className="relative overflow-hidden rounded-t-xl bg-white group">
        <div className="aspect-square">
          <img
            src={product.images[0] || "/placeholder-image.jpg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1">
          {product.featured && (
            <Badge className="bg-saffron text-white text-xs">
              Featured
            </Badge>
          )}
          {product.stock === 0 && (
            <Badge variant="destructive" className="text-xs">
              Out of Stock
            </Badge>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <Badge variant="outline" className="text-orange-600 border-orange-600 bg-white text-xs">
              Few Left
            </Badge>
          )}
        </div>

        {/* Image count indicator */}
        {product.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            +{product.images.length - 1}
          </div>
        )}

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white text-sm font-medium">View Details</span>
        </div>
      </div>

        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-gray-900 line-clamp-2 flex-1">
              {product.name}
            </h4>
            {showCategory && category && (
              <Badge variant="outline" className="ml-2 text-xs">
                {category.name}
              </Badge>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="font-bold text-terracotta text-lg">
              ₹{parseFloat(product.price).toLocaleString()}
            </span>

            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAddingToCart}
              className="bg-terracotta hover:bg-terracotta/90 text-white"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </Button>
          </div>

          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-orange-600 text-xs mt-2">
              Only {product.stock} left in stock
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}