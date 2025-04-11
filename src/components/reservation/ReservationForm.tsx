import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, UserRound, Mail, Phone, MessageSquare } from "lucide-react";

export type { ReservationFormProps };

interface ReservationFormProps {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  specialRequests: string;
  setSpecialRequests: (value: string) => void;
  onContinue: () => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  specialRequests,
  setSpecialRequests,
  onContinue,
}) => {
  const [touched, setTouched] = useState({
    name: false,
    email: false
  });

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isFormValid = name.trim() && email.trim() && isValidEmail(email);

  return (
    <div className="relative w-full min-h-screen bg-cover bg-center overflow-hidden font-sans"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1560464793-b50c9a2e2c18?auto=format&fit=crop&w=1470&q=80')", // Restaurant-related image
      }}
    >
      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-lg bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 text-black space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">Reserve Your Table</h1>
            <p className="text-sm text-gray-600">Please fill in your details to proceed with the reservation.</p>
          </div>

          {/* Name & Email */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>

          {/* Phone & Special Requests */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="special-requests">Special Requests (optional)</Label>
              <Input
                id="special-requests"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Any special requests or dietary requirements?"
                className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>

          {/* Continue Button */}
          <div className="pt-4">
            <Button
              type="button"
              variant="default"
              className="w-full py-3 text-white bg-yellow-500 hover:bg-yellow-400 font-semibold rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
              onClick={onContinue}
            >
              Continue to Pre-Order Menu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;
