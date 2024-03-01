import { KeySignature, NoteDuration, PitchCap, TimeSignature } from "./music/models";

export const DEFAULT_KEY_SIGNATURE: KeySignature = "C";
export const DEFAULT_TIME_SIGNATURE: TimeSignature = "4/4";
export const DEFAULT_TOP_STAFF_DURATION: NoteDuration = "quarter";
export const DEFAULT_TOP_STAFF_HIGHEST_PITCH: PitchCap = { pitchClass: "A", register: 5 };
export const DEFAULT_TOP_STAFF_LOWEST_PITCH: PitchCap = { pitchClass: "C", register: 4 };
export const DEFAULT_TOP_STAFF_NOTES_PER_CHORD = 2;
export const DEFAULT_BOTTOM_STAFF_DURATION: NoteDuration = "quarter";
export const DEFAULT_BOTTOM_STAFF_HIGHEST_PITCH: PitchCap = { pitchClass: "B", register: 3 };
export const DEFAULT_BOTTOM_STAFF_LOWEST_PITCH: PitchCap = { pitchClass: "E", register: 2 };
export const DEFAULT_BOTTOM_STAFF_NOTES_PER_CHORD = 2;

export const SCORE_ID = "score";

export const SCORE_SCREEN_SIZE_STYLES = {
    DESKTOP: {
        PADDING_X: 40,
        PADDING_BOTTOM: 60,
        SCALE: 1,
    },
    TABLET: {
        SIZE: 800,
        PADDING_X: 30,
        PADDING_BOTTOM: 50,
        SCALE: 0.75,
    },
    PHONE: {
        SIZE: 500,
        PADDING_X: 20,
        PADDING_BOTTOM: 40,
        SCALE: 0.5,
    },
};

export type ReactChildren = string | JSX.Element | JSX.Element[];
