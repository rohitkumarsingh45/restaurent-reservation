
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/components/ui/use-toast";
import { 
  ReservationStatus, 
  ReservationWithMenuItems,
  UpdateReservationStatusParams, 
  UseReservationsReturn 
} from '@/types/reservations';
import { 
  handleExpiredReservations, 
  fetchReservations, 
  updateReservationStatus as updateReservationStatusUtil 
} from '@/utils/reservationUtils';

export const useReservations = (): UseReservationsReturn => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<ReservationStatus>('pending');

  // Auto-expire past reservations
  useEffect(() => {
    // Run once immediately
    handleExpiredReservations(queryClient);
    
    // Then set up interval for checking (every hour)
    const interval = setInterval(() => handleExpiredReservations(queryClient), 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [queryClient]);

  // Query to fetch all reservations
  const { data: reservations, isLoading, error, refetch } = useQuery({
    queryKey: ['reservations'],
    queryFn: fetchReservations,
  });

  // Mutation to update reservation status
  const updateReservationStatus = useMutation({
    mutationFn: updateReservationStatusUtil,
    onSuccess: (result, { newStatus }) => {
      console.log(`Successfully updated reservation to: ${newStatus}`, result);
      
      // Invalidate the reservation cache
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      
      // Force refetch to ensure UI is updated
      const performRefetch = async () => {
        console.log('Performing immediate refetch after successful update');
        await refetch();
        
        // Sometimes the first refetch might not catch the latest data due to replication lag
        // Do another refetch with a small delay
        setTimeout(async () => {
          console.log('Performing delayed refetch for data consistency');
          await refetch();
        }, 1000);
      };
      
      performRefetch();
      
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
  
  console.log(`Active tab: ${activeTab}, Filtered reservations: ${filteredReservations.length}`);

  return {
    activeTab,
    setActiveTab,
    reservations,
    filteredReservations,
    isLoading,
    error,
    updateReservationStatus,
    refetch
  };
};

// Re-export the types for convenience
export type { 
  MenuItem, 
  Reservation, 
  ReservationWithMenuItems, 
  ReservationStatus 
} from '@/types/reservations';
