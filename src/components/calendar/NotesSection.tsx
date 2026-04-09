import { useState, useEffect } from "react";

const LINES = 7;

const NotesSection = () => {
  const [notes, setNotes] = useState(() => localStorage.getItem("calendar-notes") || "");

  useEffect(() => {
    localStorage.setItem("calendar-notes", notes);
  }, [notes]);

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-xs font-semibold text-muted-foreground mb-2 tracking-wide">Notes</h3>
      <div className="relative flex-1 min-h-[140px]">
        {/* Notebook lines */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: LINES }).map((_, i) => (
            <div
              key={i}
              className="border-b border-calendar-line"
              style={{ height: `${100 / LINES}%` }}
            />
          ))}
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="absolute inset-0 w-full h-full bg-transparent resize-none text-xs leading-[20px] text-foreground/80 focus:outline-none p-0"
          style={{ lineHeight: `${140 / LINES}px` }}
          placeholder="Write your notes here..."
        />
      </div>
    </div>
  );
};

export default NotesSection;
