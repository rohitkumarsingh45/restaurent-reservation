
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Clock, Utensils } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';

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
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ReservationWithMenuItems extends Reservation {
  menuItems?: MenuItem[];
}

const AdminDashboard = () => {
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
      // First, update the status in the database
      const { error: updateError } = await supabase
        .from('reservations')
        .update({ status: newStatus })
        .eq('id', reservation.id);

      if (updateError) throw updateError;

      // Then, send email notification
      await supabase.functions.invoke('send-reservation-email', {
        body: {
          customerEmail: reservation.email,
          customerName: reservation.name,
          date: reservation.date,
          tableType: reservation.table_type,
          status: newStatus === 'accepted' ? 'accepted' : 'rejected'
        }
      });
    },
    onSuccess: (_, { newStatus }) => {
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

  const filteredReservations = reservations?.filter(r => r.status === activeTab) || [];

  if (error) {
    return <div className="p-8">Error loading reservations. Please try again later.</div>;
  }

  const renderMenuItems = (menuItems?: MenuItem[]) => {
    if (!menuItems || menuItems.length === 0) return <span className="text-gray-500">None</span>;
    
    return (
      <div className="space-y-1">
        {menuItems.map(item => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.name} × {item.quantity}</span>
            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Reservations Today
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reservations?.filter(r => 
                  new Date(r.date).toDateString() === new Date().toDateString() &&
                  (r.status === 'pending' || r.status === 'accepted')
                ).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Reservations
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reservations?.filter(r => r.status === 'pending').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Advanced Orders
              </CardTitle>
              <Utensils className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reservations?.filter(r => 
                  (r.status === 'pending' || r.status === 'accepted') && 
                  r.menuItems && r.menuItems.length > 0
                ).length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full" onValueChange={(value) => setActiveTab(value as any)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="accepted">Accepted</TabsTrigger>
                <TabsTrigger value="expired">Expired</TabsTrigger>
                <TabsTrigger value="deleted">Deleted</TabsTrigger>
              </TabsList>
              <TabsContent value={activeTab}>
                {isLoading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : (
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
                            <TableCell>{renderMenuItems(reservation.menuItems)}</TableCell>
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
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
