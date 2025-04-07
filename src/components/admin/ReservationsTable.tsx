
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
  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

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
                      onClick={() => updateReservationStatus.mutate({ 
                        reservation,
                        newStatus: 'accepted'
                      })}
                      disabled={updateReservationStatus.isPending}
                    >
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
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              )}
              {activeTab === 'accepted' && (
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => updateReservationStatus.mutate({ 
                      reservation,
                      newStatus: 'deleted'
                    })}
                    disabled={updateReservationStatus.isPending}
                  >
                    Cancel
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
