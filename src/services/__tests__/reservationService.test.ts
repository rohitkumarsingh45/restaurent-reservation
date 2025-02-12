
import { createReservation } from '../reservationService';
import { supabase } from '@/integrations/supabase/client';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      eq: vi.fn(),
    })),
  },
}));

describe('reservationService', () => {
  const mockReservation = {
    date: '2024-03-20T18:00:00.000Z',
    table_type: 'Table for 2',
    name: 'John Doe',
    email: 'john@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a reservation when table is available', async () => {
    // Mock no existing reservations
    const mockSelect = vi.fn().mockResolvedValue({ data: [], error: null });
    const mockInsert = vi.fn().mockResolvedValue({
      data: { ...mockReservation, id: '123' },
      error: null,
    });

    (supabase.from as any).mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            then: mockSelect,
          }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: () => mockInsert(),
        }),
      }),
    }));

    const result = await createReservation(mockReservation);
    expect(result).toEqual(expect.objectContaining(mockReservation));
  });

  it('should throw error when table is already booked', async () => {
    // Mock existing reservation
    const mockSelect = vi.fn().mockResolvedValue({
      data: [{ id: '123', ...mockReservation }],
      error: null,
    });

    (supabase.from as any).mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            then: mockSelect,
          }),
        }),
      }),
    }));

    await expect(createReservation(mockReservation)).rejects.toThrow(
      'This table type is already reserved for the selected time'
    );
  });
});
