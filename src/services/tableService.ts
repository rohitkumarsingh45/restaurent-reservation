
import { supabase } from "@/integrations/supabase/client";

export interface TableType {
  id: string;
  size: string;
  quantity: number;
}

export const getTableTypes = async (): Promise<TableType[]> => {
  const { data, error } = await supabase
    .from('table_types')
    .select('*');

  if (error) {
    console.error('Error fetching table types:', error);
    throw error;
  }

  return data || [];
};
