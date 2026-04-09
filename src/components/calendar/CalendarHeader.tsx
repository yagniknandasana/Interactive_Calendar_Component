import { ChevronLeft, ChevronRight } from "lucide-react";

const MONTH_NAMES = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
];

interface CalendarHeaderProps {
  month: number;
  year: number;
  onPrev: () => void;
  onNext: () => void;
}

const CalendarHeader = ({ month, year, onPrev, onNext }: CalendarHeaderProps) => (
  <div className="flex items-center justify-between px-2 mb-1">
    <button
      onClick={onPrev}
      className="p-1.5 rounded-full hover:bg-calendar-hover transition-colors text-muted-foreground hover:text-foreground"
      aria-label="Previous month"
    >
      <ChevronLeft className="w-4 h-4" />
    </button>
    <span className="text-xs font-semibold tracking-widest text-muted-foreground">
      {MONTH_NAMES[month]} {year}
    </span>
    <button
      onClick={onNext}
      className="p-1.5 rounded-full hover:bg-calendar-hover transition-colors text-muted-foreground hover:text-foreground"
      aria-label="Next month"
    >
      <ChevronRight className="w-4 h-4" />
    </button>
  </div>
);

export default CalendarHeader;
