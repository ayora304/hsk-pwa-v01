import { useSyncExternalStore } from 'react';
import { emptyLearningState, readLearningState, type LearningState } from './learningState';
const KEY = 'hsk-learning-v1';
let state: LearningState = emptyLearningState();
let storageError = '';
let damaged = false;
try { state = readLearningState(localStorage.getItem(KEY)); } catch (error) { damaged = true; storageError = error instanceof Error ? error.message : 'Device storage unavailable.'; }
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(listener => listener());
export function updateLearning(update: (current: LearningState) => LearningState) {
  if (damaged) throw new Error(storageError);
  const next = update(state);
  // Persist first: a failed write must never be presented as a successful save.
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { storageError = 'Device storage is full or unavailable. Export a backup before continuing.'; emit(); throw new Error(storageError); }
  state = next; storageError = ''; emit();
}
window.addEventListener('storage', event => { if (event.key === KEY) { try { state = readLearningState(event.newValue); storageError = ''; damaged = false; } catch { storageError = 'Saved data changed but could not be read.'; damaged = true; } emit(); } });
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
export function useLearning() { return useSyncExternalStore(subscribe, () => state); }
export function useStorageError() { return useSyncExternalStore(subscribe, () => storageError); }
export function saveError(error: unknown) { return error instanceof Error ? error.message : 'Could not save your changes.'; }
export const newId = () => crypto.randomUUID();
