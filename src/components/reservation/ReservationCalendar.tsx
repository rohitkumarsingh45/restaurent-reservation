
import React from 'react';
import { Calendar } from "@/components/ui/calendar";

interface ReservationCalendarProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const ReservationCalendar: React.FC<ReservationCalendarProps> = ({ date, setDate }) => {
  return (
    <div>
      <h3 className="font-medium mb-3">Select Date</h3>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
        disabled={(date) => date < new Date()}
      />
    </div>
  );
};

export default ReservationCalendar;
