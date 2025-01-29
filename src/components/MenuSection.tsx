import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils } from 'lucide-react';

interface MenuItem {
  name: string;
  description: string;
  price: number;
  category: string;
}

const menuItems: MenuItem[] = [
  {
    name: "Grilled Salmon",
    description: "Fresh Atlantic salmon with herbs and lemon butter sauce",
    price: 28.99,
    category: "Main Course"
  },
  {
    name: "Beef Tenderloin",
    description: "Premium cut served with roasted vegetables and red wine reduction",
    price: 34.99,
    category: "Main Course"
  },
  {
    name: "Truffle Risotto",
    description: "Creamy Arborio rice with wild mushrooms and truffle oil",
    price: 24.99,
    category: "Main Course"
  },
  {
    name: "Caesar Salad",
    description: "Crisp romaine, garlic croutons, parmesan, and classic dressing",
    price: 12.99,
    category: "Starters"
  }
];

const MenuSection = () => {
  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Utensils className="w-6 h-6" />
          <h2 className="text-3xl font-semibold text-center">Our Menu</h2>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {menuItems.map((item, index) => (
            <Card key={index} className="menu-card">
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">{item.description}</p>
                <p className="font-semibold">${item.price.toFixed(2)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;