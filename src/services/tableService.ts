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

  // Get current active reservations (not deleted)
  const { data: reservations, error: reservationsError } = await supabase
    .from('reservations')
    .select('table_type')
    .in('status', ['pending', 'accepted']); // Only count pending and accepted reservations

  if (reservationsError) {
    console.error('Error fetching reservations:', reservationsError);
    throw reservationsError;
  }

  // Count reservations per table type
  const reservationCounts = reservations.reduce((acc: { [key: string]: number }, reservation) => {
    acc[reservation.table_type] = (acc[reservation.table_type] || 0) + 1;
    return acc;
  }, {});

  // Create a map to deduplicate table types by size
  const uniqueTableTypes = new Map();
  
  // Process each table type and keep only unique sizes
  tableTypes.forEach(table => {
    // If we haven't seen this size before, or if this table has more capacity than the existing one
    if (!uniqueTableTypes.has(table.size) || uniqueTableTypes.get(table.size).quantity < table.quantity) {
      uniqueTableTypes.set(table.size, {
        ...table,
        quantity: Math.max(0, table.quantity - (reservationCounts[table.size] || 0))
      });
    }
  });

  // Convert the Map values back to an array
  return Array.from(uniqueTableTypes.values());
};
