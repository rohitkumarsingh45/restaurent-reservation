
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Utensils } from 'lucide-react';

interface DashboardStatsProps {
  reservations: any[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ reservations }) => {
  const todayReservations = reservations?.filter(r => 
    new Date(r.date).toDateString() === new Date().toDateString() &&
    (r.status === 'pending' || r.status === 'accepted')
  ).length || 0;

  const pendingReservations = reservations?.filter(r => r.status === 'pending').length || 0;
  
  const advancedOrders = reservations?.filter(r => 
    (r.status === 'pending' || r.status === 'accepted') && 
    r.menuItems && r.menuItems.length > 0
  ).length || 0;

  return (
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
            {todayReservations}
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
            {pendingReservations}
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
            {advancedOrders}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
