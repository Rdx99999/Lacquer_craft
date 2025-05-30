
import { Link } from "wouter";
import { Linkedin, Twitter, Heart } from "lucide-react";
import logoImage from "@assets/SNEHA LOGO 1.png";

export function Footer() {
  return (
    <footer className="bg-henna text-warm-cream mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-heritage-gradient rounded-lg flex items-center justify-center traditional-shadow overflow-hidden">
                <img 
                  src={logoImage} 
                  alt="Hastkala Logo" 
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">Lacquer craft</h3>
                <p className="text-sm font-serif italic">Heritage Crafts</p>
              </div>
            </div>
            <p className="text-sm mb-4 max-w-md">
              Discover authentic handcrafted treasures that celebrate India's rich cultural heritage. 
              Each piece tells a story of traditional artistry and timeless craftsmanship.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/in/shubham-undefined-11951a355/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-saffron transition-colors"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://x.com/Shubham96452131" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-saffron transition-colors"
                aria-label="Follow us on X (Twitter)"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-saffron transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-saffron transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=pottery" className="hover:text-saffron transition-colors">
                  Pottery
                </Link>
              </li>
              <li>
                <Link href="/products?category=textiles" className="hover:text-saffron transition-colors">
                  Textiles
                </Link>
              </li>
              <li>
                <Link href="/products?category=jewelry" className="hover:text-saffron transition-colors">
                  Jewelry
                </Link>
              </li>
              <li>
                <Link href="/products?category=woodwork" className="hover:text-saffron transition-colors">
                  Woodwork
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/track" className="hover:text-saffron transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-saffron transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-saffron transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-saffron transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-warm-cream/20 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p className="mb-2 sm:mb-0">
            © 2024 Lacquer craft. All rights reserved.
          </p>
          <p className="flex items-center">
            Made with <Heart className="h-4 w-4 mx-1 text-red-400" fill="currentColor" /> for artisans
          </p>
        </div>
      </div>
    </footer>
  );
}
