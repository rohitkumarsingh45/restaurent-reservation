
import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Calendar as CalendarIcon, Users } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getTableTypes, TableType } from '@/services/tableService';
import { createReservation } from '@/services/reservationService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuItemSelection, { SelectedMenuItem } from './MenuItemSelection';

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

  const totalMenuItemsQuantity = selectedMenuItems.reduce((total, item) => total + item.quantity, 0);

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
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="reservation">Reservation Details</TabsTrigger>
                <TabsTrigger value="menu-items" className="relative">
                  Pre-Order Menu
                  {totalMenuItemsQuantity > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalMenuItemsQuantity}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="reservation" className="mt-0">
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
                          className={`table-option ${selectedTable === table.size ? 'selected' : ''} p-4 rounded-lg border cursor-pointer hover:bg-accent transition-colors ${selectedTable === table.size ? 'bg-accent' : ''}`}
                          onClick={() => setSelectedTable(table.size)}
                        >
                          <div className="flex items-center gap-3">
                            <Users className="w-5 h-5" />
                            <div>
                              <p className="font-medium">{table.size}</p>
                              <p className="text-sm text-muted-foreground">Available: {table.quantity}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="special-requests">Special Requests (optional)</Label>
                    <Input
                      id="special-requests"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Any special requests or dietary requirements?"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setActiveTab("menu-items")}
                    >
                      Continue to Pre-Order Menu
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="menu-items" className="mt-0">
                <MenuItemSelection 
                  selectedItems={selectedMenuItems}
                  onUpdateSelectedItems={handleMenuItemsUpdate}
                />
                
                <div className="mt-6 space-y-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mb-2"
                    onClick={() => setActiveTab("reservation")}
                  >
                    Back to Reservation Details
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

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
