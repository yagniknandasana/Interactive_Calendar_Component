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
}

function toKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function parseKey(k: string) {
  return new Date(k + "T00:00:00");
}

const CalendarGrid = ({ month, year, dateRange, onDateClick }: CalendarGridProps) => {
  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    // Monday = 0
    let startDow = (firstDay.getDay() + 6) % 7;
    const daysInMonth = lastDay.getDate();

    const result: { day: number; month: number; year: number; current: boolean }[] = [];

    // Previous month fill
    const prevMonth = new Date(year, month, 0);
    for (let i = startDow - 1; i >= 0; i--) {
      result.push({
        day: prevMonth.getDate() - i,
        month: month - 1,
        year: month === 0 ? year - 1 : year,
        current: false,
      });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      result.push({ day: d, month, year, current: true });
    }

    // Next month fill
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
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d, i) => (
          <div
            key={d}
            className={`text-center text-[10px] font-bold tracking-wider pb-1 ${
              i >= 5 ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7">
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

          return (
            <button
              key={idx}
              onClick={() => cell.current && onDateClick(key)}
              className={`
                relative text-center text-xs py-1.5 transition-all duration-150
                ${!cell.current ? "text-muted-foreground/30 cursor-default" : "cursor-pointer hover:scale-110"}
                ${cell.current && isWeekend && !isSelected ? "text-calendar-weekend font-semibold" : ""}
                ${cell.current && !isWeekend && !isSelected && !inRange ? "text-foreground" : ""}
                ${isSelected ? "text-primary-foreground font-bold" : ""}
                ${inRange ? "bg-calendar-range" : ""}
              `}
            >
              {isSelected && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-7 h-7 rounded-full bg-primary animate-[scale-in_0.15s_ease-out]" />
                </span>
              )}
              <span className="relative z-10">{cell.day}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
