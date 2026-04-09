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
  <div className="flex items-center justify-between px-1 mb-2">
    <button
      onClick={onPrev}
      className="p-1.5 rounded-full transition-all duration-200 text-muted-foreground/50 hover:text-foreground hover:bg-calendar-hover hover:scale-110 active:scale-95"
      aria-label="Previous month"
    >
      <ChevronLeft className="w-3.5 h-3.5" />
    </button>
    <span
      className="text-[10px] font-bold tracking-[0.2em]"
      style={{ color: "hsl(var(--muted-foreground) / 0.55)" }}
    >
      {MONTH_NAMES[month]} {year}
    </span>
    <button
      onClick={onNext}
      className="p-1.5 rounded-full transition-all duration-200 text-muted-foreground/50 hover:text-foreground hover:bg-calendar-hover hover:scale-110 active:scale-95"
      aria-label="Next month"
    >
      <ChevronRight className="w-3.5 h-3.5" />
    </button>
  </div>
);

export default CalendarHeader;
