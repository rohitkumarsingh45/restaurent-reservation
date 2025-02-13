
import { supabase } from "@/integrations/supabase/client";

export interface TableType {
  id: string;
  size: string;
  quantity: number;
}

export const getTableTypes = async (): Promise<TableType[]> => {
  // First, get all table types
  const { data: tableTypes, error: tableError } = await supabase
    .from('table_types')
    .select('*');

  if (tableError) {
    console.error('Error fetching table types:', tableError);
    throw tableError;
  }

  // Get current reservations
  const { data: reservations, error: reservationsError } = await supabase
    .from('reservations')
    .select('table_type');

  if (reservationsError) {
    console.error('Error fetching reservations:', reservationsError);
    throw reservationsError;
  }

  // Count reservations per table type
  const reservationCounts = reservations.reduce((acc: { [key: string]: number }, reservation) => {
    acc[reservation.table_type] = (acc[reservation.table_type] || 0) + 1;
    return acc;
  }, {});

  // Adjust available quantities
  return tableTypes.map(table => ({
    ...table,
    quantity: Math.max(0, table.quantity - (reservationCounts[table.size] || 0))
  }));
};
