
import React from 'react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface MenuItemsListProps {
  menuItems?: MenuItem[];
}

export const MenuItemsList: React.FC<MenuItemsListProps> = ({ menuItems }) => {
  if (!menuItems || menuItems.length === 0) return <span className="text-gray-500">None</span>;
  
  return (
    <div className="space-y-1">
      {menuItems.map(item => (
        <div key={item.id} className="flex justify-between text-sm">
          <span>{item.name} × {item.quantity}</span>
          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
};
