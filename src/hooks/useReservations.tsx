
import { useState, useEffect, useCallback } from 'react';
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
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // Enhanced refetch function with immediate and delayed refresh
  const enhancedRefetch = useCallback(async () => {
    console.log('Performing enhanced refetch');
    // Immediate refetch
    const result = await refetch();
    
    // Schedule another refetch after a short delay to ensure data consistency
    setTimeout(() => {
      console.log('Performing delayed refetch');
      refetch();
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    }, 1000);
    
    return result;
  }, [refetch, queryClient]);

  // Mutation to update reservation status
  const updateReservationStatus = useMutation({
    mutationFn: updateReservationStatusUtil,
    onMutate: (variables) => {
      console.log(`Starting mutation for reservation: ${variables.reservation.id} to ${variables.newStatus}`);
      // Return context with variables for potential rollback
      return { variables };
    },
    onSuccess: (result, { newStatus }) => {
      console.log(`Successfully updated reservation to: ${newStatus}`, result);
      
      // Force refresh the data to ensure UI reflects current state
      enhancedRefetch();
      
      toast({
        title: `Reservation ${newStatus === 'accepted' ? 'Accepted' : newStatus === 'deleted' ? 'Deleted' : 'Expired'}`,
        description: newStatus === 'accepted' 
          ? "A confirmation email has been sent to the customer."
          : newStatus === 'deleted' 
            ? "The reservation has been removed and the customer has been notified."
            : "The reservation has been marked as expired.",
      });
    },
    onError: (error, variables, context) => {
      console.error(`Error updating reservation: ${variables.reservation.id} to ${variables.newStatus}:`, error);
      toast({
        title: "Error",
        description: "Failed to update the reservation. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Always refresh after any mutation attempt
      enhancedRefetch();
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
    refetch: enhancedRefetch
  };
};

// Re-export the types for convenience
export type { 
  MenuItem, 
  Reservation, 
  ReservationWithMenuItems, 
  ReservationStatus 
} from '@/types/reservations';
