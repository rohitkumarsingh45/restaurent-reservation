import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Lock } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface AdminAuthProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || '123456';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === adminPassword) {
      toast({
        title: "Success",
        description: "Welcome to the admin dashboard",
      });
      onSuccess();
      setPassword('');
    } else {
      toast({
        title: "Error",
        description: "Incorrect password",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">Admin Authentication</DialogTitle>
        </DialogHeader>
        <Card className="border-2">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-4 py-2 border-2 rounded-lg w-full focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose} className="w-24">
                  Cancel
                </Button>
                <Button type="submit" className="w-24 bg-primary hover:bg-primary/90">
                  Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default AdminAuth;