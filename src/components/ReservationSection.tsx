import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Calendar as CalendarIcon, Users } from 'lucide-react';

interface TableType {
  id: string;
  seats: number;
  name: string;
}

const tableTypes: TableType[] = [
  { id: '2-seater', seats: 2, name: 'Couple Table' },
  { id: '4-seater', seats: 4, name: 'Family Table' },
  { id: '6-seater', seats: 6, name: 'Group Table' },
];

const ReservationSection = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTable, setSelectedTable] = useState<string>('');
  const { toast } = useToast();

  const handleReservation = () => {
    if (!date || !selectedTable) {
      toast({
        title: "Incomplete Reservation",
        description: "Please select both a date and table type.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Reservation Successful!",
      description: `Your table has been reserved for ${date.toLocaleDateString()}`,
    });
  };

  return (
    <section className="py-12 px-4 bg-secondary/50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-8">
          <CalendarIcon className="w-6 h-6" />
          <h2 className="text-3xl font-semibold text-center">Make a Reservation</h2>
        </div>

        <Card className="reservation-card">
          <CardHeader>
            <CardTitle>Book Your Table</CardTitle>
            <CardDescription>Select your preferred date and table type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-medium mb-3">Select Date</h3>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />
              </div>

              <div>
                <h3 className="font-medium mb-3">Select Table Type</h3>
                <div className="space-y-4">
                  {tableTypes.map((table) => (
                    <div
                      key={table.id}
                      className={`table-option ${selectedTable === table.id ? 'selected' : ''}`}
                      onClick={() => setSelectedTable(table.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5" />
                        <div>
                          <p className="font-medium">{table.name}</p>
                          <p className="text-sm text-muted-foreground">{table.seats} People</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button 
              className="w-full mt-6" 
              size="lg"
              onClick={handleReservation}
            >
              Confirm Reservation
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ReservationSection;