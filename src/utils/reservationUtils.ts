
import { supabase } from '@/lib/supabase';
import { QueryClient } from '@tanstack/react-query';

/**
 * Checks for and updates any expired reservations
 */
export const handleExpiredReservations = async (queryClient: QueryClient) => {
  console.log("Checking for expired reservations...");
  const now = new Date().toISOString();
  
  // Get reservations that need to be expired
  const { data: expiredReservationsData, error: checkError } = await supabase
    .from('reservations')
    .select('id')
    .lt('date', now)
    .in('status', ['pending', 'accepted']);
  
  if (checkError) {
    console.error('Error checking expired reservations:', checkError);
    return;
  }
  
  if (expiredReservationsData && expiredReservationsData.length > 0) {
    console.log(`Found ${expiredReservationsData.length} reservations to expire`);
    
    // Update reservations to expired status
    const { error } = await supabase
      .from('reservations')
      .update({ status: 'expired' })
      .lt('date', now)
      .in('status', ['pending', 'accepted']);
    
    if (error) {
      console.error('Error updating expired reservations:', error);
    } else {
      console.log('Successfully expired reservations');
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    }
  } else {
    console.log('No reservations to expire');
  }
};

/**
 * Fetches all reservations with their associated menu items
 */
export const fetchReservations = async () => {
  console.log("Fetching all reservations...");
  
  // First get all reservations
  const { data: reservationsData, error: reservationsError } = await supabase
    .from('reservations')
    .select('*')
    .order('date', { ascending: true });

  if (reservationsError) {
    console.error('Error fetching reservations:', reservationsError);
    throw reservationsError;
  }

  console.log(`Retrieved ${reservationsData?.length || 0} reservations`);

  // Debug the reservation_menu_items table to check if there's data
  const { data: debugData, error: debugError } = await supabase
    .from('reservation_menu_items')
    .select('*');
    
  if (debugError) {
    console.error('Error checking reservation_menu_items table:', debugError);
  } else {
    console.log(`Debug: reservation_menu_items table has ${debugData?.length || 0} entries`);
    if (debugData && debugData.length > 0) {
      console.log('Sample reservation_menu_items entry:', debugData[0]);
    }
  }

  // Get all reservation menu items with full menu item details
  const { data: menuItemsData, error: menuItemsError } = await supabase
    .from('reservation_menu_items')
    .select(`
      id,
      reservation_id,
      menu_item_id,
      quantity,
      menu_items:menu_item_id (id, name, price)
    `);

  if (menuItemsError) {
    console.error('Error fetching menu items:', menuItemsError);
    throw menuItemsError;
  }

  console.log(`Retrieved ${menuItemsData?.length || 0} menu items`);
  
  // Enhanced logging to debug menu items structure
  if (menuItemsData && menuItemsData.length > 0) {
    console.log('Sample menu item data:', JSON.stringify(menuItemsData[0], null, 2));
  }

  // Combine the data
  const reservationsWithMenuItems = reservationsData.map((reservation) => {
    // Filter menu items for this reservation
    const reservationMenuItems = menuItemsData
      .filter((mi) => mi.reservation_id === reservation.id)
      .map((mi) => {
        // Fix: Extract menu_items correctly from the join
        // Properly type and handle the menu_items object
        const menuItem = mi.menu_items as { id: string; name: string; price: number } | null;
        
        return {
          id: mi.menu_item_id,
          name: menuItem ? menuItem.name : 'Unknown Item',
          price: menuItem ? menuItem.price : 0,
          quantity: mi.quantity || 1
        };
      });

    return {
      ...reservation,
      status: reservation.status || 'pending',
      menuItems: reservationMenuItems.length > 0 ? reservationMenuItems : undefined
    };
  });

  console.log('Processed reservations with menu items sample:', 
    reservationsWithMenuItems.length > 0 ? 
      JSON.stringify(reservationsWithMenuItems[0], null, 2) : 
      'No reservations found'
  );

  return reservationsWithMenuItems;
};

/**
 * Updates a reservation's status
 */
export const updateReservationStatus = async ({ 
  reservation, 
  newStatus 
}: { 
  reservation: any, 
  newStatus: 'accepted' | 'deleted' | 'expired' 
}) => {
  console.log(`Updating reservation ${reservation.id} to status: ${newStatus}`);
  
  // Try direct update first
  const { data, error: updateError } = await supabase
    .from('reservations')
    .update({ status: newStatus })
    .eq('id', reservation.id);
    
  // If error, log and try the RPC call as a fallback
  if (updateError) {
    console.error('Error updating reservation status:', updateError);
    
    // Try RPC call as fallback
    console.log("Attempting update via RPC function");
    const { data: rpcResult, error: rpcError } = await supabase
      .rpc('update_reservation_status', { 
        reservation_id: reservation.id, 
        new_status: newStatus 
      });
    
    if (rpcError) {
      console.error('RPC update failed:', rpcError);
      throw new Error('Failed to update reservation status - no records were affected');
    }
    
    if (rpcResult === false) {
      console.error('RPC update returned false');
      throw new Error('Failed to update reservation status - no records were affected');
    }
    
    console.log('RPC update successful:', rpcResult);
  }

  // Send email notification (only for accepted or deleted)
  if (newStatus === 'accepted' || newStatus === 'deleted') {
    try {
      await supabase.functions.invoke('send-reservation-email', {
        body: {
          customerEmail: reservation.email,
          customerName: reservation.name,
          date: reservation.date,
          tableType: reservation.table_type,
          status: newStatus === 'accepted' ? 'accepted' : 'rejected'
        }
      });
      console.log('Email notification sent successfully');
    } catch (emailError) {
      console.error('Email sending failed but update was successful:', emailError);
      // We don't throw here because the status update was successful
    }
  }
  
  console.log(`Successfully updated reservation to: ${newStatus}`);
  return { success: true, data: { id: reservation.id, status: newStatus } };
};
