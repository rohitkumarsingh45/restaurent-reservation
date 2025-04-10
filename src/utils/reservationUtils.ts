
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

  // Combine the data
  return reservationsData.map((reservation) => {
    const reservationMenuItems = menuItemsData
      .filter((mi) => mi.reservation_id === reservation.id)
      .map((mi) => {
        // Define a type-safe function to extract values
        const getMenuItemProperty = (menuItemsData: any, property: string): any => {
          if (!menuItemsData) return null;
          
          if (Array.isArray(menuItemsData)) {
            return menuItemsData[0] ? menuItemsData[0][property] : null;
          } else {
            return menuItemsData[property];
          }
        };
        
        return {
          id: mi.menu_item_id,
          name: getMenuItemProperty(mi.menu_items, 'name'),
          price: getMenuItemProperty(mi.menu_items, 'price'),
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
 * Updates a reservation's status using multiple methods in sequence
 * until one succeeds
 */
export const updateReservationStatus = async ({ 
  reservation, 
  newStatus 
}: { 
  reservation: any, 
  newStatus: 'accepted' | 'deleted' | 'expired' 
}) => {
  console.log(`Updating reservation ${reservation.id} to status: ${newStatus}`);
  console.log('Current reservation state:', JSON.stringify(reservation, null, 2));
  
  try {
    // Try multiple update methods in sequence until one succeeds
    
    // Method 1: Direct update with eq
    console.log("Method 1: Attempting direct update with .eq");
    const { data, error: updateError } = await supabase
      .from('reservations')
      .update({ status: newStatus })
      .eq('id', reservation.id)
      .select();

    if (updateError) {
      console.error('Method 1 failed:', updateError);
    } else if (data && data.length > 0) {
      console.log('Method 1 succeeded:', data);
      
      // Send email notification if appropriate
      await sendEmailNotification(reservation, newStatus);
      
      return { success: true, data: data[0] };
    } else {
      console.log('Method 1: No records updated');
    }
    
    // Method 2: Try using match
    console.log("Method 2: Attempting update with .match");
    const { data: matchData, error: matchError } = await supabase
      .from('reservations')
      .update({ status: newStatus })
      .match({ id: reservation.id })
      .select();
    
    if (matchError) {
      console.error('Method 2 failed:', matchError);
    } else if (matchData && matchData.length > 0) {
      console.log('Method 2 succeeded:', matchData);
      
      // Send email notification if appropriate
      await sendEmailNotification(reservation, newStatus);
      
      return { success: true, data: matchData[0] };
    } else {
      console.log('Method 2: No records updated');
    }
    
    // Method 3: Try direct SQL via RPC
    console.log("Method 3: Attempting update via RPC");
    const { data: rpcData, error: rpcError } = await supabase.rpc('update_reservation_status', {
      reservation_id: reservation.id,
      new_status: newStatus
    });
    
    if (rpcError) {
      console.error('Method 3 failed:', rpcError);
    } else {
      console.log('Method 3 RPC result:', rpcData);
      
      // Verify the update worked by checking the current status
      const { data: verifyData, error: verifyError } = await supabase
        .from('reservations')
        .select('id, status')
        .eq('id', reservation.id)
        .single();
      
      if (verifyError) {
        console.error('Verification failed:', verifyError);
      } else if (verifyData && verifyData.status === newStatus) {
        console.log('Verification confirmed update:', verifyData);
        
        // Send email notification if appropriate
        await sendEmailNotification(reservation, newStatus);
        
        return { success: true, data: verifyData };
      } else {
        console.log('Verification shows update did not take effect:', verifyData);
      }
    }
    
    // If we reach here, all methods failed
    throw new Error('Failed to update reservation status - all update methods failed');
  } catch (error) {
    console.error('Error in updateReservationStatus:', error);
    throw error;
  }
};

/**
 * Helper function to send email notifications
 */
async function sendEmailNotification(reservation: any, newStatus: 'accepted' | 'deleted' | 'expired') {
  if (newStatus === 'accepted' || newStatus === 'deleted') {
    try {
      console.log('Sending email notification with payload:', {
        customerEmail: reservation.email,
        customerName: reservation.name,
        date: reservation.date,
        tableType: reservation.table_type,
        status: newStatus === 'accepted' ? 'accepted' : 'rejected'
      });
      
      const emailResponse = await supabase.functions.invoke('send-reservation-email', {
        body: {
          customerEmail: reservation.email,
          customerName: reservation.name,
          date: reservation.date,
          tableType: reservation.table_type,
          status: newStatus === 'accepted' ? 'accepted' : 'rejected'
        }
      });
      
      console.log('Email response:', emailResponse);
    } catch (emailError) {
      console.error('Email sending failed but update was successful:', emailError);
      // We don't throw here because the status update was successful
    }
  }
}
