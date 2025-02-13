
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Phone, Mail } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center" 
               style={{
                 backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')",
                 backgroundSize: 'cover',
                 backgroundPosition: 'center'
               }}>
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">La Belle Cuisine</h1>
          <p className="text-xl mb-8">Experience Fine Dining at its Best</p>
          <div className="space-x-4">
            <Button 
              variant="default" 
              size="lg"
              onClick={() => navigate('/menu')}
            >
              View Menu
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white border-primary"
              onClick={() => navigate('/reservation')}
            >
              Book a Table
            </Button>
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
