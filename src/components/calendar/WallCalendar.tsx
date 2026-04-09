import { useState, useEffect, useCallback, useRef } from "react";
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

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: 0, y: 0 });
  }, []);

  const RINGS = 17;

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformOrigin: "top center" }}
    >
      {/* ─── Wall hook ─── */}
      <div className="relative w-6 h-6 mb-0">
        {/* Nail / screw head */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 35%, hsl(0 0% 82%), hsl(0 0% 55%) 70%, hsl(0 0% 40%))",
            boxShadow: "0 2px 6px rgba(0,0,0,0.35), inset 0 1px 2px rgba(255,255,255,0.4)",
          }}
        />
        {/* Highlight dot */}
        <div
          className="absolute w-2 h-2 rounded-full top-1 left-1.5"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.7), transparent 70%)" }}
        />
      </div>

      {/* ─── Swinging body (string + spiral + card) ─── */}
      <div
        className="flex flex-col items-center w-full transition-transform duration-700 ease-out"
        style={{
          transformOrigin: "top center",
          transform: `rotate(${mousePos.x * 1.2}deg)`,
        }}
      >
      {/* ─── Hanging string ─── */}
      <div
        className="w-[1.5px] h-10"
        style={{
          background: "linear-gradient(to bottom, hsl(30 10% 55%), hsl(30 8% 65%), hsl(30 10% 55%))",
        }}
      />

      {/* ─── Spiral binding ─── */}
      <div className="relative w-full max-w-[460px] z-10 h-5">
        <div className="absolute inset-x-0 flex justify-between px-4 -top-1">
          {Array.from({ length: RINGS }).map((_, i) => (
            <div key={i} className="relative flex flex-col items-center">
              {/* Ring — thin metallic oval */}
              <div
                className="w-[7px] h-[18px] rounded-full"
                style={{
                  background: "linear-gradient(135deg, hsl(0 0% 78%), hsl(0 0% 92%) 40%, hsl(0 0% 68%) 80%)",
                  border: "1px solid hsl(0 0% 60%)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.5)",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ─── Calendar card ─── */}
      <div
        className="relative w-full max-w-[460px] -mt-1 overflow-hidden transition-all duration-500 group"
        style={{
          borderRadius: "0 0 6px 6px",
          background: "hsl(var(--calendar-paper))",
          boxShadow: `
            0 18px 50px -10px hsl(var(--calendar-shadow) / 0.4),
            0 8px 20px -4px hsl(var(--calendar-shadow) / 0.2),
            0 1px 3px 0px hsl(var(--calendar-shadow) / 0.1),
            inset 0 1px 0 hsl(40 40% 96%),
            inset 0 -1px 0 hsl(30 10% 85%)
          `,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
        }}
      >
        {/* Paper edge highlight (top) */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, hsl(40 30% 93%), transparent)" }}
        />

        {/* ─── Hero image ─── */}
        <div className="relative w-full h-[230px] overflow-hidden">
          <img
            src={heroImage}
            alt="Calendar hero"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            width={1024}
            height={640}
          />
          {/* Dark gradient for text readability */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0.35) 100%)",
            }}
          />
          {/* Diagonal blue overlay — sharper angled cut with gradient */}
          <svg
            className="absolute bottom-0 left-0 w-full"
            viewBox="0 0 460 90"
            preserveAspectRatio="none"
            style={{ height: "90px" }}
          >
            <defs>
              <linearGradient id="blueGrad1" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(207, 85%, 38%)" />
                <stop offset="100%" stopColor="hsl(207, 90%, 58%)" />
              </linearGradient>
              <linearGradient id="blueGrad2" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(207, 80%, 52%)" />
                <stop offset="100%" stopColor="hsl(200, 85%, 68%)" />
              </linearGradient>
            </defs>
            {/* Main diagonal shape */}
            <polygon points="0,90 460,90 460,15 320,90 0,55" fill="url(#blueGrad1)" opacity="0.92" />
            {/* Secondary lighter accent */}
            <polygon points="220,90 460,90 460,45 300,90" fill="url(#blueGrad2)" opacity="0.75" />
            {/* Top edge highlight */}
            <line x1="0" y1="55" x2="460" y2="15" stroke="hsl(207, 90%, 70%)" strokeWidth="0.5" opacity="0.5" />
          </svg>

          {/* Month/Year overlay */}
          <div className="absolute bottom-4 right-5 text-right z-10">
            <div
              className="text-sm font-semibold tracking-[0.3em] mb-0.5"
              style={{ color: "hsl(0 0% 100% / 0.9)", textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
            >
              {year}
            </div>
            <div
              className="text-[28px] font-black tracking-[0.15em] leading-none"
              style={{ color: "hsl(0 0% 100%)", textShadow: "0 2px 8px rgba(0,0,0,0.35)" }}
            >
              {MONTH_NAMES[month]}
            </div>
          </div>
        </div>

        {/* ─── Content area ─── */}
        <div className="px-5 py-4">
          <div className="flex flex-col md:flex-row gap-5">
            {/* Notes */}
            <div className="md:w-[33%] w-full md:border-r md:border-calendar-line/60 md:pr-5">
              <NotesSection />
            </div>
            {/* Calendar grid */}
            <div className="md:w-[67%] w-full">
              <CalendarHeader month={month} year={year} onPrev={handlePrev} onNext={handleNext} />
              <CalendarGrid month={month} year={year} dateRange={dateRange} onDateClick={handleDateClick} />
            </div>
          </div>

          {/* Selected range display */}
          {dateRange.start && (
            <div className="mt-4 pt-3 border-t border-calendar-line/50 text-center text-xs text-muted-foreground animate-fade-in">
              <span className="inline-flex items-center gap-1 font-semibold text-primary">
                {formatDate(dateRange.start)}
              </span>
              {dateRange.end && (
                <>
                  <span className="mx-2.5 text-muted-foreground/50">—</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-primary">
                    {formatDate(dateRange.end)}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Paper bottom edge shadow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, hsl(30 10% 80%), transparent)" }}
        />
      </div>
      </div>{/* end swinging body */}
    </div>
  );
};

export default WallCalendar;
