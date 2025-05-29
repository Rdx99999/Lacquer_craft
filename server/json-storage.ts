import { promises as fs } from 'fs';
import { join } from 'path';
import type { 
  Category, 
  Product, 
  CartItem, 
  Order, 
  InsertCategory, 
  InsertProduct, 
  InsertCartItem, 
  InsertOrder,
  ProductWithCategory,
  CartItemWithProduct
} from "@shared/schema";
import { IStorage } from './storage';

interface DatabaseData {
  categories: Category[];
  products: Product[];
  cartItems: CartItem[];
  orders: Order[];
  counters: {
    categoryId: number;
    productId: number;
    cartItemId: number;
    orderId: number;
  };
}

export class JsonStorage implements IStorage {
  private readonly dataDir = './data';
  private readonly dbFile = join(this.dataDir, 'database.json');
  private data: DatabaseData;

  constructor() {
    this.data = {
      categories: [],
      products: [],
      cartItems: [],
      orders: [],
      counters: {
        categoryId: 1,
        productId: 1,
        cartItemId: 1,
        orderId: 1
      }
    };
    this.ensureDataDirectory();
    this.loadData();
  }

  private async ensureDataDirectory() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      await fs.mkdir(join(this.dataDir, 'images'), { recursive: true });
    } catch (error) {
      console.error('Error creating data directory:', error);
    }
  }

  private async loadData() {
    try {
      const fileExists = await fs.access(this.dbFile).then(() => true).catch(() => false);

      if (fileExists) {
        const fileContent = await fs.readFile(this.dbFile, 'utf-8');
        this.data = JSON.parse(fileContent);
      } else {
        // Initialize with sample data
        await this.initializeData();
        await this.saveData();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      await this.initializeData();
    }
  }

  private async saveData() {
    try {
      await fs.writeFile(this.dbFile, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  private async initializeData() {
    const sampleCategories = [
      { name: "Pottery", slug: "pottery", description: "Traditional ceramic arts and pottery items" },
      { name: "Textiles", slug: "textiles", description: "Handwoven fabrics and textile crafts" },
      { name: "Jewelry", slug: "jewelry", description: "Traditional and contemporary handmade jewelry" },
      { name: "Woodwork", slug: "woodwork", description: "Carved wooden crafts and furniture" },
      { name: "Metalwork", slug: "metalwork", description: "Brass, copper and other metal crafts" },
    ];

    const sampleProducts = [
      {
        name: "Traditional Ceramic Vase",
        description: "Handcrafted ceramic vase with traditional Indian motifs. Perfect for home decoration.",
        price: "2999",
        categoryId: 1,
        sku: "POT001",
        featured: true,
        stock: 15,
        images: ["/images/ceramic-vase-1.svg"],
        createdAt: new Date()
      },
      {
        name: "Handwoven Silk Scarf",
        description: "Beautiful silk scarf with intricate handwoven patterns. Made by skilled artisans.",
        price: "1899",
        categoryId: 2,
        sku: "TEX001",
        featured: true,
        stock: 25,
        images: ["/images/silk-scarf-1.svg"],
        createdAt: new Date()
      },
      {
        name: "Silver Filigree Earrings",
        description: "Exquisite silver filigree earrings showcasing traditional craftsmanship.",
        price: "3499",
        categoryId: 3,
        sku: "JEW001",
        featured: false,
        stock: 12,
        images: ["/images/silver-earrings-1.svg"],
        createdAt: new Date()
      },
      {
        name: "Carved Wooden Box",
        description: "Intricately carved wooden jewelry box with traditional designs.",
        price: "1599",
        categoryId: 4,
        sku: "WOD001",
        featured: false,
        stock: 8,
        images: ["/images/wooden-box-1.jpg", "/images/wooden-box-2.jpg"],
        createdAt: new Date()
      },
      {
        name: "Embroidered Cushion Cover",
        description: "Hand-embroidered cushion cover with vibrant colors and traditional patterns.",
        price: "899",
        categoryId: 2,
        sku: "TEX002",
        featured: true,
        stock: 30,
        images: ["/images/cushion-cover-1.jpg"],
        createdAt: new Date()
      },
      {
        name: "Brass Decorative Plate",
        description: "Ornate brass plate with etched designs, perfect for wall decoration.",
        price: "2199",
        categoryId: 5,
        sku: "MET001",
        featured: false,
        stock: 10,
        images: ["/images/brass-plate-1.jpg", "/images/brass-plate-2.jpg"],
        createdAt: new Date()
      }
    ];

    // Add categories
    for (const cat of sampleCategories) {
      const category: Category = { ...cat, id: this.data.counters.categoryId++ };
      this.data.categories.push(category);
    }

    // Add products
    for (const prod of sampleProducts) {
      const product: Product = { 
        ...prod, 
        id: this.data.counters.productId++
      };
      this.data.products.push(product);
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return [...this.data.categories];
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return this.data.categories.find(cat => cat.slug === slug);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const newCategory: Category = { 
      ...category, 
      id: this.data.counters.categoryId++,
      description: category.description || null
    };
    this.data.categories.push(newCategory);
    await this.saveData();
    return newCategory;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const index = this.data.categories.findIndex(cat => cat.id === id);
    if (index === -1) return undefined;

    const updated: Category = { 
      ...this.data.categories[index], 
      ...category,
      description: category.description !== undefined ? category.description : this.data.categories[index].description
    };
    this.data.categories[index] = updated;
    await this.saveData();
    return updated;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const index = this.data.categories.findIndex(cat => cat.id === id);
    if (index === -1) return false;

    this.data.categories.splice(index, 1);
    await this.saveData();
    return true;
  }

  // Products
  async getProducts(categoryId?: number): Promise<Product[]> {
    if (categoryId) {
      return this.data.products.filter(product => product.categoryId === categoryId);
    }
    return [...this.data.products];
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return this.data.products.filter(product => product.featured);
  }

  async getProductsWithCategory(): Promise<ProductWithCategory[]> {
    return this.data.products.map(product => {
      const category = this.data.categories.find(cat => cat.id === product.categoryId);
      return {
        ...product,
        category: category!
      };
    });
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.data.products.find(product => product.id === id);
  }

  async getProductWithCategory(id: number): Promise<ProductWithCategory | undefined> {
    const product = this.data.products.find(p => p.id === id);
    if (!product) return undefined;

    const category = this.data.categories.find(cat => cat.id === product.categoryId);
    return {
      ...product,
      category: category!
    };
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return this.data.products.filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct: Product = { 
      ...product, 
      id: this.data.counters.productId++,
      stock: product.stock || 0,
      images: product.images || [],
      featured: product.featured || false,
      createdAt: new Date(),
      features: product.features || []
    };
    this.data.products.push(newProduct);
    await this.saveData();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return undefined;

    const updated: Product = { 
      ...this.data.products[index], 
      ...product,
      features: product.features !== undefined ? product.features : this.data.products[index].features
    };
    this.data.products[index] = updated;
    await this.saveData();
    return updated;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.data.products.splice(index, 1);
    await this.saveData();
    return true;
  }

  // Cart
  async getCartItems(sessionId: string): Promise<CartItemWithProduct[]> {
    const cartItems = this.data.cartItems.filter(item => item.sessionId === sessionId);
    return cartItems.map(item => {
      const product = this.data.products.find(p => p.id === item.productId);
      return {
        ...item,
        product: product!
      };
    });
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    const existingIndex = this.data.cartItems.findIndex(
      item => item.sessionId === cartItem.sessionId && item.productId === cartItem.productId
    );

    if (existingIndex !== -1) {
      // Update existing item
      const existing = this.data.cartItems[existingIndex];
      existing.quantity += cartItem.quantity || 1;
      await this.saveData();
      return existing;
    } else {
      // Create new item
      const newItem: CartItem = {
        id: this.data.counters.cartItemId++,
        ...cartItem,
        quantity: cartItem.quantity || 1,
        createdAt: new Date()
      };
      this.data.cartItems.push(newItem);
      await this.saveData();
      return newItem;
    }
  }

  async updateCartItem(sessionId: string, productId: number, quantity: number): Promise<CartItem | undefined> {
    const index = this.data.cartItems.findIndex(
      item => item.sessionId === sessionId && item.productId === productId
    );
    if (index === -1) return undefined;

    this.data.cartItems[index].quantity = quantity;
    await this.saveData();
    return this.data.cartItems[index];
  }

  async removeFromCart(sessionId: string, productId: number): Promise<boolean> {
    const index = this.data.cartItems.findIndex(
      item => item.sessionId === sessionId && item.productId === productId
    );
    if (index === -1) return false;

    this.data.cartItems.splice(index, 1);
    await this.saveData();
    return true;
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const initialLength = this.data.cartItems.length;
    this.data.cartItems = this.data.cartItems.filter(item => item.sessionId !== sessionId);

    if (this.data.cartItems.length !== initialLength) {
      await this.saveData();
      return true;
    }
    return false;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return [...this.data.orders];
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.data.orders.find(order => order.id === id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const newOrder: Order = {
      id: this.data.counters.orderId++,
      ...order,
      status: order.status || "pending",
      customerPhone: order.customerPhone || null,
      createdAt: new Date()
    };
    this.data.orders.push(newOrder);
    await this.saveData();
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const index = this.data.orders.findIndex(order => order.id === id);
    if (index === -1) return undefined;

    const updated: Order = { ...this.data.orders[index], status };
    this.data.orders[index] = updated;
    await this.saveData();
    return updated;
  }
}