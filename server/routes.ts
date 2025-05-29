import type { Express } from "express";
import { createServer, type Server } from "http";
import { join } from "path";
import fs from "fs";
import express from "express";
import multer from "multer";
import { storage } from "./storage";
import { insertProductSchema, insertOrderSchema, insertCartItemSchema, insertCategorySchema, insertSettingSchema } from "@shared/schema";
import { registerSchema, loginSchema } from "@shared/auth-schema";
import { z } from "zod";
import bcrypt from 'bcrypt';

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure multer for image uploads with organized directory structure
  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        // Determine upload type based on request path or referrer
        let uploadType = 'products'; // default
        if (req.headers.referer && req.headers.referer.includes('/admin') && req.headers.referer.includes('categories')) {
          uploadType = 'categories';
        }

        const uploadPath = join(process.cwd(), 'data', 'images', uploadType, `${year}`, `${month}`, `${day}`);

        try {
          fs.mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        } catch (error) {
          cb(error as any, '');
        }
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = file.originalname.split('.').pop();
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, `${sanitizedName.split('.')[0]}_${uniqueSuffix}.${extension}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files (JPEG, PNG, WebP, GIF) are allowed') as any, false);
      }
    },
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB limit
    }
  });

  // Serve static images
  app.use('/images', express.static(join(process.cwd(), 'data', 'images')));

  // Authentication middleware
  const requireAuth = async (req: any, res: any, next: any) => {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    if (!sessionId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await storage.getSessionUser(sessionId);
    if (!user) {
      return res.status(401).json({ message: "Invalid session" });
    }

    req.user = user;
    req.sessionId = sessionId;
    next();
  };

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(validatedData.password, saltRounds);
      
      const user = await storage.createUser({
        name: validatedData.name,
        email: validatedData.email,
        passwordHash,
      });

      // Create session
      const sessionId = await storage.createSession(user.id);

      res.status(201).json({
        user: { id: user.id, name: user.name, email: user.email },
        sessionId,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(400).json({ message: error.message || "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const user = await storage.verifyPassword(validatedData.email, validatedData.password);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const sessionId = await storage.createSession(user.id);

      res.json({
        user: { id: user.id, name: user.name, email: user.email },
        sessionId,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(401).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      const sessionId = req.headers.authorization?.replace('Bearer ', '');
      if (sessionId) {
        await storage.deleteSession(sessionId);
      }
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: "Logout failed" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      const sessionId = req.headers.authorization?.replace('Bearer ', '');
      if (!sessionId) {
        return res.status(401).json({ message: "No session" });
      }

      const user = await storage.getSessionUser(sessionId);
      if (!user) {
        return res.status(401).json({ message: "Invalid session" });
      }

      res.json({ id: user.id, name: user.name, email: user.email });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user info" });
    }
  });

  // Category image upload endpoint
  app.post("/api/upload-category-image", multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const uploadPath = join(process.cwd(), 'data', 'images', 'categories', `${year}`, `${month}`, `${day}`);

        import('fs').then(fs => {
          fs.mkdirSync(uploadPath, { recursive: true });
        });

        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = file.originalname.split('.').pop();
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, `${sanitizedName.split('.')[0]}_${uniqueSuffix}.${extension}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files (JPEG, PNG, WebP, GIF) are allowed'), false);
      }
    },
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB limit
    }
  }).single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded" });
      }

      // Get relative path from data/images
      const relativePath = req.file.path.split('data/images/')[1];
      const imageUrl = `/images/${relativePath}`;

      res.json({ 
        imageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    } catch (error) {
      console.error('Category image upload error:', error);
      res.status(500).json({ message: "Failed to upload category image" });
    }
  });

  // Homepage hero banner image upload endpoint
  app.post("/api/upload-homepage-image", multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const uploadPath = join(process.cwd(), 'data', 'images', 'homepage', 'hero', `${year}`, `${month}`, `${day}`);

        try {
          fs.mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        } catch (error) {
          cb(error as any, '');
        }
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = file.originalname.split('.').pop();
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, `hero_banner_${sanitizedName.split('.')[0]}_${uniqueSuffix}.${extension}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files (JPEG, PNG, WebP, GIF) are allowed'), false);
      }
    },
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB limit
    }
  }).single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No hero banner image file uploaded" });
      }

      // Get relative path from data/images
      const relativePath = req.file.path.split('data/images/')[1];
      const imageUrl = `/images/${relativePath}`;

      res.json({ 
        imageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    } catch (error) {
      console.error('Homepage hero banner image upload error:', error);
      res.status(500).json({ message: "Failed to upload hero banner image" });
    }
  });

  // Product image upload endpoint
  app.post("/api/upload-image", upload.single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded" });
      }

      // Get relative path from data/images
      const relativePath = req.file.path.split('data/images/')[1];
      const imageUrl = `/images/${relativePath}`;

      res.json({ 
        imageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    } catch (error) {
      console.error('Image upload error:', error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  // Delete image endpoint
  app.delete("/api/delete-image", (req, res) => {
    try {
      const { imageUrl } = req.body;

      if (!imageUrl) {
        return res.status(400).json({ message: "Image URL is required" });
      }

      // Convert URL to file path
      const imagePath = imageUrl.replace('/images/', '');
      const fullPath = join(process.cwd(), 'data', 'images', imagePath);

      // Delete the file
      import('fs').then(fs => {
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.error('Error deleting image:', err);
            return res.status(500).json({ message: "Failed to delete image file" });
          }
          res.json({ message: "Image deleted successfully" });
        });
      }).catch(error => {
        console.error('Error importing fs:', error);
        res.status(500).json({ message: "Failed to delete image" });
      });
    } catch (error) {
      console.error('Image deletion error:', error);
      res.status(500).json({ message: "Failed to delete image" });
    }
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.put("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, validatedData);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCategory(id);
      if (!deleted) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json({ message: "Category deleted successfully" });
    } catch (error: any) {
      if (error.message && error.message.includes("Cannot delete category")) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { category, search, featured } = req.query;
      let products;

      if (search) {
        products = await storage.searchProducts(search as string);
      } else if (featured === "true") {
        products = await storage.getFeaturedProducts();
      } else if (category) {
        const categoryRecord = await storage.getCategoryBySlug(category as string);
        if (categoryRecord) {
          products = await storage.getProducts(categoryRecord.id);
        } else {
          products = await storage.getProducts();
        }
      } else {
        products = await storage.getProducts();
      }

      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products-with-category", async (req, res) => {
    try {
      const products = await storage.getProductsWithCategory();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products with categories" });
    }
  });

  // Get single product with category
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProductWithCategory(id);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Get recommended products for a specific product
  app.get("/api/products/:id/recommendations", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const allProducts = await storage.getProducts();
      const otherProducts = allProducts.filter(p => p.id !== id);

      // Score products based on similarity
      const scoredProducts = otherProducts.map(p => {
        let score = 0;
        
        // Same category gets highest score
        if (p.categoryId === product.categoryId) {
          score += 50;
        }
        
        // Calculate feature similarity
        const productFeatures = product.features || [];
        const otherFeatures = p.features || [];
        
        if (productFeatures.length > 0 && otherFeatures.length > 0) {
          const commonFeatures = productFeatures.filter(feature => 
            otherFeatures.some(otherFeature => 
              otherFeature.toLowerCase().includes(feature.toLowerCase()) ||
              feature.toLowerCase().includes(otherFeature.toLowerCase())
            )
          );
          score += (commonFeatures.length / Math.max(productFeatures.length, otherFeatures.length)) * 30;
        }
        
        // Similar price range (within 20% gets points)
        const productPrice = parseFloat(product.price);
        const otherPrice = parseFloat(p.price);
        const priceDiff = Math.abs(productPrice - otherPrice) / productPrice;
        if (priceDiff <= 0.2) {
          score += 10;
        } else if (priceDiff <= 0.5) {
          score += 5;
        }
        
        // Featured products get slight boost
        if (p.featured) {
          score += 5;
        }
        
        // In stock products get slight boost
        if (p.stock > 0) {
          score += 3;
        }

        return { ...p, similarityScore: score };
      });

      // Sort by similarity score and return top 8
      const recommendations = scoredProducts
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, 8)
        .map(({ similarityScore, ...product }) => product); // Remove score from final result

      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Cart
  app.get("/api/cart/:sessionId", async (req, res) => {
    try {
      const cartItems = await storage.getCartItems(req.params.sessionId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(validatedData);
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  app.put("/api/cart/:sessionId/:productId", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const productId = parseInt(req.params.productId);
      const { quantity } = req.body;

      if (typeof quantity !== "number" || quantity < 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      const cartItem = await storage.updateCartItem(sessionId, productId, quantity);
      res.json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:sessionId/:productId", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const productId = parseInt(req.params.productId);
      const removed = await storage.removeFromCart(sessionId, productId);
      if (!removed) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });

  app.delete("/api/cart/:sessionId", async (req, res) => {
    try {
      await storage.clearCart(req.params.sessionId);
      res.json({ message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Orders
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", requireAuth, async (req: any, res) => {
    try {
      // Add userId to the request body before validation
      const orderData = {
        ...req.body,
        userId: req.user.id,
      };
      
      console.log("Order data received:", orderData);
      
      const validatedData = insertOrderSchema.parse(orderData);
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Order validation errors:", error.errors);
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      console.error("Order creation error:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const order = await storage.updateOrderStatus(id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Track order by tracking number
  app.get("/api/track/:trackingNumber", async (req, res) => {
    try {
      const trackingNumber = req.params.trackingNumber.toUpperCase();
      const order = await storage.getOrderByTrackingNumber(trackingNumber);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found with this tracking number" });
      }

      // Return order tracking info (without sensitive customer details for public tracking)
      const trackingInfo = {
        id: order.id,
        trackingNumber: order.trackingNumber,
        status: order.status,
        createdAt: order.createdAt,
        customerName: order.customerName.split(' ')[0], // Only first name for privacy
        total: order.total
      };

      res.json(trackingInfo);
    } catch (error) {
      res.status(500).json({ message: "Failed to track order" });
    }
  });

  // Settings endpoints
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.get("/api/settings/:key", async (req, res) => {
    try {
      const setting = await storage.getSetting(req.params.key);
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      res.json(setting);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch setting" });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const validatedData = insertSettingSchema.parse(req.body);
      const setting = await storage.createSetting(validatedData);
      res.status(201).json(setting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid setting data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create setting" });
    }
  });

  app.put("/api/settings/:key", async (req, res) => {
    try {
      const { value } = req.body;
      if (typeof value !== "string") {
        return res.status(400).json({ message: "Value must be a string" });
      }
      
      const setting = await storage.updateSetting(req.params.key, value);
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      res.json(setting);
    } catch (error) {
      res.status(500).json({ message: "Failed to update setting" });
    }
  });

  app.delete("/api/settings/:key", async (req, res) => {
    try {
      const deleted = await storage.deleteSetting(req.params.key);
      if (!deleted) {
        return res.status(404).json({ message: "Setting not found" });
      }
      res.json({ message: "Setting deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete setting" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}