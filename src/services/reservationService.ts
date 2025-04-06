
import { supabase } from "@/integrations/supabase/client";
import { SelectedMenuItem } from "@/components/MenuItemSelection";

export interface Reservation {
  date: string;
  table_type: string;
  name: string;
  email: string;
  phone?: string | null;
  special_requests?: string | null;
}

export const createReservation = async (
  reservation: Reservation, 
  selectedMenuItems?: SelectedMenuItem[]
) => {
  // First check if there's already a reservation for this table type at this time
  const { data: existingReservations, error: checkError } = await supabase
    .from('reservations')
    .select('*')
    .eq('table_type', reservation.table_type)
    .eq('date', reservation.date);

  if (checkError) {
    console.error('Error checking existing reservations:', checkError);
    throw checkError;
  }

  if (existingReservations && existingReservations.length > 0) {
    throw new Error('This table type is already reserved for the selected time');
  }

  // If no existing reservation, create new one
  const { data, error } = await supabase
    .from('reservations')
    .insert([reservation])
    .select()
    .single();

  if (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }

  // If there are menu items selected, add them to the reservation_menu_items table
  if (selectedMenuItems && selectedMenuItems.length > 0 && data) {
    const reservationId = data.id;
    
    const menuItemsToInsert = selectedMenuItems.map(item => ({
      reservation_id: reservationId,
      menu_item_id: item.menuItem.id,
      quantity: item.quantity
    }));

    const { error: menuItemError } = await supabase
      .from('reservation_menu_items')
      .insert(menuItemsToInsert);

    if (menuItemError) {
      console.error('Error adding menu items to reservation:', menuItemError);
      // Consider what to do if menu items fail but reservation succeeds
      // For now, we'll still return the reservation data
    }
  }

  return data;
};
