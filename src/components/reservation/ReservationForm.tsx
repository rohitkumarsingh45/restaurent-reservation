
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
    <div className="mt-6 space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
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
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="special-requests">Special Requests (optional)</Label>
        <Input
          id="special-requests"
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="Any special requests or dietary requirements?"
        />
      </div>
      
      <div className="pt-2">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onContinue}
        >
          Continue to Pre-Order Menu
        </Button>
      </div>
    </div>
  );
};

export default ReservationForm;
