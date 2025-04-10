
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
  console.log('Raw reservations data:', JSON.stringify(reservationsData, null, 2));

  // Get all reservation menu items
  const { data: menuItemsData, error: menuItemsError } = await supabase
    .from('reservation_menu_items')
    .select(`
      reservation_id,
      menu_item_id,
      quantity,
      menu_items(id, name, price)
    `);

  if (menuItemsError) {
    console.error('Error fetching menu items:', menuItemsError);
    throw menuItemsError;
  }

  // Log menu items data to help debug structure
  console.log('Menu items data sample:', menuItemsData.length > 0 ? JSON.stringify(menuItemsData[0], null, 2) : 'No menu items');

  // Combine the data
  return reservationsData.map((reservation) => {
    const reservationMenuItems = menuItemsData
      .filter((mi) => mi.reservation_id === reservation.id)
      .map((mi) => {
        // Check the actual structure of menu_items
        console.log(`Menu item structure for reservation ${reservation.id}:`, mi.menu_items);
        
        return {
          id: mi.menu_item_id,
          // Handle menu_items correctly based on whether it's an object or array
          name: Array.isArray(mi.menu_items) 
            ? mi.menu_items[0]?.name 
            : mi.menu_items?.name,
          price: Array.isArray(mi.menu_items) 
            ? mi.menu_items[0]?.price 
            : mi.menu_items?.price,
          quantity: mi.quantity
        };
      });

    return {
      ...reservation,
      status: reservation.status || 'pending',
      menuItems: reservationMenuItems.length > 0 ? reservationMenuItems : undefined
    };
  });
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
  
  // First, update the status in the database
  const { data, error: updateError } = await supabase
    .from('reservations')
    .update({ status: newStatus })
    .eq('id', reservation.id)
    .select();

  if (updateError) {
    console.error('Error updating reservation status:', updateError);
    throw updateError;
  }

  console.log('Update response:', data);

  // Then, send email notification (only for accepted or deleted)
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
    } catch (emailError) {
      console.error('Email sending failed but update was successful:', emailError);
      // We don't throw here because the status update was successful
    }
  }
  
  return { success: true, data };
};
