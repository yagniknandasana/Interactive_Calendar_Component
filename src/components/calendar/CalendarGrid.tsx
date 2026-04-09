import { useMemo } from "react";

const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

interface DateRange {
  start: string | null;
  end: string | null;
}

interface CalendarGridProps {
  month: number;
  year: number;
  dateRange: DateRange;
  onDateClick: (dateStr: string) => void;
  datesWithNotes: Set<string>;
  hasRangeNote: (dateKey: string) => boolean;
}

function toKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function parseKey(k: string) {
  return new Date(k + "T00:00:00");
}

const CalendarGrid = ({ month, year, dateRange, onDateClick, datesWithNotes, hasRangeNote }: CalendarGridProps) => {
  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = (firstDay.getDay() + 6) % 7;
    const daysInMonth = lastDay.getDate();

    const result: { day: number; month: number; year: number; current: boolean }[] = [];

    const prevMonth = new Date(year, month, 0);
    for (let i = startDow - 1; i >= 0; i--) {
      result.push({
        day: prevMonth.getDate() - i,
        month: month - 1,
        year: month === 0 ? year - 1 : year,
        current: false,
      });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      result.push({ day: d, month, year, current: true });
    }

    const remaining = 7 - (result.length % 7);
    if (remaining < 7) {
      for (let d = 1; d <= remaining; d++) {
        result.push({
          day: d,
          month: month + 1,
          year: month === 11 ? year + 1 : year,
          current: false,
        });
      }
    }

    return result;
  }, [month, year]);

  const startDate = dateRange.start ? parseKey(dateRange.start) : null;
  const endDate = dateRange.end ? parseKey(dateRange.end) : null;

  return (
    <div>
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2 border-b border-calendar-line/40 pb-1.5">
        {DAY_LABELS.map((d, i) => (
          <div
            key={d}
            className={`text-center text-[9px] font-bold tracking-[0.12em] ${
              i >= 5 ? "text-primary/80" : "text-muted-foreground/60"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((cell, idx) => {
          const key = toKey(cell.year, cell.month, cell.day);
          const dow = idx % 7;
          const isWeekend = dow >= 5;
          const isStart = dateRange.start === key;
          const isEnd = dateRange.end === key;
          const isSelected = isStart || isEnd;

          let inRange = false;
          if (startDate && endDate && cell.current) {
            const cellDate = parseKey(key);
            inRange = cellDate > startDate && cellDate < endDate;
          }

          const isRangeStart = isStart && dateRange.end;
          const isRangeEnd = isEnd && dateRange.start;

          const hasDateNote = cell.current && datesWithNotes.has(key);
          const hasRangeNoteIndicator = cell.current && hasRangeNote(key);

          return (
            <button
              key={idx}
              onClick={() => cell.current && onDateClick(key)}
              disabled={!cell.current}
              className={`
                relative flex flex-col items-center justify-center h-9 text-[11px] font-medium
                transition-all duration-200 ease-out
                ${!cell.current ? "text-muted-foreground/20 cursor-default" : "cursor-pointer"}
                ${cell.current && !isSelected && !inRange ? "hover:bg-calendar-hover hover:rounded-full hover:scale-110" : ""}
                ${cell.current && isWeekend && !isSelected && !inRange ? "text-calendar-weekend" : ""}
                ${cell.current && !isWeekend && !isSelected && !inRange ? "text-foreground/80" : ""}
                ${inRange ? "bg-calendar-range" : ""}
                ${isRangeStart ? "rounded-l-full" : ""}
                ${isRangeEnd ? "rounded-r-full" : ""}
                ${isSelected ? "z-10" : ""}
              `}
            >
              {isSelected && (
                <span
                  className="absolute w-7 h-7 rounded-full animate-date-pop"
                  style={{
                    background: "linear-gradient(135deg, hsl(207 90% 48%), hsl(207 85% 60%))",
                    boxShadow: "0 2px 10px hsl(207 90% 54% / 0.45), 0 0 0 2px hsl(207 90% 54% / 0.15)",
                  }}
                />
              )}
              <span
                className={`relative z-10 ${isSelected ? "font-bold" : ""}`}
                style={isSelected ? { color: "hsl(0 0% 100%)" } : undefined}
              >
                {cell.day}
              </span>
              {/* Note indicators */}
              {cell.current && !isSelected && (hasDateNote || hasRangeNoteIndicator) && (
                <span className="flex gap-0.5 absolute bottom-0.5 z-10">
                  {hasDateNote && (
                    <span
                      className="w-1 h-1 rounded-full"
                      style={{ background: "hsl(var(--primary))" }}
                    />
                  )}
                  {hasRangeNoteIndicator && (
                    <span
                      className="w-2.5 h-0.5 rounded-full"
                      style={{ background: "hsl(var(--accent) / 0.7)" }}
                    />
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
