import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, Menu, X, Settings, User, LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCartSidebar } from "./shopping-cart";
import { AuthDialog } from "./auth/auth-dialog";

const categories = [
  { name: "Pottery", slug: "pottery" },
  { name: "Textiles", slug: "textiles" },
  { name: "Jewelry", slug: "jewelry" },
  { name: "Woodwork", slug: "woodwork" },
];

export function Navigation() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { itemCount } = useCart();
  const { user, isAuthenticated, login, logout } = useAuth();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <h1 className="font-display text-2xl font-bold text-terracotta">
                Hastkala
              </h1>
              <span className="ml-2 text-sm text-gray-600">Authentic Crafts</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className={`text-gray-700 hover:text-terracotta transition-colors ${location === "/" ? "text-terracotta font-medium" : ""}`}>
                Home
              </Link>

              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-gray-700 hover:text-terracotta transition-colors">
                      Categories
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-48 p-2">
                        {categories.map((category) => (
                          <Link
                            key={category.slug}
                            href={`/products?category=${category.slug}`}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <Link href="/products" className={`text-gray-700 hover:text-terracotta transition-colors ${location === "/products" ? "text-terracotta font-medium" : ""}`}>
                Products
              </Link>

              <Link href="/track" className={`text-gray-700 hover:text-terracotta transition-colors ${location === "/track" ? "text-terracotta font-medium" : ""}`}>
                Track Order
              </Link>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="relative hidden sm:block">
                <Input
                  type="text"
                  placeholder="Search crafts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pr-10"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full px-3"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              {/* Cart */}
              <Button
                variant="ghost"
                size="sm"
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-saffron text-white text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Button>

              {/* Authentication */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Hello, {user?.name}</span>
                  <Link href="/profile">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-terracotta hover:bg-terracotta/10"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-terracotta text-white border-terracotta hover:bg-terracotta/90"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-terracotta text-white border-terracotta hover:bg-terracotta/90"
                  onClick={() => setShowAuthDialog(true)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-4 mt-8">
                    <Link href="/" className="text-lg font-medium">Home</Link>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Categories</h3>
                      <div className="pl-4 space-y-2">
                        {categories.map((category) => (
                          <Link
                            key={category.slug}
                            href={`/products?category=${category.slug}`}
                            className="block text-gray-700 hover:text-terracotta"
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <Link href="/products" className="text-lg font-medium">Products</Link>
                    <Link href="/track" className="text-lg font-medium">Track Order</Link>

                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="relative sm:hidden">
                      <Input
                        type="text"
                        placeholder="Search crafts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pr-10"
                      />
                      <Button
                        type="submit"
                        size="sm"
                        variant="ghost"
                        className="absolute right-0 top-0 h-full px-3"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </form>

                    {/* Mobile Authentication */}
                    {isAuthenticated ? (
                      <div className="pt-4 border-t space-y-2">
                        <p className="text-sm text-gray-600 mb-2">Hello, {user?.name}</p>
                        <Link href="/profile">
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-terracotta hover:bg-terracotta/10"
                          >
                            <User className="h-4 w-4 mr-2" />
                            My Profile
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          className="w-full bg-terracotta text-white border-terracotta hover:bg-terracotta/90"
                          onClick={logout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="pt-4 border-t">
                        <Button 
                          variant="outline" 
                          className="w-full bg-terracotta text-white border-terracotta hover:bg-terracotta/90"
                          onClick={() => setShowAuthDialog(true)}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Login
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <ShoppingCartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onSuccess={(userData, sessionId) => {
          login(userData, sessionId);
          toast({
            title: "Success!",
            description: "You have been logged in successfully.",
          });
        }}
      />
    </>
  );
}