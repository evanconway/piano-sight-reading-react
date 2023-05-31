export interface Pitch {
    scaleDegree: number,
    register: 1 | 2 | 3 | 4 | 5 | 6 | 7,
    accidental?: number,
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

export type TimeSignature = "4/4" | "3/4" | "6/8";

// we'll derive minor key signatures from the major key signature
export type KeySignatureBase = "C" | "G" | "D" | "A" | "E" | "B" | "F#" | "C#" | "F" | "Bb" | "Eb" | "Ab" | "Db" | "Gb" | "Cb";

export type NoteDuration = "whole" | "half" | "quarter" | "eighter" | "sixteenth";
