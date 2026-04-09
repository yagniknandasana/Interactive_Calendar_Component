import { useState, useEffect } from "react";

const LINE_COUNT = 8;
const LINE_HEIGHT = 22;

const NotesSection = () => {
  const [notes, setNotes] = useState(() => localStorage.getItem("calendar-notes") || "");

  useEffect(() => {
    localStorage.setItem("calendar-notes", notes);
  }, [notes]);

  const totalHeight = LINE_COUNT * LINE_HEIGHT;

  return (
    <div className="flex flex-col h-full">
      <h3
        className="text-[10px] font-semibold tracking-[0.15em] mb-3"
        style={{ color: "hsl(var(--muted-foreground) / 0.5)" }}
      >
        Notes
      </h3>
      <div className="relative" style={{ height: totalHeight }}>
        {/* Notebook lines */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: LINE_COUNT }).map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 border-b"
              style={{
                top: (i + 1) * LINE_HEIGHT,
                borderColor: "hsl(var(--calendar-line) / 0.6)",
              }}
            />
          ))}
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="absolute inset-0 w-full h-full bg-transparent resize-none text-[11px] focus:outline-none p-0 pt-1 placeholder:text-muted-foreground/30"
          style={{
            lineHeight: `${LINE_HEIGHT}px`,
            color: "hsl(var(--foreground) / 0.65)",
            fontFamily: "inherit",
          }}
          placeholder="Write your notes here..."
        />
      </div>
    </div>
  );
};

export default NotesSection;
