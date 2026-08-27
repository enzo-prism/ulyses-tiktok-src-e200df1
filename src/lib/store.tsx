"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { applyAction, SEED_STATE, STORAGE_KEY, type EngineAction, type EngineState } from "@/lib/engine";

interface StoreValue {
  state: EngineState;
  hydrated: boolean;
  error: string | null;
  dispatch: (action: EngineAction) => void;
  reset: () => void;
  clearError: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function readLocalState(): EngineState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as EngineState;
    if (!parsed?.assets || !parsed?.cuts || !parsed?.posts || !parsed?.meta) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<EngineState>(SEED_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = readLocalState();
    if (saved) setState(saved);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    void fetch("/api/store", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(state),
    }).catch(() => undefined);
  }, [hydrated, state]);

  const dispatch = useCallback((action: EngineAction) => {
    setError(null);
    setState((current) => {
      try {
        return applyAction(current, action);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "That action failed.");
        return current;
      }
    });
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setState(SEED_STATE);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ state, hydrated, error, dispatch, reset, clearError: () => setError(null) }),
    [state, hydrated, error, dispatch, reset],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useEngine() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useEngine must be used inside StoreProvider.");
  return value;
}
