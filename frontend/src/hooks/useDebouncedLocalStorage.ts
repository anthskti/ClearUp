import { useEffect } from "react";

// Avoid blocking the main thread on every state tick (localStorage is sync). 
export function useDebouncedLocalStorage(
  key: string,
  value: unknown,
  enabled: boolean,
  delayMs = 400,
): void {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    const id = window.setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error(`Failed to persist ${key}`, e);
      }
    }, delayMs);
    return () => window.clearTimeout(id);
  }, [key, value, enabled, delayMs]);
}
