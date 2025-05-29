import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getCategories, createProduct, updateProduct } from "@/lib/api";
import type { Product, InsertProduct } from "@shared/schema";

const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  categoryId: z.number().min(1, "Category is required"),
  stock: z.number().min(0, "Stock must be non-negative"),
  sku: z.string().min(1, "SKU is required"),
  featured: z.boolean().default(false),
  images: z.array(z.string()).default([]),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: getCategories,
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || "",
      categoryId: product?.categoryId || 0,
      stock: product?.stock || 0,
      sku: product?.sku || "",
      featured: product?.featured || false,
      images: product?.images || [],
    },
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products-with-category"] });
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<InsertProduct>) => updateProduct(product!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products-with-category"] });
      toast({
        title: "Success", 
        description: "Product updated successfully",
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update product",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProductFormData) => {
    if (product) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      const currentImages = form.getValues("images");
      form.setValue("images", [...currentImages, data.imageUrl]);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images");
    form.setValue("images", currentImages.filter((_, i) => i !== index));
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {product ? "Edit Product" : "Add New Product"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Enter product name"
              />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                {...form.register("sku")}
                placeholder="Enter SKU"
              />
              {form.formState.errors.sku && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.sku.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Enter product description"
              rows={3}
            />
            {form.formState.errors.description && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...form.register("price")}
                placeholder="0.00"
              />
              {form.formState.errors.price && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.price.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                {...form.register("stock", { valueAsNumber: true })}
                placeholder="0"
              />
              {form.formState.errors.stock && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.stock.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={form.watch("categoryId")?.toString() || ""}
                onValueChange={(value) => form.setValue("categoryId", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.categoryId && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.categoryId.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={form.watch("featured")}
              onCheckedChange={(checked) => form.setValue("featured", checked)}
            />
            <Label htmlFor="featured">Featured Product</Label>
          </div>

          {/* Images */}
          <div>
            <Label>Product Images</Label>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="flex-1"
                  disabled={uploading}
                />
                <Button type="button" disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload Image"}
                </Button>
              </div>

              {form.watch("images").length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {form.watch("images").map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onSuccess}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-terracotta hover:bg-terracotta/90"
            >
              {isLoading ? "Saving..." : product ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
