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
  CartItemWithProduct,
  Setting,
  InsertSetting
} from "@shared/schema";
import { IStorage } from './storage';

interface DatabaseData {
  categories: Category[];
  products: Product[];
  cartItems: CartItem[];
  orders: Order[];
  settings: Setting[];
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
      settings: [],
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
      { name: "Pottery", slug: "pottery", description: "Traditional ceramic arts and pottery items", thumbnail: null },
      { name: "Textiles", slug: "textiles", description: "Handwoven fabrics and textile crafts", thumbnail: null },
      { name: "Jewelry", slug: "jewelry", description: "Traditional and contemporary handmade jewelry", thumbnail: null },
      { name: "Woodwork", slug: "woodwork", description: "Carved wooden crafts and furniture", thumbnail: null },
      { name: "Metalwork", slug: "metalwork", description: "Brass, copper and other metal crafts", thumbnail: null },
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
        features: ["Handcrafted", "Traditional motifs", "Home decoration"],
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
        features: ["Handwoven", "Silk material", "Intricate patterns"],
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
        features: ["Silver filigree", "Traditional craftsmanship", "Lightweight"],
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
        features: ["Hand-carved", "Traditional designs", "Jewelry storage"],
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
        features: ["Hand-embroidered", "Vibrant colors", "Traditional patterns"],
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
        features: ["Brass material", "Etched designs", "Wall decoration"],
        createdAt: new Date()
      }
    ];

    // Add categories
    for (const cat of sampleCategories) {
      const category: Category = { 
        ...cat, 
        id: this.data.counters.categoryId++,
        thumbnail: cat.thumbnail || null
      };
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
      description: category.description || null,
      thumbnail: category.thumbnail || null
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

    // Check if any products are using this category
    const productsUsingCategory = this.data.products.filter(product => product.categoryId === id);
    if (productsUsingCategory.length > 0) {
      throw new Error(`Cannot delete category. ${productsUsingCategory.length} product(s) are still using this category.`);
    }

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
    return this.data.products
      .map(product => {
        const category = this.data.categories.find(cat => cat.id === product.categoryId);
        if (!category) {
          // Return null for products with missing categories so we can filter them out
          return null;
        }
        return {
          ...product,
          category
        };
      })
      .filter((product): product is ProductWithCategory => product !== null);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.data.products.find(product => product.id === id);
  }

  async getProductWithCategory(id: number): Promise<ProductWithCategory | undefined> {
    const product = this.data.products.find(p => p.id === id);
    if (!product) return undefined;

    const category = this.data.categories.find(cat => cat.id === product.categoryId);
    if (!category) return undefined; // Don't return product if category is missing

    return {
      ...product,
      category
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

  // Settings
  async getSettings(): Promise<Setting[]> {
    if (!this.data.settings) {
      this.data.settings = [];
    }
    return this.data.settings;
  }

  async getSetting(key: string): Promise<Setting | undefined> {
    const settings = await this.getSettings();
    return settings.find(s => s.key === key) || null;
  }

  async createSetting(setting: InsertSetting): Promise<Setting> {
    if (!this.data.settings) {
      this.data.settings = [];
    }

    const existingSetting = this.data.settings.find(s => s.key === setting.key);
    if (existingSetting) {
      throw new Error(`Setting with key '${setting.key}' already exists`);
    }

    const newSetting: Setting = {
      id: this.data.counters.orderId++,
      ...setting,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.settings.push(newSetting);
    await this.saveData();
    return newSetting;
  }

  async updateSetting(key: string, value: string): Promise<Setting | undefined> {
    if (!this.data.settings) {
      this.data.settings = [];
    }

    const index = this.data.settings.findIndex(setting => setting.key === key);
    if (index === -1) return undefined;

    const updated: Setting = { ...this.data.settings[index], value: value, updatedAt: new Date().toISOString() };
    this.data.settings[index] = updated;
    await this.saveData();
    return updated;
  }

  async deleteSetting(key: string): Promise<boolean> {
    if (!this.data.settings) {
      return false;
    }

    const initialLength = this.data.settings.length;
    this.data.settings = this.data.settings.filter(setting => setting.key !== key);

    if (this.data.settings.length < initialLength) {
      await this.saveData();
      return true;
    }
    return false;
  }

  private getNextId(table: 'products' | 'categories' | 'cartItems' | 'orders' | 'settings'): number {
    if (table === 'products') {
      return this.data.counters.productId++;
    } else if (table === 'categories') {
      return this.data.counters.categoryId++;
    } else if (table === 'cartItems') {
      return this.data.counters.cartItemId++;
    } else if (table === 'orders') {
      return this.data.counters.orderId++;
    } else if (table === 'settings') {
        return this.data.counters.orderId++; //Using orderId as settings id.
    }
    throw new Error(`Invalid table name: ${table}`);
  }
}