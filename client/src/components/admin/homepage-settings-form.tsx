
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getSettings, createSetting, updateSetting } from "@/lib/api";

const homepageSettingsSchema = z.object({
  heroTitle: z.string().min(1, "Hero title is required"),
  heroSubtitle: z.string().min(1, "Hero subtitle is required"),
  heroDescription: z.string().min(1, "Hero description is required"),
  heroImage: z.string().min(1, "Hero image is required"),
  heroButtonText: z.string().min(1, "Button text is required"),
  heroButtonSecondaryText: z.string().min(1, "Secondary button text is required"),
});

type HomepageSettingsForm = z.infer<typeof homepageSettingsSchema>;

export function HomepageSettingsForm() {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings = [] } = useQuery({
    queryKey: ["/api/settings"],
    queryFn: getSettings,
  });

  const form = useForm<HomepageSettingsForm>({
    resolver: zodResolver(homepageSettingsSchema),
    defaultValues: {
      heroTitle: "Authentic",
      heroSubtitle: "Indian Arts",
      heroDescription: "Discover masterpieces created by skilled artisans who carry forward centuries-old traditions. Each piece is a testament to India's rich cultural heritage.",
      heroImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      heroButtonText: "Explore Collection",
      heroButtonSecondaryText: "Our Story",
    },
  });

  // Load existing settings when data is available
  useEffect(() => {
    if (settings.length > 0) {
      const settingsMap = settings.reduce((acc: any, setting: any) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {});

      form.reset({
        heroTitle: settingsMap.heroTitle || "Authentic",
        heroSubtitle: settingsMap.heroSubtitle || "Indian Arts",
        heroDescription: settingsMap.heroDescription || "Discover masterpieces created by skilled artisans who carry forward centuries-old traditions. Each piece is a testament to India's rich cultural heritage.",
        heroImage: settingsMap.heroImage || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        heroButtonText: settingsMap.heroButtonText || "Explore Collection",
        heroButtonSecondaryText: settingsMap.heroButtonSecondaryText || "Our Story",
      });
    }
  }, [settings, form]);

  const saveSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const existingSetting = settings.find((s: any) => s.key === key);
      if (existingSetting) {
        return updateSetting(key, value);
      } else {
        return createSetting({
          key,
          value,
          type: key === 'heroImage' ? 'image' : 'text',
          description: `Homepage ${key} setting`,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save setting",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload-homepage-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const result = await response.json();
      form.setValue('heroImage', result.imageUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: HomepageSettingsForm) => {
    try {
      // Save each setting individually
      await Promise.all([
        saveSettingMutation.mutateAsync({ key: 'heroTitle', value: data.heroTitle }),
        saveSettingMutation.mutateAsync({ key: 'heroSubtitle', value: data.heroSubtitle }),
        saveSettingMutation.mutateAsync({ key: 'heroDescription', value: data.heroDescription }),
        saveSettingMutation.mutateAsync({ key: 'heroImage', value: data.heroImage }),
        saveSettingMutation.mutateAsync({ key: 'heroButtonText', value: data.heroButtonText }),
        saveSettingMutation.mutateAsync({ key: 'heroButtonSecondaryText', value: data.heroButtonSecondaryText }),
      ]);

      toast({
        title: "Success",
        description: "Homepage settings saved successfully",
      });
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Homepage Hero Section Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="heroTitle">Hero Title</Label>
              <Input
                id="heroTitle"
                {...form.register("heroTitle")}
                placeholder="Enter hero title"
              />
              {form.formState.errors.heroTitle && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.heroTitle.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
              <Input
                id="heroSubtitle"
                {...form.register("heroSubtitle")}
                placeholder="Enter hero subtitle"
              />
              {form.formState.errors.heroSubtitle && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.heroSubtitle.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="heroDescription">Hero Description</Label>
            <Textarea
              id="heroDescription"
              {...form.register("heroDescription")}
              placeholder="Enter hero description"
              rows={3}
            />
            {form.formState.errors.heroDescription && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.heroDescription.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="heroButtonText">Primary Button Text</Label>
              <Input
                id="heroButtonText"
                {...form.register("heroButtonText")}
                placeholder="Enter primary button text"
              />
              {form.formState.errors.heroButtonText && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.heroButtonText.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="heroButtonSecondaryText">Secondary Button Text</Label>
              <Input
                id="heroButtonSecondaryText"
                {...form.register("heroButtonSecondaryText")}
                placeholder="Enter secondary button text"
              />
              {form.formState.errors.heroButtonSecondaryText && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.heroButtonSecondaryText.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Hero Image</Label>
            <div className="mt-2 space-y-4">
              {form.watch("heroImage") && (
                <div className="relative">
                  <img
                    src={form.watch("heroImage")}
                    alt="Hero preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => form.setValue("heroImage", "")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              <div className="flex items-center space-x-4">
                <Input
                  {...form.register("heroImage")}
                  placeholder="Enter image URL"
                  className="flex-1"
                />
                <Label htmlFor="heroImageUpload" className="cursor-pointer">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploading}
                    asChild
                  >
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      {isUploading ? "Uploading..." : "Upload"}
                    </span>
                  </Button>
                  <input
                    id="heroImageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </Label>
              </div>
              {form.formState.errors.heroImage && (
                <p className="text-red-500 text-sm">{form.formState.errors.heroImage.message}</p>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-terracotta hover:bg-terracotta/90"
            disabled={saveSettingMutation.isPending}
          >
            {saveSettingMutation.isPending ? "Saving..." : "Save Homepage Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
