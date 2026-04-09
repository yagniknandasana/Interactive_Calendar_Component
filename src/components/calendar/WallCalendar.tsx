import { useState, useEffect, useCallback } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import NotesSection from "./NotesSection";
import heroImage from "@/assets/calendar-hero.jpg";

const MONTH_NAMES = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
];

interface DateRange {
  start: string | null;
  end: string | null;
}

function loadRange(): DateRange {
  try {
    const raw = localStorage.getItem("calendar-range");
    if (raw) return JSON.parse(raw);
  } catch {}
  return { start: null, end: null };
}

const WallCalendar = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [dateRange, setDateRange] = useState<DateRange>(loadRange);

  useEffect(() => {
    localStorage.setItem("calendar-range", JSON.stringify(dateRange));
  }, [dateRange]);

  const handlePrev = useCallback(() => {
    setMonth((m) => {
      if (m === 0) { setYear((y) => y - 1); return 11; }
      return m - 1;
    });
  }, []);

  const handleNext = useCallback(() => {
    setMonth((m) => {
      if (m === 11) { setYear((y) => y + 1); return 0; }
      return m + 1;
    });
  }, []);

  const handleDateClick = useCallback((key: string) => {
    setDateRange((prev) => {
      if (!prev.start || (prev.start && prev.end)) {
        return { start: key, end: null };
      }
      // Ensure start < end
      if (key < prev.start) {
        return { start: key, end: prev.start };
      }
      return { ...prev, end: key };
    });
  }, []);

  const formatDate = (d: string) => {
    const date = new Date(d + "T00:00:00");
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Spiral rings
  const RINGS = 15;

  return (
    <div className="flex flex-col items-center">
      {/* Hook */}
      <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/40 mb-0" />
      {/* String */}
      <div className="w-px h-8 bg-muted-foreground/30" />

      {/* Spiral binding */}
      <div className="relative w-full max-w-[440px] z-10">
        <div className="flex justify-between px-6">
          {Array.from({ length: RINGS }).map((_, i) => (
            <div key={i} className="relative">
              <div className="w-3 h-5 border-2 border-muted-foreground/30 rounded-full bg-background" />
            </div>
          ))}
        </div>
      </div>

      {/* Calendar card */}
      <div
        className="relative w-full max-w-[440px] -mt-3 bg-calendar-paper rounded-b-lg overflow-hidden transition-shadow duration-300 hover:shadow-2xl"
        style={{
          boxShadow: "0 12px 40px -8px hsl(var(--calendar-shadow) / 0.35), 0 4px 12px -2px hsl(var(--calendar-shadow) / 0.15)",
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='4' height='4' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='4' height='4' fill='%23f8f6f0'/%3E%3Crect width='1' height='1' fill='%23f0ece4' opacity='0.3'/%3E%3C/svg%3E\")",
        }}
      >
        {/* Hero image */}
        <div className="relative w-full h-[220px] overflow-hidden">
          <img
            src={heroImage}
            alt="Calendar hero"
            className="w-full h-full object-cover"
            width={1024}
            height={640}
          />
          {/* Diagonal blue overlay */}
          <svg
            className="absolute bottom-0 left-0 w-full"
            viewBox="0 0 440 80"
            preserveAspectRatio="none"
            style={{ height: "80px" }}
          >
            <polygon points="0,80 440,80 440,20 300,80 0,50" fill="hsl(207, 90%, 54%)" opacity="0.9" />
            <polygon points="200,80 440,80 440,50 280,80" fill="hsl(207, 85%, 62%)" opacity="0.7" />
          </svg>
          {/* Month/Year overlay */}
          <div className="absolute bottom-3 right-4 text-right z-10">
            <div className="text-primary-foreground text-sm font-medium tracking-widest">{year}</div>
            <div className="text-primary-foreground text-2xl font-black tracking-wider leading-none">
              {MONTH_NAMES[month]}
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="p-4 pt-3">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Notes */}
            <div className="md:w-[35%] w-full border-r-0 md:border-r border-calendar-line md:pr-4">
              <NotesSection />
            </div>
            {/* Calendar grid */}
            <div className="md:w-[65%] w-full">
              <CalendarHeader month={month} year={year} onPrev={handlePrev} onNext={handleNext} />
              <CalendarGrid month={month} year={year} dateRange={dateRange} onDateClick={handleDateClick} />
            </div>
          </div>

          {/* Selected range display */}
          {dateRange.start && (
            <div className="mt-3 pt-3 border-t border-calendar-line text-center text-xs text-muted-foreground">
              <span className="font-medium text-primary">{formatDate(dateRange.start)}</span>
              {dateRange.end && (
                <>
                  <span className="mx-2">→</span>
                  <span className="font-medium text-primary">{formatDate(dateRange.end)}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WallCalendar;
