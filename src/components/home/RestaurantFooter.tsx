import React from 'react';
import { MapPin, Phone, Mail, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const RestaurantFooter = () => {
  const navigate = useNavigate();
  
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-semibold mb-4">Namaste Bharat</h3>
            <p className="text-gray-400">Experience the finest dining in an elegant atmosphere.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <p>123 Gopalganj Bihar, Foodie City</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <p>+91 8340178854</p>
                <br />
                <p>+91 8229862783</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <p>namastebharat.info.com</p>
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
          <p>&copy; 2025 Namaste Bharat . All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default RestaurantFooter;
