
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils } from 'lucide-react';
import { getMenuItems, MenuItem } from '@/services/menuService';
import { useToast } from "@/components/ui/use-toast";

const MenuSection = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const items = await getMenuItems();
        setMenuItems(items);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        toast({
          title: "Error",
          description: "Failed to load menu items. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, [toast]);

  if (isLoading) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          Loading menu items...
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Utensils className="w-6 h-6" />
          <h2 className="text-3xl font-semibold text-center">Our Menu</h2>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {menuItems.map((item) => (
            <Card key={item.id} className="menu-card">
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">{item.description}</p>
                <p className="font-semibold">${item.price.toFixed(2)}</p>
                {item.image_url && (
                  <img 
                    src={item.image_url} 
                    alt={item.name}
                    className="mt-4 rounded-md w-full h-48 object-cover"
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
