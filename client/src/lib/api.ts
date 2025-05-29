import { apiRequest } from "./queryClient";
import type { 
  Product, 
  Category, 
  CartItem, 
  Order, 
  InsertProduct, 
  InsertCartItem, 
  InsertOrder,
  InsertCategory,
  ProductWithCategory,
  CartItemWithProduct 
} from "@shared/schema";

// Categories
export const getCategories = async (): Promise<Category[]> => {
  const res = await fetch("/api/categories");
  return res.json();
};

export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  const res = await fetch(`/api/categories/${slug}`);
  return res.json();
};

export const createCategory = async (category: InsertCategory): Promise<Category> => {
  const res = await apiRequest("POST", "/api/categories", category);
  return res.json();
};

export const updateCategory = async (id: number, category: Partial<InsertCategory>): Promise<Category> => {
  const res = await apiRequest("PUT", `/api/categories/${id}`, category);
  return res.json();
};

export const deleteCategory = async (id: number): Promise<void> => {
  await apiRequest("DELETE", `/api/categories/${id}`);
};

// Products
export const getProducts = async (params?: {
  category?: string;
  search?: string;
  featured?: boolean;
}): Promise<Product[]> => {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.append("category", params.category);
  if (params?.search) searchParams.append("search", params.search);
  if (params?.featured) searchParams.append("featured", "true");
  
  const res = await fetch(`/api/products?${searchParams}`);
  return res.json();
};

export const getProductsWithCategory = async (): Promise<ProductWithCategory[]> => {
  const res = await fetch("/api/products-with-category");
  return res.json();
};

export const getProduct = async (id: number): Promise<ProductWithCategory> => {
  const res = await fetch(`/api/products/${id}`);
  return res.json();
};

export const createProduct = async (product: InsertProduct): Promise<Product> => {
  const res = await apiRequest("POST", "/api/products", product);
  return res.json();
};

export const updateProduct = async (id: number, product: Partial<InsertProduct>): Promise<Product> => {
  const res = await apiRequest("PUT", `/api/products/${id}`, product);
  return res.json();
};

export const deleteProduct = async (id: number): Promise<void> => {
  await apiRequest("DELETE", `/api/products/${id}`);
};

// Cart
export const getCartItems = async (sessionId: string): Promise<CartItemWithProduct[]> => {
  const res = await fetch(`/api/cart/${sessionId}`);
  return res.json();
};

export const addToCart = async (cartItem: InsertCartItem): Promise<CartItem> => {
  const res = await apiRequest("POST", "/api/cart", cartItem);
  return res.json();
};

export const updateCartItem = async (sessionId: string, productId: number, quantity: number): Promise<CartItem> => {
  const res = await apiRequest("PUT", `/api/cart/${sessionId}/${productId}`, { quantity });
  return res.json();
};

export const removeFromCart = async (sessionId: string, productId: number): Promise<void> => {
  await apiRequest("DELETE", `/api/cart/${sessionId}/${productId}`);
};

export const clearCart = async (sessionId: string): Promise<void> => {
  await apiRequest("DELETE", `/api/cart/${sessionId}`);
};

// Orders
export const getOrders = async (): Promise<Order[]> => {
  const res = await fetch("/api/orders");
  return res.json();
};

export const getOrder = async (id: number): Promise<Order> => {
  const res = await fetch(`/api/orders/${id}`);
  return res.json();
};

export const createOrder = async (order: InsertOrder): Promise<Order> => {
  const res = await apiRequest("POST", "/api/orders", order);
  return res.json();
};

export const updateOrderStatus = async (id: number, status: string): Promise<Order> => {
  const res = await apiRequest("PUT", `/api/orders/${id}/status`, { status });
  return res.json();
};
