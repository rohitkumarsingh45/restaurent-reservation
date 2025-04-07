
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStats } from '@/components/admin/DashboardStats';
import { ReservationsTable } from '@/components/admin/ReservationsTable';
import { useReservations } from '@/hooks/useReservations';

const AdminDashboard = () => {
  const {
    activeTab,
    setActiveTab,
    reservations,
    filteredReservations,
    isLoading,
    error,
    updateReservationStatus
  } = useReservations();

  if (error) {
    return <div className="p-8">Error loading reservations. Please try again later.</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <DashboardStats reservations={reservations || []} />

        <Card>
          <CardHeader>
            <CardTitle>Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue="pending" 
              className="w-full" 
              onValueChange={(value) => setActiveTab(value as any)}
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="accepted">Accepted</TabsTrigger>
                <TabsTrigger value="expired">Expired</TabsTrigger>
                <TabsTrigger value="deleted">Deleted</TabsTrigger>
              </TabsList>
              <TabsContent value={activeTab}>
                <ReservationsTable
                  activeTab={activeTab}
                  filteredReservations={filteredReservations}
                  isLoading={isLoading}
                  updateReservationStatus={updateReservationStatus}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
