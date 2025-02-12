
import React from 'react';
import { useQuery } from '@tanstack/react-query';
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

interface Reservation {
  id: string;
  created_at: string;
  date: string;
  table_type: string;
  name: string;
  email: string;
  phone?: string;
  special_requests?: string;
}

const AdminDashboard = () => {
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
      return data as Reservation[];
    },
  });

  if (error) {
    console.error('Error in component:', error);
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
            <CardTitle>Recent Reservations</CardTitle>
          </CardHeader>
          <CardContent>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations?.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell>{reservation.name}</TableCell>
                      <TableCell>{reservation.email}</TableCell>
                      <TableCell>
                        {new Date(reservation.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{reservation.table_type}</TableCell>
                      <TableCell>{reservation.phone || 'N/A'}</TableCell>
                      <TableCell>{reservation.special_requests || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
