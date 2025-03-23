
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Phone, Mail, Utensils, Clock, Calendar, ChefHat, Award } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Index = () => {
  const navigate = useNavigate();

  const carouselImages = [
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

  return (
    <div className="min-h-screen">
      {/* Carousel Banner */}
      <section className="w-full">
        <Carousel className="w-full" opts={{ 
          loop: true, 
          duration: 400, 
          autoplay: true,
          delay: 5000, // 5 seconds per slide
        }}>
          <CarouselContent>
            {carouselImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[80vh] w-full">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out"
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

      {/* Hero Section - Restaurant Introduction */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold mb-6 text-primary">Welcome to La Belle Cuisine</h2>
              <div className="flex items-center mb-4">
                <Award className="w-6 h-6 text-yellow-500 mr-2" />
                <span className="text-lg font-semibold">Award-Winning Fine Dining</span>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Since 1998, La Belle Cuisine has been crafting extraordinary dining experiences 
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
                >
                  Explore Our Menu
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
                <p className="text-sm">Jean-Pierre Dubois, with 25 years of culinary expertise</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-12">What Our Guests Say</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: "John Doe",
                rating: 5,
                comment: "Exceptional dining experience! The atmosphere and service were impeccable."
              },
              {
                name: "Jane Smith",
                rating: 5,
                comment: "The best fine dining restaurant in the city. Every dish was a masterpiece."
              },
              {
                name: "Mike Johnson",
                rating: 5,
                comment: "Outstanding service and amazing food. Will definitely come back!"
              }
            ].map((review, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{review.comment}</p>
                <p className="font-semibold">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-xl font-semibold mb-4">La Belle Cuisine</h3>
              <p className="text-gray-400">Experience the finest dining in an elegant atmosphere.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <p>123 Gourmet Street, Foodie City</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <p>+1 (555) 123-4567</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  <p>info@labellecuisine.com</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Hours</h3>
              <div className="space-y-2">
                <p>Monday - Friday: 11:00 AM - 10:00 PM</p>
                <p>Saturday: 10:00 AM - 11:00 PM</p>
                <p>Sunday: 10:00 AM - 9:00 PM</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p>&copy; 2024 La Belle Cuisine. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
