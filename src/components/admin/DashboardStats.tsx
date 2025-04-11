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
      {/* Total Reservations Today Card */}
      <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white">
        <CardHeader className="flex items-center justify-between pb-2 relative">
          <CardTitle className="text-sm font-medium">
            Total Reservations Today
          </CardTitle>
          <div className="absolute top-0 right-0 p-2 text-white cursor-pointer">
            <span className="relative group">
              <Calendar className="h-5 w-5" />
              <div className="absolute top-0 right-0 w-32 p-2 text-xs bg-black text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Total reservations for today (Pending + Accepted)
              </div>
            </span>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-4xl font-semibold">
            <span className="animate-counter">{todayReservations}</span>
          </div>
          {/* Progress Bar */}
          <div className="mt-2">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                    Progress
                  </span>
                </div>
              </div>
              <div className="flex mb-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(todayReservations / 100) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Reservations Card */}
      <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 bg-gradient-to-r from-yellow-500 to-orange-400 text-white">
        <CardHeader className="flex items-center justify-between pb-2 relative">
          <CardTitle className="text-sm font-medium">
            Pending Reservations
          </CardTitle>
          <div className="absolute top-0 right-0 p-2 text-white cursor-pointer">
            <span className="relative group">
              <Clock className="h-5 w-5" />
              <div className="absolute top-0 right-0 w-32 p-2 text-xs bg-black text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Reservations that are still pending confirmation
              </div>
            </span>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-4xl font-semibold">
            <span className="animate-counter">{pendingReservations}</span>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Orders Card */}
      <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 bg-gradient-to-r from-green-500 to-teal-400 text-white">
        <CardHeader className="flex items-center justify-between pb-2 relative">
          <CardTitle className="text-sm font-medium">
            Advanced Orders
          </CardTitle>
          <div className="absolute top-0 right-0 p-2 text-white cursor-pointer">
            <span className="relative group">
              <Utensils className="h-5 w-5" />
              <div className="absolute top-0 right-0 w-32 p-2 text-xs bg-black text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Orders placed in advance along with pending or accepted status
              </div>
            </span>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-4xl font-semibold">
            <span className="animate-counter">{advancedOrders}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
