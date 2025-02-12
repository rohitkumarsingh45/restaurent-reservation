
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import ReservationSection from '../ReservationSection';
import { createReservation } from '@/services/reservationService';
import { getTableTypes } from '@/services/tableService';

// Mock the services
vi.mock('@/services/reservationService');
vi.mock('@/services/tableService');

// Mock the toast component
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('ReservationSection', () => {
  const mockTableTypes = [
    { id: '1', size: 'Table for 2', quantity: 5 },
    { id: '2', size: 'Table for 4', quantity: 3 },
  ];

  beforeEach(() => {
    (getTableTypes as any).mockResolvedValue(mockTableTypes);
  });

  it('renders the reservation form', async () => {
    render(<ReservationSection />);
    
    await waitFor(() => {
      expect(screen.getByText('Make a Reservation')).toBeInTheDocument();
    });
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('submits reservation successfully', async () => {
    (createReservation as any).mockResolvedValue({ id: '123' });
    
    render(<ReservationSection />);
    
    await waitFor(() => {
      expect(screen.getByText('Make a Reservation')).toBeInTheDocument();
    });

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    });
    
    // Select a table type
    const tableOption = await screen.findByText('Table for 2');
    fireEvent.click(tableOption);
    
    // Submit the form
    fireEvent.click(screen.getByText('Confirm Reservation'));
    
    await waitFor(() => {
      expect(createReservation).toHaveBeenCalled();
    });
  });

  it('displays error message when reservation fails', async () => {
    (createReservation as any).mockRejectedValue(
      new Error('Reservation failed')
    );
    
    render(<ReservationSection />);
    
    await waitFor(() => {
      expect(screen.getByText('Make a Reservation')).toBeInTheDocument();
    });

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    });
    
    // Select a table type
    const tableOption = await screen.findByText('Table for 2');
    fireEvent.click(tableOption);
    
    // Submit the form
    fireEvent.click(screen.getByText('Confirm Reservation'));
    
    await waitFor(() => {
      expect(screen.getByText(/reservation failed/i)).toBeInTheDocument();
    });
  });
});
