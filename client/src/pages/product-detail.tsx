import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, ShoppingCart, ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getProduct } from "@/lib/api";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function ProductDetail() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const { addToCart, isAddingToCart } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["/api/products", productId],
    queryFn: () => getProduct(productId),
    enabled: !isNaN(productId),
  });

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      productId: product.id,
      quantity,
    });

    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to your cart.`,
    });
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <Skeleton className="h-96 w-full" />
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/products">
              <Button className="bg-terracotta hover:bg-terracotta/90">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-terracotta">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-terracotta">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category.slug}`} className="hover:text-terracotta">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative overflow-hidden rounded-xl bg-white shadow-lg">
              <div className="aspect-square">
                <img
                  src={product.images[selectedImageIndex] || "/placeholder-image.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {product.featured && (
                  <Badge className="bg-saffron text-white">
                    Featured
                  </Badge>
                )}
                {product.stock === 0 && (
                  <Badge variant="destructive">
                    Out of Stock
                  </Badge>
                )}
                {product.stock > 0 && product.stock <= 5 && (
                  <Badge variant="outline" className="text-orange-600 border-orange-600 bg-white">
                    Limited Stock
                  </Badge>
                )}
              </div>

              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() => setSelectedImageIndex(prev => 
                      prev === 0 ? product.images.length - 1 : prev - 1
                    )}
                  >
                    &#8249;
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() => setSelectedImageIndex(prev => 
                      prev === product.images.length - 1 ? 0 : prev + 1
                    )}
                  >
                    &#8250;
                  </Button>
                </>
              )}

              {/* Image Counter */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                  {selectedImageIndex + 1} / {product.images.length}
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                      selectedImageIndex === index
                        ? "border-terracotta ring-2 ring-terracotta/20"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    <div className="aspect-square">
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {selectedImageIndex === index && (
                      <div className="absolute inset-0 bg-terracotta/10" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Product Features */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Product Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Authentic handcrafted design</li>
                <li>• Traditional Indian artistry</li>
                <li>• Premium quality materials</li>
                <li>• Unique piece with natural variations</li>
              </ul>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{product.category.name}</Badge>
                <span className="text-sm text-gray-500">SKU: {product.sku}</span>
              </div>
              <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-terracotta">
                  ₹{parseFloat(product.price).toLocaleString()}
                </span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-saffron text-saffron" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">(4.8)</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Stock Status */}
            <div>
              {product.stock > 0 ? (
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    In Stock
                  </Badge>
                  {product.stock <= 5 && (
                    <span className="text-orange-600 text-sm">
                      Only {product.stock} left
                    </span>
                  )}
                </div>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            {/* Add to Cart */}
            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="font-medium text-gray-900">Quantity:</label>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="font-medium min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="w-full bg-terracotta hover:bg-terracotta/90"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isAddingToCart ? "Adding to Cart..." : "Add to Cart"}
                </Button>
              </div>
            )}

            {/* Product Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Product Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{product.category.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">SKU:</span>
                    <span className="font-medium">{product.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Availability:</span>
                    <span className="font-medium">
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Handmade:</span>
                    <span className="font-medium">Yes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Origin:</span>
                    <span className="font-medium">India</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
