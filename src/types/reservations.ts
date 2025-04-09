
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Reservation {
  id: string;
  created_at: string;
  date: string;
  table_type: string;
  name: string;
  email: string;
  phone?: string;
  special_requests?: string;
  status: 'pending' | 'accepted' | 'deleted' | 'expired';
}

export interface ReservationWithMenuItems extends Reservation {
  menuItems?: MenuItem[];
}

export type ReservationStatus = 'pending' | 'accepted' | 'deleted' | 'expired';

export interface UpdateReservationStatusParams {
  reservation: Reservation;
  newStatus: 'accepted' | 'deleted' | 'expired';
}

export interface UseReservationsReturn {
  activeTab: ReservationStatus;
  setActiveTab: (tab: ReservationStatus) => void;
  reservations: ReservationWithMenuItems[] | undefined;
  filteredReservations: ReservationWithMenuItems[];
  isLoading: boolean;
  error: unknown;
  updateReservationStatus: any; // Using any for the mutation return type to match original
  refetch: () => Promise<any>;
}
