
import React, { useEffect } from 'react';
import { MenuItem } from '@/types/reservations';
import { AlertCircle, ShoppingBag } from 'lucide-react';

interface MenuItemsListProps {
  menuItems?: MenuItem[];
}

export const MenuItemsList: React.FC<MenuItemsListProps> = ({ menuItems }) => {
  useEffect(() => {
    // Enhanced debugging to better understand what's being received
    console.log('MenuItemsList received:', menuItems);
    if (menuItems && menuItems.length > 0) {
      console.log('First menu item details:', JSON.stringify(menuItems[0], null, 2));
    }
  }, [menuItems]);

  if (!menuItems || menuItems.length === 0) {
    return (
      <div className="flex items-center text-gray-500 gap-1">
        <span>None</span>
        <span className="text-xs text-muted-foreground">(No pre-orders)</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1 text-sm font-medium text-emerald-600 mb-1">
        <ShoppingBag className="h-4 w-4" />
        <span>{menuItems.length} item(s) pre-ordered</span>
      </div>
      
      {menuItems.map(item => (
        <div key={item.id} className="flex justify-between text-sm">
          <span className="font-medium">{item.name} × {item.quantity}</span>
          <span>${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
      
      <div className="mt-1 pt-1 border-t text-sm font-semibold flex justify-between">
        <span>Total:</span>
        <span>${menuItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
      </div>
    </div>
  );
};
