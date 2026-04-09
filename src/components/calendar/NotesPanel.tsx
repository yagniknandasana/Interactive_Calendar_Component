import { useState, useEffect, useRef } from "react";
import { Calendar, FileText, ArrowRight } from "lucide-react";

interface DateRange {
  start: string | null;
  end: string | null;
}

type NoteMode = "general" | "date" | "range";

interface NotesPanelProps {
  dateRange: DateRange;
  generalNote: string;
  dateNote: string;
  rangeNote: string;
  onGeneralChange: (text: string) => void;
  onDateChange: (text: string) => void;
  onRangeChange: (text: string) => void;
}

function formatShort(d: string) {
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const LINE_COUNT = 6;
const LINE_HEIGHT = 22;

const NotesPanel = ({
  dateRange,
  generalNote,
  dateNote,
  rangeNote,
  onGeneralChange,
  onDateChange,
  onRangeChange,
}: NotesPanelProps) => {
  const mode: NoteMode =
    dateRange.start && dateRange.end
      ? "range"
      : dateRange.start
      ? "date"
      : "general";

  const [prevMode, setPrevMode] = useState<NoteMode>(mode);
  const [animating, setAnimating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (mode !== prevMode) {
      setAnimating(true);
      const t = setTimeout(() => {
        setPrevMode(mode);
        setAnimating(false);
      }, 150);
      return () => clearTimeout(t);
    }
  }, [mode, prevMode]);

  const value = mode === "range" ? rangeNote : mode === "date" ? dateNote : generalNote;
  const onChange =
    mode === "range"
      ? onRangeChange
      : mode === "date"
      ? onDateChange
      : onGeneralChange;

  const placeholder =
    mode === "range"
      ? "Write notes for selected range..."
      : mode === "date"
      ? "Write notes for this date..."
      : "General monthly notes...";

  const totalHeight = LINE_COUNT * LINE_HEIGHT;

  return (
    <div className="flex flex-col h-full">
      {/* Mode indicator */}
      <div
        className={`flex items-center gap-1.5 mb-2.5 transition-all duration-200 ${
          animating ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
        }`}
      >
        {mode === "general" && (
          <>
            <FileText className="w-3 h-3" style={{ color: "hsl(var(--muted-foreground) / 0.45)" }} />
            <span
              className="text-[10px] font-semibold tracking-[0.15em]"
              style={{ color: "hsl(var(--muted-foreground) / 0.5)" }}
            >
              Notes
            </span>
          </>
        )}
        {mode === "date" && (
          <>
            <Calendar className="w-3 h-3" style={{ color: "hsl(var(--primary))" }} />
            <span className="text-[10px] font-semibold tracking-wide text-primary">
              {formatShort(dateRange.start!)}
            </span>
          </>
        )}
        {mode === "range" && (
          <>
            <Calendar className="w-3 h-3" style={{ color: "hsl(var(--primary))" }} />
            <span className="text-[10px] font-semibold tracking-wide text-primary flex items-center gap-1">
              {formatShort(dateRange.start!)}
              <ArrowRight className="w-2.5 h-2.5" />
              {formatShort(dateRange.end!)}
            </span>
          </>
        )}
      </div>

      {/* Textarea with notebook lines */}
      <div
        className={`relative transition-all duration-200 ${
          animating ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"
        }`}
        style={{ height: totalHeight }}
      >
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: LINE_COUNT }).map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 border-b"
              style={{
                top: (i + 1) * LINE_HEIGHT,
                borderColor: "hsl(var(--calendar-line) / 0.5)",
              }}
            />
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full bg-transparent resize-none text-[11px] focus:outline-none p-0 pt-1 placeholder:text-muted-foreground/25"
          style={{
            lineHeight: `${LINE_HEIGHT}px`,
            color: "hsl(var(--foreground) / 0.65)",
          }}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default NotesPanel;
