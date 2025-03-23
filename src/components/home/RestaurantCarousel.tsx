
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from 'embla-carousel-autoplay';

interface CarouselImage {
  url: string;
  title: string;
  description: string;
}

const RestaurantCarousel = () => {
  const navigate = useNavigate();

  const carouselImages: CarouselImage[] = [
    {
      url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      title: "Fine Dining Experience",
      description: "Exquisite cuisine in an elegant atmosphere"
    },
    {
      url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      title: "Culinary Excellence",
      description: "Our chefs create masterpieces with every dish"
    },
    {
      url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1274&q=80",
      title: "Memorable Gatherings",
      description: "Perfect venue for celebrations and special occasions"
    },
    {
      url: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      title: "Seasonal Inspirations",
      description: "Fresh ingredients showcased in seasonal menus"
    }
  ];

  // Create autoplay plugin instance with 3 second delay
  const autoplayPlugin = React.useMemo(
    () => 
      Autoplay({
        delay: 3000, // 3 seconds per slide
        stopOnInteraction: true,
        stopOnMouseEnter: true,
      }),
    []
  );

  return (
    <section className="w-full">
      <Carousel className="w-full" opts={{ 
        loop: true, 
        duration: 0, // Instant transition (0ms)
      }} plugins={[autoplayPlugin]}>
        <CarouselContent>
          {carouselImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[80vh] w-full">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-opacity duration-0"
                  style={{ backgroundImage: `url(${image.url})` }}
                >
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white">
                    <h2 className="text-5xl font-bold mb-4 animate-fade-in">{image.title}</h2>
                    <p className="text-xl mb-8 animate-fade-in">{image.description}</p>
                    <div className="flex space-x-4 animate-fade-in">
                      <Button 
                        variant="default" 
                        size="lg"
                        onClick={() => navigate('/menu')}
                        className="bg-white text-black hover:bg-white/90 transition-colors duration-300"
                      >
                        <Utensils className="mr-2" size={18} />
                        View Menu
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="border-white text-white hover:bg-white/20 transition-colors duration-300"
                        onClick={() => navigate('/reservation')}
                      >
                        <Calendar className="mr-2" size={18} />
                        Book a Table
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
          <CarouselPrevious className="relative -left-0 bg-white/30 hover:bg-white/50 border-none text-white transition-colors duration-300" />
          <CarouselNext className="relative -right-0 bg-white/30 hover:bg-white/50 border-none text-white transition-colors duration-300" />
        </div>
      </Carousel>
    </section>
  );
};

export default RestaurantCarousel;
