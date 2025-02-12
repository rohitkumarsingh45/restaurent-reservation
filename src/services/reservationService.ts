
import { supabase } from "@/integrations/supabase/client";

export interface Reservation {
  date: string;
  table_type: string;
  name: string;
  email: string;
  phone?: string | null;
  special_requests?: string | null;
}

export const createReservation = async (reservation: Reservation) => {
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

  return data;
};
