import { pgTable, text, serial, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  thumbnail: text("thumbnail"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  categoryId: integer("category_id").notNull(),
  stock: integer("stock").notNull().default(0),
  images: text("images").array().notNull().default([]),
  sku: text("sku").notNull().unique(),
  featured: boolean("featured").notNull().default(false),
  features: text("features").array().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  shippingAddress: text("shipping_address").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, shipped, delivered, cancelled
  trackingNumber: text("tracking_number").notNull().unique(),
  items: text("items").notNull(), // JSON stringified array of order items
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  trackingNumber: true,
  createdAt: true,
}).extend({
  userId: z.number().min(1, "User ID is required"),
});

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type Order = typeof orders.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

// Additional types for frontend
export type ProductWithCategory = Product & { category: Category };
export type CartItemWithProduct = CartItem & {
  product: Product;
};

// Settings schema for homepage customization
export const insertSettingSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string(),
  type: z.enum(["text", "image", "boolean"]).default("text"),
  description: z.string().optional(),
});

export const settingSchema = z.object({
  id: z.number(),
  key: z.string(),
  value: z.string(),
  type: z.string(),
  description: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type Setting = z.infer<typeof settingSchema>;

export interface WishlistItem {
  id: number;
  userId: number;
  productId: number;
  addedAt: string;
}
`