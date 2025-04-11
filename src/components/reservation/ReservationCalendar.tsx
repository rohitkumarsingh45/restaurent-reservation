import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays } from 'lucide-react';

interface ReservationCalendarProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const ReservationCalendar: React.FC<ReservationCalendarProps> = ({ date, setDate }) => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden font-sans">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1470&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-6">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6 text-white">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <CalendarDays className="w-7 h-7 text-yellow-400" />
            </div>
            <h1 className="text-3xl font-semibold mb-1">Book a Table</h1>
            <p className="text-sm text-white/70">
              Select your preferred date to enjoy our world-class dining.
            </p>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-xl p-3 shadow-md text-black mb-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"
              disabled={(d) => d < new Date()}
            />
          </div>

          {/* Confirm Button */}
          <div className="text-center">
            <button
              className="px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-xl transition-all duration-200 shadow-md"
              disabled={!date}
            >
              {date ? 'Confirm Reservation' : 'Select a Date'}
            </button>
            <p className="text-xs text-white/60 mt-4">
              * We accept bookings up to 30 days in advance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationCalendar;
