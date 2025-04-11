import React from 'react';
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
import { CheckCircle, Trash, Clock } from 'lucide-react'; // Add icons for actions
import ReactTooltip from 'react-tooltip'; // Import react-tooltip

interface Reservation {
  id: string;
  created_at: string;
  date: string;
  table_type: string;
  name: string;
  email: string;
  phone?: string;
  special_requests?: string;
  status: 'pending' | 'accepted' | 'deleted' | 'expired';
  menuItems?: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

interface ReservationsTableProps {
  activeTab: 'pending' | 'accepted' | 'deleted' | 'expired';
  filteredReservations: Reservation[];
  isLoading: boolean;
  updateReservationStatus: any;
}

export const ReservationsTable: React.FC<ReservationsTableProps> = ({
  activeTab,
  filteredReservations,
  isLoading,
  updateReservationStatus
}) => {
  console.log('ReservationsTable rendered with reservations:', filteredReservations);
  
  const isPastDate = (dateString: string) => {
    const reservationDate = new Date(dateString);
    const currentDate = new Date();
    return reservationDate < currentDate;
  };

<<<<<<< HEAD
  const handleStatusUpdate = (reservation: Reservation, newStatus: 'accepted' | 'deleted' | 'expired') => {
    updateReservationStatus.mutate({ 
      reservation,
      newStatus
    });
  };

=======
>>>>>>> ba5141fc0c117f0972bcd7067395e77aa8fce5ed
  if (isLoading) {
    return <div className="text-center py-4 text-xl text-gray-500">Loading reservations...</div>;
  }

  return (
    <Table className="table-auto w-full">
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
            <TableRow key={reservation.id} className="hover:bg-gray-100 transition-colors duration-200">
              <TableCell>{reservation.name}</TableCell>
              <TableCell>{reservation.email}</TableCell>
              <TableCell>{format(new Date(reservation.date), 'PPP p')}</TableCell>
              <TableCell>{reservation.table_type}</TableCell>
              <TableCell>{reservation.phone || 'N/A'}</TableCell>
              <TableCell className="max-w-xs truncate">{reservation.special_requests || 'N/A'}</TableCell>
              <TableCell>
                {console.log('Rendering MenuItemsList with:', reservation.menuItems)}
                <MenuItemsList menuItems={reservation.menuItems} />
              </TableCell>
              {activeTab === 'pending' && (
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                      onClick={() => updateReservationStatus.mutate({ 
                        reservation,
                        newStatus: 'accepted'
                      })}
                      disabled={updateReservationStatus.isPending}
                      data-tip="Accept this reservation"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Accept
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => updateReservationStatus.mutate({ 
                        reservation,
                        newStatus: 'deleted'
                      })}
                      disabled={updateReservationStatus.isPending}
                      data-tip="Delete this reservation"
                    >
                      <Trash className="h-5 w-5" />
                      Delete
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
                      onClick={() => updateReservationStatus.mutate({ 
                        reservation,
                        newStatus: 'expired'
                      })}
                      disabled={updateReservationStatus.isPending}
                      data-tip="Mark this reservation as expired"
                    >
                      <Clock className="h-5 w-5" />
                      Mark Expired
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => updateReservationStatus.mutate({ 
                        reservation,
                        newStatus: 'deleted'
                      })}
                      disabled={updateReservationStatus.isPending}
                      data-tip="Cancel this reservation"
                    >
                      <Trash className="h-5 w-5" />
                      Cancel
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
