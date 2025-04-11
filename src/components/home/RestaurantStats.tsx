import React from 'react';
import { Users, Star, Award, Utensils } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Stat {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const RestaurantStats = () => {
  const stats: Stat[] = [
    {
      icon: <Users className="w-6 h-6" />,
      value: "50,000+",
      label: "Happy Guests"
    },
    {
      icon: <Star className="w-6 h-6" />,
      value: "4.9",
      label: "Average Rating"
    },
    {
      icon: <Award className="w-6 h-6" />,
      value: "3",
      label: "Michelin Stars"
    },
    {
      icon: <Utensils className="w-6 h-6" />,
      value: "15+",
      label: "Signature Dishes"
    }
  ];

  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={cn(
                "text-center p-6 rounded-xl",
                "transform transition-all duration-300 hover:scale-105"
              )}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RestaurantStats;