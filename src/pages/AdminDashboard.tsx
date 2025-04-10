
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStats } from '@/components/admin/DashboardStats';
import { ReservationsTable } from '@/components/admin/ReservationsTable';
import { useReservations } from '@/hooks/useReservations';
import { useToast } from "@/components/ui/use-toast";

const AdminDashboard = () => {
  const { toast } = useToast();
  const {
    activeTab,
    setActiveTab,
    reservations,
    filteredReservations,
    isLoading,
    error,
    updateReservationStatus
  } = useReservations();

  // Check for expired reservations on component mount and tab change
  useEffect(() => {
    // This will trigger the check in the useReservations hook
    if (activeTab === 'expired' || activeTab === 'accepted') {
      // We can force a re-check here if needed
    }
  }, [activeTab]);

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load reservations. Please try again.",
      variant: "destructive",
    });
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
              value={activeTab}
              defaultValue="pending" 
              className="w-full" 
              onValueChange={(value) => setActiveTab(value as 'pending' | 'accepted' | 'deleted' | 'expired')}
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
