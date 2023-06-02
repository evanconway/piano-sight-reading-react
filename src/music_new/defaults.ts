import { KeySignature, NoteDuration, Pitch, TimeSignature } from "./models"

export const DEFAULT_KEY_SIGNATURE: KeySignature = "C";
export const DEFAULT_TIME_SIGNATURE: TimeSignature = "4/4";
export const DEFAULT_TOP_STAFF_DURATION: NoteDuration = "quarter";
export const DEFAULT_TOP_STAFF_HIGHEST_PITCH: Pitch = { scaleDegree: 5, register: 5, accidental: 0 };
export const DEFAULT_TOP_STAFF_LOWEST_PITCH: Pitch = { scaleDegree: 5, register: 5, accidental: 0 };
export const DEFAULT_TOP_STAFF_NOTES_PER_CHORD: number = 2;
export const DEFAULT_BOTTOM_STAFF_DURATION: NoteDuration = "quarter";
export const DEFAULT_BOTTOM_STAFF_HIGHEST_PITCH: Pitch = { scaleDegree: 1, register: 4, accidental: 0 };
export const DEFAULT_BOTTOM_STAFF_LOWEST_PITCH: Pitch = { scaleDegree: 3, register: 2, accidental: 0 };
export const DEFAULT_BOTTOM_STAFF_NOTES_PER_CHORD: number = 2;
