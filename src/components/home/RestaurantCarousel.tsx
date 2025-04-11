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
import { type CarouselApi } from "@/components/ui/carousel";

interface CarouselImage {
  url: string;
  title: string;
  description: string;
}

const RestaurantCarousel = () => {
  const navigate = useNavigate();
  const [api, setApi] = React.useState<CarouselApi>();

  const carouselImages: CarouselImage[] = [
    {
      url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      title: "Fine Dining Experience",
      description: "Exquisite cuisine in an elegant atmosphere"
    },
    {
      url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8&auto=format&fit=crop&w=1470&q=80",
      title: "Culinary Excellence",
      description: "Our chefs create masterpieces with every dish"
    },
    {
      url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8&auto=format&fit=crop&w=1274&q=80",
      title: "Memorable Gatherings",
      description: "Perfect venue for celebrations and special occasions"
    },
    {
      url: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8&auto=format&fit=crop&w=1470&q=80",
      title: "Seasonal Inspirations",
      description: "Fresh ingredients showcased in seasonal menus"
    }
  ];

  React.useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      // Handle slide change if needed
    });

    // Set up interval for auto-sliding
    const autoplayInterval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    // Clear interval on cleanup
    return () => clearInterval(autoplayInterval);
  }, [api]);

  return (
    <section className="w-full">
      <Carousel 
        setApi={setApi}
        className="w-full" 
        opts={{ 
          loop: true,
          duration: 1000,
        }}
      >
        <CarouselContent>
          {carouselImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[80vh] w-full">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
                  style={{ backgroundImage: `url(${image.url})` }}
                >
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white px-4 text-center">
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white px-4 text-center">
                    <h2 className="text-5xl font-bold mb-4 animate-fade-in">{image.title}</h2>
                    <p className="text-xl mb-8 animate-fade-in">{image.description}</p>
                    <div className="flex space-x-4 animate-fade-in">
                      <Button
                        variant="default"
                      <Button
                        variant="default"
                        size="lg"
                        onClick={() => navigate('/menu')}
                        className="bg-white text-black hover:bg-white/90 transition-colors duration-300"
                      >
                        <Utensils className="mr-2" size={18} />
                        View Menu
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>


        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
          <CarouselPrevious className="relative bg-white/30 hover:bg-white/50 border-none text-white transition-colors duration-300" />
          <CarouselNext className="relative bg-white/30 hover:bg-white/50 border-none text-white transition-colors duration-300" />
          <CarouselPrevious className="relative bg-white/30 hover:bg-white/50 border-none text-white transition-colors duration-300" />
          <CarouselNext className="relative bg-white/30 hover:bg-white/50 border-none text-white transition-colors duration-300" />
        </div>
      </Carousel>
    </section>
  );
};

export default RestaurantCarousel;
