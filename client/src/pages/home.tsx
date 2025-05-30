import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, Star, Award, Truck, Shield, Users, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product-card";
import { getProducts, getCategories, getSettings } from "@/lib/api";

export default function Home() {
  const { data: featuredProducts = [] } = useQuery({
    queryKey: ["/api/products", { featured: true }],
    queryFn: () => getProducts({ featured: true }),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: getCategories,
  });

  const { data: settings = [] } = useQuery({
    queryKey: ["/api/settings"],
    queryFn: getSettings,
  });

  // Convert settings array to key-value object
  const settingsMap = settings.reduce((acc: any, setting: any) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {});

  // Default values if settings are not available
  const heroTitle = settingsMap.heroTitle || "Authentic";
  const heroSubtitle = settingsMap.heroSubtitle || "Indian Arts";
  const heroDescription = settingsMap.heroDescription || "Discover masterpieces created by skilled artisans who carry forward centuries-old traditions. Each piece is a testament to India's rich cultural heritage.";
  const heroImage = settingsMap.heroImage || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";
  const heroButtonText = settingsMap.heroButtonText || "Explore Collection";
  const heroButtonSecondaryText = settingsMap.heroButtonSecondaryText || "Our Story";

  // Fallback images for categories without thumbnails
  const fallbackCategoryImages = {
    pottery: "https://pixabay.com/get/gb570087a032ff2f3d571d2c0ea66b8c0c1922cc79890f4e40b065b584a8583a3764759c6653e0465c9a4aa8d5483d8363957d0cf25a46d507171428ac91144ee_1280.jpg",
    textiles: "https://pixabay.com/get/g0c2883f32546fb1194e48ed2f9534dc76209e24104a2c2aaaee63cf584261f94432f323f9597e3aeae98ef54273a39acd39e829f6b2773296e831d0cd6eb2ecc_1280.jpg",
    jewelry: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    woodwork: "https://images.unsplash.com/photo-1587813369290-091c9d432daf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
  };

  return (
    <div className="min-h-screen bg-warm-cream">
      {/* Hero Section - Hidden on mobile, visible on desktop */}
      <section className="relative overflow-hidden hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-terracotta/20 via-saffron/10 to-warm-cream" />
        
        {/* Logo Background Pattern */}
        <div className="absolute inset-0 opacity-3" 
             style={{
               backgroundImage: `url("/images/logo.png")`,
               backgroundSize: '150px 150px',
               backgroundRepeat: 'repeat',
               backgroundPosition: 'center',
             }} />
        
        {/* Decorative Pattern Overlay */}
        <div className="absolute inset-0 opacity-3" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
             }} />
        
        <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-left space-y-4 lg:space-y-6">
              <div className="space-y-3 lg:space-y-4">
                <div className="flex items-center justify-center sm:justify-start">
                  <Badge className="bg-gradient-to-r from-terracotta/10 to-saffron/10 text-terracotta border-terracotta/20 px-3 py-1.5 text-xs font-medium shadow-sm">
                    <Sparkles className="h-3 w-3 mr-1.5 text-saffron" />
                    <span className="hidden sm:inline">Handcrafted Excellence Since 1947</span>
                    <span className="sm:hidden">Heritage Since 1947</span>
                  </Badge>
                </div>
                
                <div className="text-center sm:text-left">
                  <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                    <span className="text-gray-900">{heroTitle}</span>
                    <span className="text-terracotta block mt-1">{heroSubtitle}</span>
                    <span className="text-saffron block mt-1">& Crafts</span>
                  </h1>
                </div>
                
                <div className="text-center sm:text-left">
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed max-w-lg mx-auto sm:mx-0">
                    {heroDescription}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-3 pt-2">
                <Link href="/products" className="w-full sm:w-auto">
                  <Button className="bg-gradient-to-r from-terracotta to-saffron hover:from-terracotta/90 hover:to-saffron/90 text-white px-6 py-3 text-sm font-medium w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300">
                    {heroButtonText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" className="border-terracotta/20 text-terracotta hover:bg-terracotta/5 px-6 py-3 text-sm font-medium w-full sm:w-auto transition-all duration-300">
                  <Heart className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">{heroButtonSecondaryText}</span>
                  <span className="sm:hidden">Our Story</span>
                </Button>
              </div>
              
              {/* Enhanced Stats */}
              <div className="bg-gradient-to-r from-warm-cream/50 to-soft-beige/50 rounded-lg p-4 sm:p-6 border border-terracotta/10">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 text-terracotta" />
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-terracotta">500+</div>
                    <div className="text-xs text-gray-600">Artisans</div>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-saffron/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-saffron" />
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-saffron">15K+</div>
                    <div className="text-xs text-gray-600">Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Award className="h-4 w-4 sm:h-5 sm:w-5 text-terracotta" />
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-terracotta">25+</div>
                    <div className="text-xs text-gray-600">States</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Right Visual - Hidden on mobile, visible on desktop */}
            <div className="relative mt-6 lg:mt-0 order-first lg:order-last hidden lg:block">
              {/* Main Image with Enhanced Styling */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={heroImage}
                  alt="Traditional Indian Craftsmanship"
                  className="w-full h-[280px] sm:h-[320px] lg:h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
                
                {/* Bottom overlay with authentic touch */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-800">Master Craftsman</p>
                      <p className="text-xs text-gray-600">Creating heritage pieces</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-saffron fill-current" />
                      <span className="text-xs font-medium text-gray-800">4.9</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Cards - Hidden on mobile for cleaner look */}
              <div className="hidden sm:block absolute -top-4 lg:-top-6 -left-4 lg:-left-6 bg-white rounded-lg lg:rounded-xl shadow-lg p-3 lg:p-4 border border-gray-100">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="w-8 h-8 lg:w-12 lg:h-12 bg-saffron/10 rounded-full flex items-center justify-center">
                    <Award className="h-4 w-4 lg:h-6 lg:w-6 text-saffron" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm lg:text-base">Certified Authentic</div>
                    <div className="text-xs lg:text-sm text-gray-600">100% Handmade</div>
                  </div>
                </div>
              </div>
              
              <div className="hidden sm:block absolute -bottom-4 lg:-bottom-6 -right-4 lg:-right-6 bg-white rounded-lg lg:rounded-xl shadow-lg p-3 lg:p-4 border border-gray-100">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="w-8 h-8 lg:w-12 lg:h-12 bg-terracotta/10 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 lg:h-6 lg:w-6 text-terracotta" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm lg:text-base">Lifetime Support</div>
                    <div className="text-xs lg:text-sm text-gray-600">Artisan Care</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-4 sm:py-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
            <div className="text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
                <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-terracotta" />
              </div>
              <div className="font-semibold text-gray-900 text-xs sm:text-sm">Free Shipping</div>
              <div className="text-xs text-gray-600">Orders ₹2000+</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-saffron/10 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-saffron" />
              </div>
              <div className="font-semibold text-gray-900 text-xs sm:text-sm">Authentic</div>
              <div className="text-xs text-gray-600">100% handmade</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-terracotta" />
              </div>
              <div className="font-semibold text-gray-900 text-xs sm:text-sm">Secure</div>
              <div className="text-xs text-gray-600">Safe payment</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-saffron/10 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-saffron" />
              </div>
              <div className="font-semibold text-gray-900 text-xs sm:text-sm">Direct Support</div>
              <div className="text-xs text-gray-600">To craftsman</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-6 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-4 sm:mb-8">
            <Badge className="bg-terracotta/10 text-terracotta border-terracotta/20 px-2 py-1 sm:px-3 sm:py-1.5 mb-2 sm:mb-4 text-xs">
              Curated Collections
            </Badge>
            <h2 className="font-display text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              Explore Our <span className="text-terracotta">Craft Categories</span>
            </h2>
            <p className="text-xs sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-4 hidden sm:block">
              Each category represents centuries of artistic tradition, carefully preserved and passed down through generations of master craftspeople
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
            {categories.map((category, index) => (
              <Link key={category.id} href={`/products?category=${category.slug}`}>
                <Card className="group cursor-pointer h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative overflow-hidden">
                    <img
                      src={category.thumbnail || fallbackCategoryImages[category.slug as keyof typeof fallbackCategoryImages] || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"}
                      alt={`${category.name} Collection`}
                      className="w-full h-24 sm:h-40 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                      <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs">
                        {index === 0 ? 'Popular' : index === 1 ? 'Trending' : index === 2 ? 'Premium' : 'Classic'}
                      </Badge>
                    </div>
                    <div className="absolute bottom-1 sm:bottom-4 left-1 sm:left-4 text-white">
                      <h3 className="font-display text-xs sm:text-lg lg:text-xl font-bold mb-0.5 sm:mb-1 group-hover:text-saffron transition-colors duration-300">
                        {category.name}
                      </h3>
                      <p className="text-xs opacity-90 leading-relaxed line-clamp-2 hidden sm:block">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <CardContent className="p-1.5 sm:p-4 bg-gradient-to-br from-warm-cream to-white">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600">
                        Explore
                      </span>
                      <ArrowRight className="h-3 w-3 text-terracotta group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 sm:py-16 lg:py-20 bg-gradient-to-br from-warm-cream via-soft-beige to-warm-cream">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <Badge className="bg-saffron/10 text-saffron border-saffron/20 px-2 py-1 sm:px-4 sm:py-2 mb-3 sm:mb-6 text-xs sm:text-sm">
              Master Artisan Picks
            </Badge>
            <h2 className="font-display text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-6">
              Featured <span className="text-saffron">Masterpieces</span>
            </h2>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4 hidden sm:block">
              Handpicked treasures that showcase the pinnacle of traditional Indian craftsmanship, each piece telling a unique story of heritage and skill
            </p>
          </div>
          
          {/* Mobile: Compact 2-column grid */}
          <div className="block sm:hidden mb-6">
            <div className="grid grid-cols-2 gap-2">
              {featuredProducts.slice(0, 4).map((product) => (
                <div key={product.id} className="transform hover:scale-[1.02] transition-transform duration-300">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Desktop: Multi-column grid */}
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8 sm:mb-16">
            {featuredProducts.map((product) => (
              <div key={product.id} className="transform hover:scale-105 transition-transform duration-300">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/products">
              <Button size="lg" className="bg-terracotta hover:bg-terracotta/90 text-white px-4 sm:px-8 py-2.5 sm:py-4 text-sm sm:text-lg shadow-lg hover:shadow-xl transition-shadow duration-300 w-full sm:w-auto">
                Discover All Masterpieces
                <ArrowRight className="ml-2 h-3 w-3 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Artisan Story Section */}
      <section className="py-8 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <Badge className="bg-terracotta/10 text-terracotta border-terracotta/20 px-2 py-1 sm:px-4 sm:py-2 mb-3 sm:mb-6 text-xs sm:text-sm">
                Our Heritage
              </Badge>
              <h2 className="font-display text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-6 leading-tight">
                Preserving <span className="text-terracotta">Traditions</span><br className="hidden sm:block" />
                <span className="sm:hidden"> & </span>Supporting <span className="text-saffron">Artisans</span>
              </h2>
              <p className="text-sm sm:text-lg text-gray-600 mb-4 sm:mb-8 leading-relaxed">
                Every purchase directly supports traditional artisan families across India. We work closely with skilled craftspeople, ensuring fair wages and preserving age-old techniques for future generations.
              </p>
              
              <div className="space-y-3 sm:space-y-6 mb-4 sm:mb-8">
                <div className="flex items-start space-x-2 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                    <Heart className="h-4 w-4 sm:h-6 sm:w-6 text-terracotta" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Direct Impact</h3>
                    <p className="text-gray-600 text-xs sm:text-base">Your purchase directly supports artisan families and helps preserve traditional crafts.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-saffron/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                    <Award className="h-4 w-4 sm:h-6 sm:w-6 text-saffron" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Quality Assurance</h3>
                    <p className="text-gray-600 text-xs sm:text-base">Every piece is carefully inspected and comes with authenticity certification.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                    <Users className="h-4 w-4 sm:h-6 sm:w-6 text-terracotta" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Community Building</h3>
                    <p className="text-gray-600 text-xs sm:text-base">We foster a community that values authentic craftsmanship and cultural heritage.</p>
                  </div>
                </div>
              </div>
              
              <Button size="lg" variant="outline" className="border-terracotta text-terracotta hover:bg-terracotta hover:text-white px-4 sm:px-8 py-2.5 sm:py-4 text-sm sm:text-lg w-full sm:w-auto">
                <span className="hidden sm:inline">Learn Our Story</span>
                <span className="sm:hidden">Our Story</span>
                <ArrowRight className="ml-2 h-3 w-3 sm:h-5 sm:w-5" />
              </Button>
            </div>
            
            <div className="order-1 lg:order-2 hidden lg:block">
              <div className="relative">
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div className="space-y-2 sm:space-y-4">
                    <img
                      src="https://images.unsplash.com/photo-1594736797933-d0da6ac65bce?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                      alt="Artisan at work"
                      className="w-full h-32 sm:h-48 object-cover rounded-lg sm:rounded-xl shadow-lg"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
                      alt="Traditional tools"
                      className="w-full h-24 sm:h-32 object-cover rounded-lg sm:rounded-xl shadow-lg"
                    />
                  </div>
                  <div className="space-y-2 sm:space-y-4 mt-4 sm:mt-8">
                    <img
                      src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
                      alt="Handmade pottery"
                      className="w-full h-24 sm:h-32 object-cover rounded-lg sm:rounded-xl shadow-lg"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1609887461110-46dc7516de27?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                      alt="Craft workshop"
                      className="w-full h-32 sm:h-48 object-cover rounded-lg sm:rounded-xl shadow-lg"
                    />
                  </div>
                </div>
                
                {/* Floating Achievement Card - Hidden on mobile for space */}
                <div className="hidden sm:block absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 sm:p-6 border border-gray-100">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-terracotta mb-1">500+</div>
                    <div className="text-xs sm:text-sm text-gray-600">Artisan Families</div>
                    <div className="text-xs sm:text-sm text-gray-600">Supported</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-8 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-12">
            <h3 className="font-display text-xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
              What Our Customers Say
            </h3>
            <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
              Authentic experiences from our valued customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            {[
              {
                name: "Priya Sharma",
                location: "Mumbai",
                content: "The quality of craftsmanship is exceptional. Each piece is truly unique and tells its own story.",
              },
              {
                name: "Raj Patel", 
                location: "Ahmedabad",
                content: "Hastkala brings authentic Indian art to my home. The shipping was careful and the products arrived perfectly.",
              },
              {
                name: "Anita Singh",
                location: "Delhi",
                content: "Supporting traditional artisans while getting beautiful handmade pieces. Couldn't be happier with my purchase!",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-warm-cream">
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-center mb-2 sm:mb-4">
                    <div className="flex text-saffron">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-terracotta rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                      {testimonial.name[0]}
                    </div>
                    <div className="ml-2 sm:ml-3">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</p>
                      <p className="text-gray-600 text-xs sm:text-sm">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-display text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Hastkala</h4>
              <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                Preserving Indian craftsmanship traditions through authentic handmade products.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-2 sm:mb-4 text-sm sm:text-base">Categories</h5>
              <ul className="space-y-1 sm:space-y-2 text-gray-300">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link href={`/products?category=${category.slug}`} className="hover:text-white text-xs sm:text-sm">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-2 sm:mb-4 text-sm sm:text-base">Customer Service</h5>
              <ul className="space-y-1 sm:space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white text-xs sm:text-sm">Contact Us</a></li>
                <li><a href="#" className="hover:text-white text-xs sm:text-sm">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white text-xs sm:text-sm">Returns</a></li>
                <li><a href="#" className="hover:text-white text-xs sm:text-sm">FAQ</a></li>
              </ul>
            </div>
            
            <div className="col-span-2 md:col-span-1">
              <h5 className="font-semibold mb-2 sm:mb-4 text-sm sm:text-base">Newsletter</h5>
              <p className="text-gray-300 mb-2 sm:mb-4 text-xs sm:text-sm">
                Subscribe for updates on new crafts and artisan stories.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-2 py-1 sm:px-3 sm:py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-terracotta text-xs sm:text-sm"
                />
                <Button className="bg-terracotta px-2 py-1 sm:px-4 sm:py-2 rounded-r-lg hover:bg-terracotta/90 text-xs sm:text-sm">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-4 sm:mt-8 pt-4 sm:pt-8 text-center text-gray-300">
            <p className="text-xs sm:text-sm">&copy; 2024 Hastkala. All rights reserved. Preserving tradition, embracing modernity.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
