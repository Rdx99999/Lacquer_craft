import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, Star, Award, Truck, Shield, Users, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product-card";
import { getProducts, getCategories, getSettings } from "@/lib/api";
import artisanImage from "@assets/image29.png";
import craftWorkshopImage from "@assets/image30.png";
import traditionalToolsImage from "@assets/image13.png";

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
  const heroImage = settingsMap.heroImage || "/images/hero-banner.png";
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
    <div className="min-h-screen bg-warm-cream ethnic-pattern">
      {/* Hero Section - Enhanced Indian Design */}
      <section className="relative overflow-hidden">
        {/* Traditional Indian Pattern Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-warm-cream via-soft-beige to-sandalwood" />
        
        {/* Decorative overlay with traditional motifs */}
        <div className="absolute inset-0 paisley-pattern opacity-30" />
        
        {/* Decorative border elements */}
        <div className="absolute top-0 left-0 w-full h-2 heritage-gradient"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 heritage-gradient"></div>
        
        <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-left space-y-6 lg:space-y-8">
              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-center justify-center sm:justify-start">
                  <Badge className="bg-saffron/20 backdrop-blur-sm text-henna border-terracotta/30 px-4 py-2 text-sm font-serif traditional-shadow">
                    <span className="hidden sm:inline">🏺 प्रामाणिक भारतीय शिल्प • Authentic Indian Crafts</span>
                    <span className="sm:hidden">🏺 प्रामाणिक शिल्प</span>
                  </Badge>
                </div>
                
                <div className="text-center sm:text-left">
                  <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                    <span className="text-henna block">भारतीय</span>
                    <span className="text-terracotta block mt-2">हस्तकला</span>
                    <span className="text-saffron block mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif italic">Heritage Collection</span>
                  </h1>
                </div>
                
                <div className="text-center sm:text-left">
                  <p className="text-base sm:text-lg lg:text-xl text-henna leading-relaxed max-w-lg mx-auto sm:mx-0 font-serif">
                    सदियों पुरानी परंपराओं का खजाना। प्रत्येक वस्तु में भारत की समृद्ध सांस्कृतिक विरासत की कहानी है।
                  </p>
                  <p className="text-sm sm:text-base lg:text-lg text-copper/80 leading-relaxed max-w-lg mx-auto sm:mx-0 mt-3">
                    {heroDescription}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 pt-4">
                <Link href="/products" className="w-full sm:w-auto">
                  <Button className="bg-white hover:bg-gray-50 text-golden px-8 py-4 text-base font-serif font-semibold w-full sm:w-auto traditional-shadow hover:scale-105 transition-all duration-300 craft-border border-0">
                    <span className="text-golden drop-shadow-lg">संग्रह देखें • {heroButtonText}</span>
                    <ArrowRight className="ml-2 h-4 w-4 text-golden drop-shadow-lg" />
                  </Button>
                </Link>
                <Button variant="outline" className="border-white/50 text-white hover:bg-white/20 backdrop-blur-sm px-6 py-3 text-sm font-medium w-full sm:w-auto transition-all duration-300 bg-white/10">
                  <Heart className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">{heroButtonSecondaryText}</span>
                  <span className="sm:hidden">Our Story</span>
                </Button>
              </div>
              
              
            </div>
            
            {/* Enhanced Right Visual - Hidden on mobile, visible on desktop */}
            <div className="relative mt-6 lg:mt-0 order-first lg:order-last hidden lg:block">
              
              
              {/* Floating Cards - Hidden on mobile for cleaner look */}
              
              
              
            </div>
          </div>
        </div>
      </section>

      

      {/* Categories Section - Enhanced Indian Style */}
      <section className="py-8 sm:py-16 lg:py-20 bg-gradient-to-b from-warm-cream via-sandalwood/20 to-soft-beige ethnic-pattern">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <Badge className="bg-terracotta/20 text-henna border-terracotta/30 px-4 py-2 mb-6 text-sm font-serif traditional-shadow">
              🎨 पारंपरिक संग्रह • Traditional Collections
            </Badge>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-henna mb-6">
              हमारी <span className="text-terracotta">विरासत</span> <span className="text-saffron">देखें</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-copper/80 max-w-4xl mx-auto leading-relaxed px-4 font-serif">
              भारत के विविध सांस्कृतिक परिदृश्य की प्रत्येक परंपरा और क्षेत्र का प्रतिनिधित्व करने वाले हमारे सावधानीपूर्वक तैयार किए गए संग्रहों में गोता लगाएं
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <Link key={category.id} href={`/products?category=${category.slug}`}>
                <Card className="group cursor-pointer h-full overflow-hidden craft-border traditional-shadow hover:scale-105 transition-all duration-300">
                  <div className="relative overflow-hidden">
                    <img
                      src={category.thumbnail || fallbackCategoryImages[category.slug as keyof typeof fallbackCategoryImages] || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"}
                      alt={`${category.name} Collection`}
                      className="w-full h-24 sm:h-40 lg:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-henna/80 via-terracotta/30 to-transparent" />
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                      <Badge className="bg-saffron/90 text-white border-none backdrop-blur-sm text-xs font-serif">
                        {index === 0 ? '🏆 लोकप्रिय' : index === 1 ? '⭐ ट्रेंडिंग' : index === 2 ? '💎 प्रीमियम' : '🎨 क्लासिक'}
                      </Badge>
                    </div>
                    <div className="absolute bottom-1 sm:bottom-4 left-1 sm:left-4 text-white">
                      <h3 className="font-display text-xs sm:text-lg lg:text-xl font-bold mb-0.5 sm:mb-1 group-hover:text-turmeric transition-colors duration-300">
                        {category.name}
                      </h3>
                      <p className="text-xs opacity-90 leading-relaxed line-clamp-2 hidden sm:block font-serif">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <CardContent className="p-2 sm:p-4 bg-gradient-to-br from-warm-cream to-soft-beige paisley-pattern">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-medium text-henna">
                        खोजें • Explore
                      </span>
                      <ArrowRight className="h-3 w-3 text-terracotta group-hover:translate-x-1 group-hover:text-saffron transition-all duration-300" />
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
                      src={artisanImage}
                      alt="Artisan at work"
                      className="w-full h-32 sm:h-48 object-cover rounded-lg sm:rounded-xl shadow-lg"
                    />
                    <img
                      src={traditionalToolsImage}
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
                      src={craftWorkshopImage}
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
              <h4 className="font-display text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Lacquer craft</h4>
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
            <p className="text-xs sm:text-sm">&copy; 2024 Lacquer craft. All rights reserved. Preserving tradition, embracing modernity.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
