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

  // Get all menu items to use for lookups
  const { data: allMenuItems, error: menuError } = await supabase
    .from('menu_items')
    .select('id, name, price');
    
  if (menuError) {
    console.error('Error fetching all menu items:', menuError);
    console.log('Continuing without menu items data');
  } else {
    console.log(`Retrieved ${allMenuItems?.length || 0} menu items for lookup`);
    if (allMenuItems && allMenuItems.length > 0) {
      console.log('Sample menu item:', allMenuItems[0]);
    }
  }

  // Create a lookup map for menu items by ID for faster access
  const menuItemsMap = new Map();
  if (allMenuItems) {
    allMenuItems.forEach(item => {
      menuItemsMap.set(item.id, item);
    });
    console.log(`Created lookup map with ${menuItemsMap.size} menu items`);
  }

  // Get all reservation menu items
  const { data: reservationMenuItems, error: reservationMenuItemsError } = await supabase
    .from('reservation_menu_items')
    .select('*');

  if (reservationMenuItemsError) {
    console.error('Error fetching reservation menu items:', reservationMenuItemsError);
    throw reservationMenuItemsError;
  }

  console.log(`Retrieved ${reservationMenuItems?.length || 0} reservation menu items`);
  
  if (reservationMenuItems && reservationMenuItems.length > 0) {
    console.log('Sample reservation menu item:', reservationMenuItems[0]);
  }

  // Combine the data
  const reservationsWithMenuItems = reservationsData.map((reservation) => {
    // Filter menu items for this reservation
    const menuItemsForThisReservation = reservationMenuItems
      .filter((mi) => mi.reservation_id === reservation.id)
      .map((mi) => {
        // Look up the menu item details using our map
        const menuItem = menuItemsMap.get(mi.menu_item_id);
        
        if (menuItem) {
          return {
            id: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: mi.quantity || 1
          };
        } else {
          console.log(`Menu item not found for ID: ${mi.menu_item_id}`);
          // Fallback for missing menu items
          return {
            id: mi.menu_item_id,
            name: 'Unknown Item',
            price: 0,
            quantity: mi.quantity || 1
          };
        }
      });

    return {
      ...reservation,
      status: reservation.status || 'pending',
      menuItems: menuItemsForThisReservation.length > 0 ? menuItemsForThisReservation : undefined
    };
  });

  console.log('Processed reservations with menu items:');
  if (reservationsWithMenuItems.length > 0) {
    const sampleReservation = reservationsWithMenuItems[0];
    console.log('Sample reservation:', {
      id: sampleReservation.id,
      name: sampleReservation.name,
      status: sampleReservation.status,
      hasMenuItems: !!sampleReservation.menuItems,
      menuItemsCount: sampleReservation.menuItems?.length || 0
    });
    
    if (sampleReservation.menuItems && sampleReservation.menuItems.length > 0) {
      console.log('Sample menu items:', sampleReservation.menuItems);
    }
  }

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
