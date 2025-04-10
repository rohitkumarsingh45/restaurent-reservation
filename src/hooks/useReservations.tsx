
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Reservation {
  id: string;
  created_at: string;
  date: string;
  table_type: string;
  name: string;
  email: string;
  phone?: string;
  special_requests?: string;
  status: 'pending' | 'accepted' | 'deleted' | 'expired';
}

export interface ReservationWithMenuItems extends Reservation {
  menuItems?: MenuItem[];
}

export const useReservations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted' | 'deleted' | 'expired'>('pending');

  // Auto-expire past reservations
  useEffect(() => {
    const handleExpiredReservations = async () => {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'expired' })
        .lt('date', now)
        .in('status', ['pending', 'accepted']);
      
      if (error) {
        console.error('Error updating expired reservations:', error);
      } else {
        queryClient.invalidateQueries({ queryKey: ['reservations'] });
      }
    };

    // Run once immediately
    handleExpiredReservations();
    
    // Then set up interval for checking (every hour)
    const interval = setInterval(handleExpiredReservations, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [queryClient]);

  const { data: reservations, isLoading, error } = useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      // First get all reservations
      const { data: reservationsData, error: reservationsError } = await supabase
        .from('reservations')
        .select('*')
        .order('date', { ascending: true });

      if (reservationsError) {
        console.error('Error fetching reservations:', reservationsError);
        throw reservationsError;
      }

      // Get all reservation menu items
      const { data: menuItemsData, error: menuItemsError } = await supabase
        .from('reservation_menu_items')
        .select(`
          reservation_id,
          menu_item_id,
          quantity,
          menu_items(id, name, price)
        `);

      if (menuItemsError) {
        console.error('Error fetching menu items:', menuItemsError);
        throw menuItemsError;
      }

      // Combine the data
      const reservationsWithMenuItems: ReservationWithMenuItems[] = reservationsData.map((reservation: Reservation) => {
        const reservationMenuItems = menuItemsData
          .filter((mi: any) => mi.reservation_id === reservation.id)
          .map((mi: any) => ({
            id: mi.menu_item_id,
            name: mi.menu_items.name,
            price: mi.menu_items.price,
            quantity: mi.quantity
          }));

        return {
          ...reservation,
          status: reservation.status || 'pending',
          menuItems: reservationMenuItems.length > 0 ? reservationMenuItems : undefined
        };
      });

      return reservationsWithMenuItems;
    },
  });

  const updateReservationStatus = useMutation({
    mutationFn: async ({ reservation, newStatus }: { reservation: Reservation, newStatus: 'accepted' | 'deleted' | 'expired' }) => {
      console.log(`Updating reservation ${reservation.id} to status: ${newStatus}`);
      
      try {
        // First, update the status in the database
        const { error: updateError } = await supabase
          .from('reservations')
          .update({ status: newStatus })
          .eq('id', reservation.id);

        if (updateError) {
          console.error('Error updating reservation status:', updateError);
          throw updateError;
        }

        // Then, send email notification (only for accepted or deleted)
        if (newStatus === 'accepted' || newStatus === 'deleted') {
          await supabase.functions.invoke('send-reservation-email', {
            body: {
              customerEmail: reservation.email,
              customerName: reservation.name,
              date: reservation.date,
              tableType: reservation.table_type,
              status: newStatus === 'accepted' ? 'accepted' : 'rejected'
            }
          });
        }
        
        return { success: true };
      } catch (error) {
        console.error('Error in updateReservationStatus:', error);
        throw error;
      }
    },
    onSuccess: (_, { newStatus, reservation }) => {
      console.log(`Successfully updated reservation to: ${newStatus}`);
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      
      toast({
        title: `Reservation ${newStatus === 'accepted' ? 'Accepted' : newStatus === 'deleted' ? 'Deleted' : 'Expired'}`,
        description: newStatus === 'accepted' 
          ? "A confirmation email has been sent to the customer."
          : newStatus === 'deleted' 
            ? "The reservation has been removed and the customer has been notified."
            : "The reservation has been marked as expired.",
      });
    },
    onError: (error) => {
      console.error('Error updating reservation:', error);
      toast({
        title: "Error",
        description: "Failed to update the reservation. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Filter reservations based on the active tab
  const filteredReservations = reservations?.filter(r => r.status === activeTab) || [];

  return {
    activeTab,
    setActiveTab,
    reservations,
    filteredReservations,
    isLoading,
    error,
    updateReservationStatus
  };
};
