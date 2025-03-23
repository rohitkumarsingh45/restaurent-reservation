
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Phone, Mail, Utensils, Clock, Calendar } from 'lucide-react';
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
        <Carousel className="w-full" opts={{ loop: true, duration: 50 }}>
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
