import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getProduct, getRecommendedProducts, addToCart } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { ChevronLeft, ChevronRight, Star, Plus, Minus, Heart, Share2, X, ArrowRight, ArrowLeft, ShoppingCart } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProductCard } from "@/components/product-card";

export default function ProductDetail() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(0);

  const { addToCart, isAddingToCart } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["/api/products", productId],
    queryFn: () => getProduct(productId),
    enabled: !isNaN(productId),
  });

  // Get recommended products
  const { data: recommendedProducts = [] } = useQuery({
    queryKey: ["/api/products", productId, "recommendations"],
    queryFn: () => getRecommendedProducts(productId),
    enabled: !isNaN(productId) && !!product,
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

  const handleImageDoubleClick = () => {
    setFullscreenImageIndex(selectedImageIndex);
    setIsFullscreenOpen(true);
  };

  const handleFullscreenPrevious = () => {
    if (!product) return;
    setFullscreenImageIndex(prev => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleFullscreenNext = () => {
    if (!product) return;
    setFullscreenImageIndex(prev => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!product) return;
    if (e.key === 'ArrowLeft') {
      handleFullscreenPrevious();
    } else if (e.key === 'ArrowRight') {
      handleFullscreenNext();
    } else if (e.key === 'Escape') {
      setIsFullscreenOpen(false);
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
            {/* Main Image Container */}
            <div className="relative bg-gray-50 rounded-xl overflow-hidden">
              {/* Image Counter */}
              {product.images.length > 1 && (
                <div className="absolute top-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full z-10">
                  {selectedImageIndex + 1} / {product.images.length}
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2 z-10">
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

              {/* Main Image */}
              <div className="relative aspect-[4/5] bg-white cursor-pointer" onDoubleClick={handleImageDoubleClick}>
                <img
                  src={product.images[selectedImageIndex] || "/placeholder-image.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                />

                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(prev => 
                        prev === 0 ? product.images.length - 1 : prev - 1
                      )}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-colors duration-200 z-10"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(prev => 
                        prev === product.images.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-colors duration-200 z-10"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {product.images.length > 1 && (
                <div className="bg-white border-t p-4">
                  <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          selectedImageIndex === index
                            ? "border-terracotta"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Zoom and Share Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  Zoom
                </Button>
                <Button variant="outline" size="sm">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share
                </Button>
              </div>
              <span className="text-sm text-gray-500">
                Double-click image to view fullscreen
              </span>
            </div>

            {/* Product Features */}
            {product.features && product.features.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Product Features</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              </div>
            )}
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

        {/* Recommended Products Section */}
        {recommendedProducts.length > 0 && (
          <div className="mt-16 border-t pt-12">
            <div className="mb-8">
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">
                You might also like
              </h2>
              <p className="text-gray-600">
                Products with similar features and from related categories
              </p>
            </div>

            {/* Same Category Products */}
            {recommendedProducts.filter(p => p.categoryId === product.categoryId).length > 0 && (
              <div className="mb-12">
                <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center">
                  <Badge variant="outline" className="mr-2">{product.category.name}</Badge>
                  More from this category
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recommendedProducts
                    .filter(p => p.categoryId === product.categoryId)
                    .slice(0, 4)
                    .map((recommendedProduct) => (
                      <ProductCard 
                        key={recommendedProduct.id} 
                        product={recommendedProduct} 
                        showCategory={false}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Similar Features Products */}
            {recommendedProducts.filter(p => p.categoryId !== product.categoryId).length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center">
                  <Badge variant="outline" className="mr-2 bg-saffron/10 text-saffron border-saffron">Similar Features</Badge>
                  Products with similar characteristics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recommendedProducts
                    .filter(p => p.categoryId !== product.categoryId)
                    .slice(0, 4)
                    .map((recommendedProduct) => (
                      <ProductCard 
                        key={recommendedProduct.id} 
                        product={recommendedProduct} 
                        showCategory={true}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* View More Links */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/products?category=${product?.category?.slug}`}>
                <Button variant="outline" className="border-terracotta text-terracotta hover:bg-terracotta hover:text-white">
                  View all {product?.category?.name}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  Browse all products
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Fullscreen Image Modal */}
        <Dialog open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen}>
          <DialogContent className="max-w-full max-h-full w-screen h-screen p-0 bg-black/95 border-none" onKeyDown={handleKeyDown}>
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 bg-black/20 hover:bg-black/40 text-white rounded-full w-12 h-12"
                onClick={() => setIsFullscreenOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Image Counter */}
              {product && product.images.length > 1 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full z-50">
                  {fullscreenImageIndex + 1} / {product.images.length}
                </div>
              )}

              {/* Navigation Arrows */}
              {product && product.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/20 hover:bg-black/40 text-white rounded-full w-16 h-16"
                    onClick={handleFullscreenPrevious}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/20 hover:bg-black/40 text-white rounded-full w-16 h-16"
                    onClick={handleFullscreenNext}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}

              {/* Main Fullscreen Image */}
              <div className="w-full h-full flex items-center justify-center p-4 sm:p-8">
                <img
                  src={product?.images[fullscreenImageIndex] || "/placeholder-image.jpg"}
                  alt={product?.name}
                  className="max-w-[95vw] max-h-[80vh] sm:max-w-[90vw] sm:max-h-[85vh] w-auto h-auto object-contain"
                />
              </div>

              {/* Thumbnail Navigation */}
              {product && product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 bg-black/60 p-2 sm:p-3 rounded-full max-w-[95vw] overflow-x-auto scrollbar-hide">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setFullscreenImageIndex(index)}
                      className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        fullscreenImageIndex === index
                          ? "border-white"
                          : "border-gray-500 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Instructions */}
              <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 text-white/70 text-xs sm:text-sm text-center px-4">
                <p>Use arrow keys to navigate • Press ESC to close</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}