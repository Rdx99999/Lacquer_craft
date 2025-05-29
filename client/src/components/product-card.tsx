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
        <div className="relative overflow-hidden">
          <img
            src={product.images[0] || "/placeholder-image.jpg"}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.featured && (
            <Badge className="absolute top-2 left-2 bg-saffron text-white">
              Featured
            </Badge>
          )}
          {product.stock === 0 && (
            <Badge className="absolute top-2 right-2 bg-destructive text-white">
              Out of Stock
            </Badge>
          )}
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
