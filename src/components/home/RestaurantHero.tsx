
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Utensils, Calendar, Award, ChefHat } from 'lucide-react';

const RestaurantHero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold mb-6 text-primary">Welcome to Namaste Bharat</h2>
            <div className="flex items-center mb-4">
              <Award className="w-6 h-6 text-yellow-500 mr-2" />
              <span className="text-lg font-semibold">Award-Winning Fine Dining</span>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Since 1998, Namaste Bharat has been crafting extraordinary dining experiences 
              that combine exquisite flavors, elegant ambiance, and impeccable service.
              Our commitment to culinary excellence has made us a destination for food enthusiasts 
              and a cherished venue for life's special moments.
            </p>
            <p className="text-gray-700 mb-8 leading-relaxed">
              Our executive chef, Jean-Pierre Dubois, and his talented team create seasonal menus 
              using the finest locally-sourced ingredients, blending classic techniques with 
              innovative approaches to deliver unforgettable flavors and presentations.
            </p>
            <div className="flex gap-4">
              <Button 
                onClick={() => navigate('/about')} 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary/10"
              >
                Our Story
              </Button>
              <Button 
                onClick={() => navigate('/menu')} 
                variant="default"
                className="bg-[#8B5CF6] hover:bg-[#7E69AB] text-black font-medium rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Utensils className="mr-2" size={18} />
                Explore Our Menu
              </Button>
              <Button 
                onClick={() => navigate('/reservation')}
                variant="outline"
                className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10 font-medium rounded-md transition-all duration-300"
              >
                <Calendar className="mr-2" size={18} />
                Book a Table
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
                alt="Executive Chef and Team" 
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-primary/90 text-white p-4 rounded-lg shadow-lg max-w-[200px]">
              <div className="flex items-center mb-2">
                <ChefHat className="w-5 h-5 mr-2" />
                <h4 className="font-semibold">Our Executive Chef</h4>
              </div>
              <p className="text-sm">Mr, Sharma, with 25 years of culinary expertise</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantHero;
