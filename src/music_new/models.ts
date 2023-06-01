export type PitchRegister = 1 | 2| 3 | 4 | 5 | 6 | 7;
export type PitchClass = "A" | "B" | "C" | "D" | "E" | "F" | "G";
export type ScaleDegree = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Accidental = -2 | -1 | 0 | 1 | 2; // negative for flat, positive for sharp

export type NoteDuration = "whole" | "half" | "quarter" | "eighter" | "sixteenth";

export type TimeSignature = "4/4" | "3/4" | "6/8";

// we derive minor key signatures from the major key signature
export type KeySignatureBase = "C" | "G" | "D" | "A" | "E" | "B" | "F#" | "C#" | "F" | "Bb" | "Eb" | "Ab" | "Db" | "Gb" | "Cb";

export interface Pitch {
    scaleDegree: ScaleDegree,
    register: PitchRegister,
    accidental?: Accidental,
}

export interface Chord {
    duration: number,
    pitches: Pitch[],
}

export interface Measure {
    keySignature: string,
    timeSignature: string,
    staffTop: Chord[],
    staffBot: Chord[],
}
