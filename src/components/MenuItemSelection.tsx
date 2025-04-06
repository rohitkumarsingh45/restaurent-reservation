
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MinusCircle, PlusCircle, Utensils } from 'lucide-react';
import { getMenuItems, MenuItem } from '@/services/menuService';
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

export interface SelectedMenuItem {
  menuItem: MenuItem;
  quantity: number;
}

interface MenuItemSelectionProps {
  selectedItems: SelectedMenuItem[];
  onUpdateSelectedItems: (items: SelectedMenuItem[]) => void;
}

const MenuItemSelection: React.FC<MenuItemSelectionProps> = ({ 
  selectedItems,
  onUpdateSelectedItems
}) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const items = await getMenuItems();
        setMenuItems(items);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(items.map(item => item.category)));
        setCategories(uniqueCategories);
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

  const getItemQuantity = (itemId: string): number => {
    const item = selectedItems.find(i => i.menuItem.id === itemId);
    return item ? item.quantity : 0;
  };

  const updateItemQuantity = (item: MenuItem, newQuantity: number) => {
    if (newQuantity < 0) return;

    const updatedItems = [...selectedItems];
    const existingItemIndex = updatedItems.findIndex(i => i.menuItem.id === item.id);

    if (existingItemIndex >= 0) {
      if (newQuantity === 0) {
        // Remove item if quantity is 0
        updatedItems.splice(existingItemIndex, 1);
      } else {
        // Update quantity
        updatedItems[existingItemIndex].quantity = newQuantity;
      }
    } else if (newQuantity > 0) {
      // Add new item
      updatedItems.push({ menuItem: item, quantity: newQuantity });
    }

    onUpdateSelectedItems(updatedItems);
  };

  if (isLoading) {
    return <div className="py-4 text-center">Loading menu items...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Utensils className="w-5 h-5" />
          <h3 className="text-lg font-medium">Pre-Order Menu Items</h3>
        </div>
        
        {selectedItems.length > 0 && (
          <Badge variant="secondary">
            {selectedItems.reduce((total, item) => total + item.quantity, 0)} items selected
          </Badge>
        )}
      </div>

      {categories.map((category) => (
        <div key={category} className="space-y-4">
          <h4 className="font-medium text-muted-foreground">{category}</h4>
          <div className="grid gap-3 md:grid-cols-2">
            {menuItems
              .filter(item => item.category === category)
              .map((item) => {
                const quantity = getItemQuantity(item.id);
                
                return (
                  <Card key={item.id} className="overflow-hidden border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{item.name}</CardTitle>
                      <CardDescription className="text-xs">${item.price.toFixed(2)}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      {item.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                      )}
                      
                      <div className="flex items-center justify-end gap-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => updateItemQuantity(item, Math.max(0, quantity - 1))}
                          disabled={quantity === 0}
                        >
                          <MinusCircle className="h-4 w-4" />
                          <span className="sr-only">Decrease</span>
                        </Button>
                        
                        <span className="w-6 text-center">{quantity}</span>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => updateItemQuantity(item, quantity + 1)}
                        >
                          <PlusCircle className="h-4 w-4" />
                          <span className="sr-only">Increase</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuItemSelection;
