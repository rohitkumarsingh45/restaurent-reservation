import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CalendarDays, UtensilsCrossed } from "lucide-react";
import ReservationCalendar from './ReservationCalendar';
import TableSelection from './TableSelection';
import ReservationForm from './ReservationForm';
import MenuItemSelection, { SelectedMenuItem } from '../MenuItemSelection';
import { TableType } from '@/services/tableService';

export interface ReservationTabsProps {
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

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-secondary/30">
        <TabsTrigger 
          value="reservation" 
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200 flex items-center gap-2"
        >
          <CalendarDays className="w-4 h-4" />
          Reservation Details
        </TabsTrigger>
        <TabsTrigger 
          value="menu-items" 
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200 flex items-center gap-2 relative"
        >
          <UtensilsCrossed className="w-4 h-4" />
          Pre-Order Menu
          {totalMenuItemsQuantity > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-background">
              {totalMenuItemsQuantity}
            </span>
          )}
        </TabsTrigger>
      </TabsList>
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={tabVariants}
        transition={{ duration: 0.3 }}
      >
        <TabsContent value="reservation" className="mt-0 space-y-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-card rounded-lg p-4 border-2">
              <ReservationCalendar date={date} setDate={setDate} />
            </div>
            <div className="bg-card rounded-lg p-4 border-2">
              <TableSelection 
                tableTypes={tableTypes} 
                selectedTable={selectedTable} 
                setSelectedTable={setSelectedTable} 
              />
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border-2">
            <ReservationForm 
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              specialRequests={specialRequests}
              setSpecialRequests={setSpecialRequests}
              onContinue={() => setActiveTab('menu-items')}
            />
          </div>
        </TabsContent>

        <TabsContent value="menu-items" className="mt-0">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={tabVariants}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-lg p-6 border-2"
          >
            <MenuItemSelection
              selectedItems={selectedMenuItems}
              onUpdate={handleMenuItemsUpdate}
            />
          </motion.div>
        </TabsContent>
      </motion.div>
    </Tabs>
  );
};

export default ReservationTabs;
