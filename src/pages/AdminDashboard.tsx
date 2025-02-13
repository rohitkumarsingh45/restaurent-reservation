
import React, { useState } from 'react';
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
import { Calendar, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Reservation {
  id: string;
  created_at: string;
  date: string;
  table_type: string;
  name: string;
  email: string;
  phone?: string;
  special_requests?: string;
  status: 'pending' | 'accepted' | 'deleted';
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted' | 'deleted'>('pending');

  const { data: reservations, isLoading, error } = useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reservations:', error);
        throw error;
      }
      return (data as Reservation[]).map(r => ({
        ...r,
        status: r.status || 'pending'
      }));
    },
  });

  const updateReservationStatus = useMutation({
    mutationFn: async ({ reservation, newStatus }: { reservation: Reservation, newStatus: 'accepted' | 'deleted' }) => {
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
        title: `Reservation ${newStatus === 'accepted' ? 'Accepted' : 'Deleted'}`,
        description: newStatus === 'accepted' 
          ? "A confirmation email has been sent to the customer."
          : "The reservation has been removed and the customer has been notified.",
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

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid gap-6 mb-8 md:grid-cols-2">
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
                  new Date(r.date).toDateString() === new Date().toDateString()
                ).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Reservations
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reservations?.length || 0}
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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="accepted">Accepted</TabsTrigger>
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
                        {activeTab === 'pending' && <TableHead>Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReservations.map((reservation) => (
                        <TableRow key={reservation.id}>
                          <TableCell>{reservation.name}</TableCell>
                          <TableCell>{reservation.email}</TableCell>
                          <TableCell>
                            {new Date(reservation.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{reservation.table_type}</TableCell>
                          <TableCell>{reservation.phone || 'N/A'}</TableCell>
                          <TableCell>{reservation.special_requests || 'N/A'}</TableCell>
                          {activeTab === 'pending' && (
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="default"
                                  className="bg-green-600 hover:bg-green-700"
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
                        </TableRow>
                      ))}
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
