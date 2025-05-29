import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/product-card";
import { getProducts, getCategories } from "@/lib/api";

export default function Home() {
  const { data: featuredProducts = [] } = useQuery({
    queryKey: ["/api/products", { featured: true }],
    queryFn: () => getProducts({ featured: true }),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: getCategories,
  });

  const categoryImages = {
    pottery: "https://pixabay.com/get/gb570087a032ff2f3d571d2c0ea66b8c0c1922cc79890f4e40b065b584a8583a3764759c6653e0465c9a4aa8d5483d8363957d0cf25a46d507171428ac91144ee_1280.jpg",
    textiles: "https://pixabay.com/get/g0c2883f32546fb1194e48ed2f9534dc76209e24104a2c2aaaee63cf584261f94432f323f9597e3aeae98ef54273a39acd39e829f6b2773296e831d0cd6eb2ecc_1280.jpg",
    jewelry: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    woodwork: "https://images.unsplash.com/photo-1587813369290-091c9d432daf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-terracotta to-saffron text-white py-20">
        <div 
          className="absolute inset-0 bg-black bg-opacity-40"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-5xl font-bold mb-6">
              Discover Authentic Indian Craftsmanship
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Each piece tells a story of tradition, skill, and cultural heritage passed down through generations
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-white text-terracotta hover:bg-gray-100">
                Explore Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="font-display text-3xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our curated collection of authentic Indian handicrafts, each category representing centuries of artistic tradition
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.slug}`}>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-xl shadow-lg">
                    <img
                      src={categoryImages[category.slug as keyof typeof categoryImages]}
                      alt={`${category.name} Collection`}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-display text-xl font-semibold">{category.name}</h4>
                      <p className="text-sm opacity-90">{category.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-soft-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="font-display text-3xl font-bold text-gray-900 mb-4">
              Featured Crafts
            </h3>
            <p className="text-gray-600">
              Handpicked treasures from our master artisans
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" className="bg-terracotta hover:bg-terracotta/90">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="font-display text-3xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h3>
            <p className="text-gray-600">
              Authentic experiences from our valued customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex text-saffron">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-terracotta rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.name[0]}
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-gray-600 text-sm">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-display text-xl font-semibold mb-4">Hastkala</h4>
              <p className="text-gray-300 mb-4">
                Preserving Indian craftsmanship traditions through authentic handmade products.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Categories</h5>
              <ul className="space-y-2 text-gray-300">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link href={`/products?category=${category.slug}`} className="hover:text-white">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Customer Service</h5>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Newsletter</h5>
              <p className="text-gray-300 mb-4">
                Subscribe for updates on new crafts and artisan stories.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-terracotta"
                />
                <Button className="bg-terracotta px-4 py-2 rounded-r-lg hover:bg-terracotta/90">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Hastkala. All rights reserved. Preserving tradition, embracing modernity.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
