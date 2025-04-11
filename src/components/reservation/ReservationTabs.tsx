import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ReservationCalendar from './ReservationCalendar';
import TableSelection from './TableSelection';
import ReservationForm from './ReservationForm';
import MenuItemSelection, { SelectedMenuItem } from '../MenuItemSelection';
import { TableType } from '@/services/tableService';

interface ReservationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  tableTypes: TableType[];
  selectedTable: string;
  setSelectedTable: (table: string) => void;
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  specialRequests: string;
  setSpecialRequests: (value: string) => void;
  selectedMenuItems: SelectedMenuItem[];
  handleMenuItemsUpdate: (items: SelectedMenuItem[]) => void;
}

const ReservationTabs: React.FC<ReservationTabsProps> = ({
  activeTab,
  setActiveTab,
  date,
  setDate,
  tableTypes,
  selectedTable,
  setSelectedTable,
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  specialRequests,
  setSpecialRequests,
  selectedMenuItems,
  handleMenuItemsUpdate,
}) => {
  const totalMenuItemsQuantity = selectedMenuItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2 mb-6 bg-gradient-to-r from-primary to-secondary p-2 rounded-lg shadow-lg">
        <TabsTrigger 
          value="reservation" 
          className="text-lg font-semibold text-white hover:text-primary transition-colors duration-300 py-2 px-4 rounded-lg cursor-pointer"
        >
          Reservation Details
        </TabsTrigger>
        <TabsTrigger 
          value="menu-items" 
          className="relative text-lg font-semibold text-white hover:text-primary transition-colors duration-300 py-2 px-4 rounded-lg cursor-pointer"
        >
          Pre-Order Menu
          {totalMenuItemsQuantity > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalMenuItemsQuantity}
            </span>
          )}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="reservation" className="mt-6 p-6 bg-white rounded-xl shadow-lg">
        <div className="grid gap-6 md:grid-cols-2">
          <ReservationCalendar date={date} setDate={setDate} />
          <TableSelection 
            tableTypes={tableTypes} 
            selectedTable={selectedTable} 
            setSelectedTable={setSelectedTable} 
          />
        </div>

        <ReservationForm 
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          phone={phone}
          setPhone={setPhone}
          specialRequests={specialRequests}
          setSpecialRequests={setSpecialRequests}
          onContinue={() => setActiveTab("menu-items")}
        />
      </TabsContent>
      
      <TabsContent value="menu-items" className="mt-6 p-6 bg-white rounded-xl shadow-lg">
        <MenuItemSelection 
          selectedItems={selectedMenuItems}
          onUpdateSelectedItems={handleMenuItemsUpdate}
        />
        
        <div className="mt-6 space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full mb-2 border-primary text-primary hover:bg-primary/10 transition-colors duration-300"
            onClick={() => setActiveTab("reservation")}
          >
            Back to Reservation Details
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ReservationTabs;
