import { useState, useEffect } from "react";

export interface ClientNote {
  title: string;
  description: string;
}

export interface ClientNotes {
  morning: ClientNote[];
  evening: ClientNote[];
}

const NOTES_STORAGE_KEY = "builder-notes";

const DEFAULT_NOTES: ClientNotes = {
  morning: [
    {
      title: "Cleanse",
      description: "Wash face with warm water. Use cleanser if you have oily skin.",
    },
    {
      title: "Sunscreen (Crucial)",
      description: "Apply generously as the final step.",
    },
  ],
  evening: [
    {
      title: "Cleanse",
      description: "Wash face with warm water. Use cleanser if you have oily skin.",
    },
    {
      title: "Moisturize",
      description: "Apply generously as the final step.",
    },
  ],
};

export const useBuilderNotes = () => {
  const [notes, setNotes] = useState<ClientNotes>(DEFAULT_NOTES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
      if (savedNotes) {
        try {
          const parsed = JSON.parse(savedNotes);
          setNotes(parsed);
        } catch (e) {
          console.error("Failed to parse saved notes", e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    }
  }, [notes, isLoaded]);

  const updateNote = (
    timeOfDay: "morning" | "evening",
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    setNotes((prev) => ({
      ...prev,
      [timeOfDay]: prev[timeOfDay].map((note, i) =>
        i === index ? { ...note, [field]: value } : note
      ),
    }));
  };

  const addNote = (timeOfDay: "morning" | "evening") => {
    setNotes((prev) => ({
      ...prev,
      [timeOfDay]: [
        ...prev[timeOfDay],
        { title: "New Note", description: "" },
      ],
    }));
  };

  const removeNote = (timeOfDay: "morning" | "evening", index: number) => {
    setNotes((prev) => ({
      ...prev,
      [timeOfDay]: prev[timeOfDay].filter((_, i) => i !== index),
    }));
  };

  const clearNotes = () => {
    setNotes(DEFAULT_NOTES);
    if (typeof window !== "undefined") {
      localStorage.removeItem(NOTES_STORAGE_KEY);
    }
  };

  const loadNotesFromJson = (notesJson: string) => {
    try {
      const parsed = JSON.parse(notesJson);
      setNotes(parsed);
      if (typeof window !== "undefined") {
        localStorage.setItem(NOTES_STORAGE_KEY, notesJson);
      }
    } catch (e) {
      console.error("Failed to parse notes JSON", e);
    }
  };

  return {
    notes,
    isLoaded,
    updateNote,
    addNote,
    removeNote,
    clearNotes,
    loadNotesFromJson,
  };
};

