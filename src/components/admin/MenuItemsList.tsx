
import React from 'react';
import { MenuItem } from '@/types/reservations';

interface MenuItemsListProps {
  menuItems?: MenuItem[];
}

export const MenuItemsList: React.FC<MenuItemsListProps> = ({ menuItems }) => {
  if (!menuItems || menuItems.length === 0) {
    return <span className="text-gray-500">None</span>;
  }
  
  // Add debug logging to help troubleshoot
  console.log('MenuItemsList received items:', JSON.stringify(menuItems, null, 2));
  
  return (
    <div className="space-y-1">
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
