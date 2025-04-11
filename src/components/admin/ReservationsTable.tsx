
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MenuItemsList } from './MenuItemsList';
import { ReservationWithMenuItems } from '@/types/reservations';

interface ReservationsTableProps {
  activeTab: 'pending' | 'accepted' | 'deleted' | 'expired';
  filteredReservations: ReservationWithMenuItems[];
  isLoading: boolean;
  updateReservationStatus: any;
}

export const ReservationsTable: React.FC<ReservationsTableProps> = ({
  activeTab,
  filteredReservations,
  isLoading,
  updateReservationStatus
}) => {
  // Track which reservations are being processed
  const [processingIds, setProcessingIds] = useState<Record<string, boolean>>({});

  const isPastDate = (dateString: string) => {
    const reservationDate = new Date(dateString);
    const currentDate = new Date();
    return reservationDate < currentDate;
  };

  const handleStatusUpdate = (reservation: ReservationWithMenuItems, newStatus: 'accepted' | 'deleted' | 'expired') => {
    console.log(`ReservationsTable: Updating reservation ${reservation.id} from ${reservation.status} to ${newStatus}`);
    
    // Set processing state for this reservation
    setProcessingIds(prev => ({ ...prev, [reservation.id]: true }));
    
    // Optimistic UI update
    const optimisticUpdate = async () => {
      try {
        await updateReservationStatus.mutate({ 
          reservation,
          newStatus
        });
      } finally {
        // Clear processing state regardless of outcome
        setProcessingIds(prev => ({ ...prev, [reservation.id]: false }));
      }
    };
    
    optimisticUpdate();
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  console.log(`ReservationsTable: Rendering table with ${filteredReservations.length} reservations for ${activeTab} tab`);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Table Type</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Special Requests</TableHead>
          <TableHead>Pre-Orders</TableHead>
          {(activeTab === 'pending' || activeTab === 'accepted') && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredReservations.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
              No {activeTab} reservations found
            </TableCell>
          </TableRow>
        ) : (
          filteredReservations.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell>{reservation.name}</TableCell>
              <TableCell>{reservation.email}</TableCell>
              <TableCell>
                {format(new Date(reservation.date), 'PPP p')}
              </TableCell>
              <TableCell>{reservation.table_type}</TableCell>
              <TableCell>{reservation.phone || 'N/A'}</TableCell>
              <TableCell className="max-w-xs truncate">{reservation.special_requests || 'N/A'}</TableCell>
              <TableCell>
                <MenuItemsList menuItems={reservation.menuItems} />
              </TableCell>
              {activeTab === 'pending' && (
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleStatusUpdate(reservation, 'accepted')}
                      disabled={processingIds[reservation.id] || updateReservationStatus.isPending}
                    >
                      {processingIds[reservation.id] ? "Processing..." : "Accept"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleStatusUpdate(reservation, 'deleted')}
                      disabled={processingIds[reservation.id] || updateReservationStatus.isPending}
                    >
                      {processingIds[reservation.id] ? "Processing..." : "Delete"}
                    </Button>
                  </div>
                </TableCell>
              )}
              {activeTab === 'accepted' && (
                <TableCell>
                  {isPastDate(reservation.date) ? (
                    <Button
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                      size="sm"
                      onClick={() => handleStatusUpdate(reservation, 'expired')}
                      disabled={processingIds[reservation.id] || updateReservationStatus.isPending}
                    >
                      {processingIds[reservation.id] ? "Processing..." : "Mark Expired"}
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleStatusUpdate(reservation, 'deleted')}
                      disabled={processingIds[reservation.id] || updateReservationStatus.isPending}
                    >
                      {processingIds[reservation.id] ? "Processing..." : "Cancel"}
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
