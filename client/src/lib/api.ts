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

export async function getProduct(id: number): Promise<ProductWithCategory> {
  const response = await fetch(`/api/products/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  return response.json();
}

export async function getRecommendedProducts(productId: number): Promise<Product[]> {
  const response = await fetch(`/api/products/${productId}/recommendations`);
  if (!response.ok) {
    throw new Error("Failed to fetch recommended products");
  }
  return response.json();
}

export const createProduct = async (product: InsertProduct): Promise<Product> => {
  const res = await apiRequest("POST", "/api/products", product);
  return res.json();
};

export async function updateProduct(id: number, data: Partial<InsertProduct>) {
  const response = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update product: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteImage(imageUrl: string) {
  const response = await fetch("/api/delete-image", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageUrl }),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete image: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteProduct(id: number): Promise<void> {
  const response = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete product");
  }
}

export async function uploadImage(file: File): Promise<{ imageUrl: string }> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/upload-image', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  return response.json();
}

export async function uploadCategoryImage(file: File): Promise<{ imageUrl: string }> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/upload-category-image', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload category image');
  }

  return response.json();
}

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

export async function updateOrderStatus(id: number, status: string) {
  const response = await fetch(`/api/orders/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update order status");
  }

  return response.json();
}

// Settings API functions
export async function getSettings() {
  const response = await fetch("/api/settings");
  if (!response.ok) {
    throw new Error("Failed to fetch settings");
  }
  return response.json();
}

export async function getSetting(key: string) {
  const response = await fetch(`/api/settings/${key}`);
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch setting");
  }
  return response.json();
}

export async function createSetting(settingData: any) {
  const response = await fetch("/api/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settingData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create setting");
  }

  return response.json();
}

export async function updateSetting(key: string, value: string) {
  const response = await fetch(`/api/settings/${key}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update setting");
  }

  return response.json();
}