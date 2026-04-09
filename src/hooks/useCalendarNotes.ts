import { useState, useEffect, useCallback } from "react";

export interface RangeNote {
  start: string;
  end: string;
  note: string;
}

export interface CalendarNotes {
  general: string;
  dates: Record<string, string>;
  ranges: RangeNote[];
}

const STORAGE_KEY = "calendar-notes-v2";

function loadNotes(): CalendarNotes {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        general: parsed.general || "",
        dates: parsed.dates || {},
        ranges: parsed.ranges || [],
      };
    }
  } catch {}
  // Migrate old single-textarea notes
  const oldNotes = localStorage.getItem("calendar-notes");
  return {
    general: oldNotes || "",
    dates: {},
    ranges: [],
  };
}

export function useCalendarNotes() {
  const [notes, setNotes] = useState<CalendarNotes>(loadNotes);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const setGeneralNote = useCallback((text: string) => {
    setNotes((prev) => ({ ...prev, general: text }));
  }, []);

  const setDateNote = useCallback((dateKey: string, text: string) => {
    setNotes((prev) => {
      const dates = { ...prev.dates };
      if (text.trim()) {
        dates[dateKey] = text;
      } else {
        delete dates[dateKey];
      }
      return { ...prev, dates };
    });
  }, []);

  const setRangeNote = useCallback((start: string, end: string, text: string) => {
    setNotes((prev) => {
      let ranges = prev.ranges.filter(
        (r) => !(r.start === start && r.end === end)
      );
      if (text.trim()) {
        ranges = [...ranges, { start, end, note: text }];
      }
      return { ...prev, ranges };
    });
  }, []);

  const getDateNote = useCallback(
    (dateKey: string) => notes.dates[dateKey] || "",
    [notes.dates]
  );

  const getRangeNote = useCallback(
    (start: string, end: string) => {
      const found = notes.ranges.find((r) => r.start === start && r.end === end);
      return found?.note || "";
    },
    [notes.ranges]
  );

  /** Returns set of date keys that have a note */
  const datesWithNotes = new Set(Object.keys(notes.dates).filter((k) => notes.dates[k]?.trim()));

  /** Check if a date falls within any range note */
  const getDateRangeIndicators = useCallback(
    (dateKey: string): boolean => {
      const d = new Date(dateKey + "T00:00:00");
      return notes.ranges.some((r) => {
        const s = new Date(r.start + "T00:00:00");
        const e = new Date(r.end + "T00:00:00");
        return d >= s && d <= e && r.note.trim();
      });
    },
    [notes.ranges]
  );

  return {
    notes,
    setGeneralNote,
    setDateNote,
    setRangeNote,
    getDateNote,
    getRangeNote,
    datesWithNotes,
    getDateRangeIndicators,
  };
}
