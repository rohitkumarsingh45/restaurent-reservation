
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Calendar as CalendarIcon } from 'lucide-react';
import { getTableTypes, TableType } from '@/services/tableService';
import { createReservation } from '@/services/reservationService';
import { SelectedMenuItem } from './MenuItemSelection';
import { ReservationTabs } from './reservation';

const ReservationSection = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableTypes, setTableTypes] = useState<TableType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMenuItems, setSelectedMenuItems] = useState<SelectedMenuItem[]>([]);
  const [activeTab, setActiveTab] = useState("reservation");
  const { toast } = useToast();

  useEffect(() => {
    const fetchTableTypes = async () => {
      try {
        const types = await getTableTypes();
        setTableTypes(types);
      } catch (error) {
        console.error('Error fetching table types:', error);
        toast({
          title: "Error",
          description: "Failed to load table types. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTableTypes();
  }, [toast]);

  const handleReservation = async () => {
    if (!date || !selectedTable || !name || !email) {
      toast({
        title: "Incomplete Reservation",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createReservation(
        {
          date: date.toISOString(),
          table_type: selectedTable,
          name,
          email,
          phone: phone || null,
          special_requests: specialRequests || null,
        },
        selectedMenuItems.length > 0 ? selectedMenuItems : undefined
      );

      const menuItemsMessage = selectedMenuItems.length > 0
        ? ` with ${selectedMenuItems.reduce((total, item) => total + item.quantity, 0)} pre-ordered items`
        : '';

      toast({
        title: "Reservation Successful!",
        description: `Your table has been reserved for ${date.toLocaleDateString()}${menuItemsMessage}`,
      });

      // Reset form
      setDate(new Date());
      setSelectedTable('');
      setName('');
      setEmail('');
      setPhone('');
      setSpecialRequests('');
      setSelectedMenuItems([]);
      setActiveTab("reservation");
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast({
        title: "Reservation Failed",
        description: error instanceof Error ? error.message : "There was an error creating your reservation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMenuItemsUpdate = (items: SelectedMenuItem[]) => {
    setSelectedMenuItems(items);
  };

  if (isLoading) {
    return (
      <section className="py-12 px-4 bg-secondary/50">
        <div className="max-w-4xl mx-auto text-center">
          Loading available tables...
        </div>
      </section>
    );
  }

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
            <CardDescription>Select your preferred date, table type, and optionally pre-order from our menu</CardDescription>
          </CardHeader>
          <CardContent>
            <ReservationTabs 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              date={date}
              setDate={setDate}
              tableTypes={tableTypes}
              selectedTable={selectedTable}
              setSelectedTable={setSelectedTable}
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              specialRequests={specialRequests}
              setSpecialRequests={setSpecialRequests}
              selectedMenuItems={selectedMenuItems}
              handleMenuItemsUpdate={handleMenuItemsUpdate}
            />

            <Button 
              className="w-full mt-6" 
              size="lg"
              onClick={handleReservation}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Confirming...' : 'Confirm Reservation'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ReservationSection;
