import React, { useState } from 'react';
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
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <UserRound className="w-4 h-4 text-muted-foreground" />
            Name *
          </Label>
          <div className="relative">
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
              placeholder="Enter your name"
              className={`pr-8 ${touched.name && !name.trim() ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              required
            />
            {name.trim() && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500"
              >
                <Check className="w-4 h-4" />
              </motion.div>
            )}
          </div>
          {touched.name && !name.trim() && (
            <p className="text-sm text-red-500 mt-1">Name is required</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            Email *
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
              placeholder="Enter your email"
              className={`pr-8 ${touched.email && (!email.trim() || !isValidEmail(email)) ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              required
            />
            {email.trim() && isValidEmail(email) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500"
              >
                <Check className="w-4 h-4" />
              </motion.div>
            )}
          </div>
          {touched.email && !email.trim() && (
            <p className="text-sm text-red-500 mt-1">Email is required</p>
          )}
          {touched.email && email.trim() && !isValidEmail(email) && (
            <p className="text-sm text-red-500 mt-1">Please enter a valid email</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-muted-foreground" />
          Phone (optional)
        </Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
          className="transition-all duration-200"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="special-requests" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          Special Requests (optional)
        </Label>
        <Input
          id="special-requests"
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="Any special requests or dietary requirements?"
          className="transition-all duration-200"
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="pt-4"
      >
        <Button
          type="button"
          variant="outline"
          className="w-full hover:bg-primary hover:text-primary-foreground transition-all duration-200"
          onClick={onContinue}
          disabled={!isFormValid}
        >
          Continue to Pre-Order Menu
        </Button>
      </motion.div>
    </div>
  );
};

export default ReservationForm;
