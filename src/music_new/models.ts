export type PitchRegister = 1 | 2| 3 | 4 | 5 | 6 | 7;
export type ScaleDegree = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Accidental = -2 | -1 | 0 | 1 | 2; // negative for flat, positive for sharp
export type PitchClass = "C" | "D" | "E" | "F" | "G" | "A" | "B";

export type NoteDuration = "whole" | "half" | "quarter" | "eighth" | "sixteenth";

export type TimeSignature = "4/4" | "3/4" | "6/8";

const EIGHTH_BASE = 12;

export const getMeasureSize = (timeSignature: TimeSignature) => {
    if (timeSignature === "3/4") return EIGHTH_BASE * 2 * 3;
    if (timeSignature === "4/4") return EIGHTH_BASE * 2 * 4;
    if (timeSignature === "6/8") return EIGHTH_BASE * 6;
    return 0;
};

export const getNoteDurationValue = (noteDuration: NoteDuration) => {
    // I have genuinely forgotten so much about music, I can't remember if this remains true for all time signatures, review later
    if (noteDuration === "sixteenth") return EIGHTH_BASE / 2;
    if (noteDuration === "eighth") return EIGHTH_BASE;
    if (noteDuration === "quarter") return EIGHTH_BASE * 2;
    if (noteDuration === "half") return EIGHTH_BASE * 4;
    if (noteDuration === "whole") return EIGHTH_BASE * 8;
    return 0;
};

export type KeySignature = 
"C" |
"G" |
"D" |
"A" |
"E" |
"B" |
"F#" |
"C#" |
"F" |
"Bb" |
"Eb" |
"Ab" |
"Db" |
"Gb" |
"Cb" |
"Am" |
"Em" |
"Bm" |
"F#m" |
"C#m" |
"G#m" |
"D#m" |
"A#m" |
"Dm" |
"Gm" |
"Cm" |
"Fm" |
"Bbm" |
"Ebm" |
"Abm";

export interface Pitch {
    scaleDegree: ScaleDegree,
    register: PitchRegister,
    accidental: Accidental,
}

export interface Chord {
    duration: NoteDuration,
    pitches: Pitch[],
}

export interface Measure {
    keySignature: KeySignature,
    timeSignature: TimeSignature,
    staffTop: (Chord | null)[],
    staffBottom: (Chord | null)[],
}



//A mapping of key signatures to a mapping of scale degrees to base midi values.
export const KeyScaleMidiMap = new Map<KeySignature, Map<ScaleDegree, { m: number, c: PitchClass }>>();

KeyScaleMidiMap.set("C", new Map([[1, {m: 0, c: "C"}], [2, {m: 2, c: "D"}], [3, {m: 4, c: "E"}], [4, {m: 5, c: "F"}], [5, {m: 7, c: "G"}], [6, {m: 9, c: "A"}], [7, {m: 11, c: "B"}]]));
KeyScaleMidiMap.set("G", new Map([[1, {m: 7, c: "G"}], [2, {m: 9, c: "A"}], [3, {m: 11, c: "B"}], [4, {m: 0, c: "C"}], [5, {m: 2, c: "D"}], [6, {m: 4, c: "E"}], [7, {m: 6, c: "F"}]]));
KeyScaleMidiMap.set("D", new Map([[1, {m: 2, c: "D"}], [2, {m: 4, c: "E"}], [3, {m: 6, c: "F"}], [4, {m: 7, c: "G"}], [5, {m: 9, c: "A"}], [6, {m: 11, c: "B"}], [7, {m: 1, c: "C"}]]));
KeyScaleMidiMap.set("A", new Map([[1, {m: 9, c: "A"}], [2, {m: 11, c: "B"}], [3, {m: 1, c: "C"}], [4, {m: 2, c: "D"}], [5, {m: 4, c: "E"}], [6, {m: 6, c: "F"}], [7, {m: 8, c: "G"}]]));
KeyScaleMidiMap.set("E", new Map([[1, {m: 4, c: "E"}], [2, {m: 6, c: "F"}], [3, {m: 8, c: "G"}], [4, {m: 9, c: "A"}], [5, {m: 11, c: "B"}], [6, {m: 1, c: "C"}], [7, {m: 3, c: "D"}]]));
KeyScaleMidiMap.set("B", new Map([[1, {m: 11, c: "B"}], [2, {m: 1, c: "C"}], [3, {m: 3, c: "D"}], [4, {m: 4, c: "E"}], [5, {m: 6, c: "F"}], [6, {m: 8, c: "G"}], [7, {m: 10, c: "A"}]]));
KeyScaleMidiMap.set("F#", new Map([[1, {m: 6, c: "F"}], [2, {m: 8, c: "G"}], [3, {m: 10, c: "A"}], [4, {m: 11, c: "B"}], [5, {m: 1, c: "C"}], [6, {m: 3, c: "E"}], [7, {m: 5, c: "E"}]]));
KeyScaleMidiMap.set("C#", new Map([[1, {m: 1, c: "C"}], [2, {m: 3, c: "D"}], [3, {m: 5, c: "E"}], [4, {m: 6, c: "F"}], [5, {m: 8, c: "G"}], [6, {m: 10, c: "A"}], [7, {m: 0, c: "B"}]]));
KeyScaleMidiMap.set("F", new Map([[1, {m: 5, c: "F"}], [2, {m: 7, c: "G"}], [3, {m: 9, c: "A"}], [4, {m: 10, c: "B"}], [5, {m: 0, c: "C"}], [6, {m: 2, c: "D"}], [7, {m: 4, c: "E"}]]));
KeyScaleMidiMap.set("Bb", new Map([[1, {m: 10, c: "B"}], [2, {m: 0, c: "C"}], [3, {m: 2, c: "D"}], [4, {m: 3, c: "E"}], [5, {m: 5, c: "F"}], [6, {m: 7, c: "G"}], [7, {m: 9, c: "A"}]]));
KeyScaleMidiMap.set("Eb", new Map([[1, {m: 3, c: "E"}], [2, {m: 5, c: "F"}], [3, {m: 7, c: "G"}], [4, {m: 8, c: "A"}], [5, {m: 10, c: "B"}], [6, {m: 0, c: "C"}], [7, {m: 2, c: "E"}]]));
KeyScaleMidiMap.set("Ab", new Map([[1, {m: 8, c: "A"}], [2, {m: 10, c: "B"}], [3, {m: 0, c: "C"}], [4, {m: 1, c: "D"}], [5, {m: 3, c: "E"}], [6, {m: 5, c: "F"}], [7, {m: 7, c: "G"}]]));
KeyScaleMidiMap.set("Db", new Map([[1, {m: 1, c: "D"}], [2, {m: 3, c: "E"}], [3, {m: 5, c: "F"}], [4, {m: 6, c: "G"}], [5, {m: 8, c: "A"}], [6, {m: 10, c: "B"}], [7, {m: 0, c: "C"}]]));
KeyScaleMidiMap.set("Gb", new Map([[1, {m: 6, c: "G"}], [2, {m: 8, c: "A"}], [3, {m: 10, c: "B"}], [4, {m: 11, c: "C"}], [5, {m: 1, c: "D"}], [6, {m: 3, c: "E"}], [7, {m: 5, c: "F"}]]));
KeyScaleMidiMap.set("Cb", new Map([[1, {m: 11, c: "C"}], [2, {m: 1, c: "D"}], [3, {m: 3, c: "E"}], [4, {m: 4, c: "F"}], [5, {m: 6, c: "G"}], [6, {m: 8, c: "A"}], [7, {m: 10, c: "B"}]]));

KeyScaleMidiMap.set("Am", new Map([[3, {m: 0, c: "A"}], [4, {m: 2, c: "B"}], [5, {m: 4, c: "C"}], [6, {m: 5, c: "D"}], [7, {m: 7, c: "E"}], [1, {m: 9, c: "F"}], [2, {m: 11, c: "G"}]]));
KeyScaleMidiMap.set("Em", new Map([[3, {m: 7, c: "E"}], [4, {m: 9, c: "F"}], [5, {m: 11, c: "G"}], [6, {m: 0, c: "A"}], [7, {m: 2, c: "B"}], [1, {m: 4, c: "C"}], [2, {m: 6, c: "D"}]]));
KeyScaleMidiMap.set("Bm", new Map([[3, {m: 2, c: "B"}], [4, {m: 4, c: "C"}], [5, {m: 6, c: "D"}], [6, {m: 7, c: "E"}], [7, {m: 9, c: "F"}], [1, {m: 11, c: "G"}], [2, {m: 1, c: "A"}]]));
KeyScaleMidiMap.set("F#m", new Map([[3, {m: 9, c: "F"}], [4, {m: 11, c: "G"}], [5, {m: 1, c: "A"}], [6, {m: 2, c: "B"}], [7, {m: 4, c: "C"}], [1, {m: 6, c: "D"}], [2, {m: 8, c: "E"}]]));
KeyScaleMidiMap.set("C#m", new Map([[3, {m: 4, c: "C"}], [4, {m: 6, c: "D"}], [5, {m: 8, c: "E"}], [6, {m: 9, c: "F"}], [7, {m: 11, c: "G"}], [1, {m: 1, c: "A"}], [2, {m: 3, c: "B"}]]));
KeyScaleMidiMap.set("G#m", new Map([[3, {m: 11, c: "G"}], [4, {m: 1, c: "A"}], [5, {m: 3, c: "B"}], [6, {m: 4, c: "C"}], [7, {m: 6, c: "D"}], [1, {m: 8, c: "E"}], [2, {m: 10, c: "F"}]]));
KeyScaleMidiMap.set("D#m", new Map([[3, {m: 6, c: "D"}], [4, {m: 8, c: "E"}], [5, {m: 10, c: "F"}], [6, {m: 11, c: "G"}], [7, {m: 1, c: "A"}], [1, {m: 3, c: "B"}], [2, {m: 5, c: "C"}]]));
KeyScaleMidiMap.set("A#m", new Map([[3, {m: 1, c: "A"}], [4, {m: 3, c: "B"}], [5, {m: 5, c: "C"}], [6, {m: 6, c: "D"}], [7, {m: 8, c: "E"}], [1, {m: 10, c: "F"}], [2, {m: 0, c: "G"}]]));
KeyScaleMidiMap.set("Dm", new Map([[3, {m: 5, c: "D"}], [4, {m: 7, c: "E"}], [5, {m: 9, c: "F"}], [6, {m: 10, c: "G"}], [7, {m: 0, c: "A"}], [1, {m: 2, c: "B"}], [2, {m: 4, c: "C"}]]));
KeyScaleMidiMap.set("Gm", new Map([[3, {m: 10, c: "G"}], [4, {m: 0, c: "A"}], [5, {m: 2, c: "B"}], [6, {m: 3, c: "C"}], [7, {m: 5, c: "D"}], [1, {m: 7, c: "E"}], [2, {m: 9, c: "F"}]]));
KeyScaleMidiMap.set("Cm", new Map([[3, {m: 3, c: "C"}], [4, {m: 5, c: "D"}], [5, {m: 7, c: "E"}], [6, {m: 8, c: "F"}], [7, {m: 10, c: "G"}], [1, {m: 0, c: "A"}], [2, {m: 2, c: "B"}]]));
KeyScaleMidiMap.set("Fm", new Map([[3, {m: 8, c: "F"}], [4, {m: 10, c: "G"}], [5, {m: 0, c: "A"}], [6, {m: 1, c: "B"}], [7, {m: 3, c: "C"}], [1, {m: 5, c: "D"}], [2, {m: 7, c: "E"}]]));
KeyScaleMidiMap.set("Bbm", new Map([[3, {m: 1, c: "B"}], [4, {m: 3, c: "C"}], [5, {m: 5, c: "D"}], [6, {m: 6, c: "E"}], [7, {m: 8, c: "F"}], [1, {m: 10, c: "G"}], [2, {m: 0, c: "A"}]]));
KeyScaleMidiMap.set("Ebm", new Map([[3, {m: 6, c: "E"}], [4, {m: 8, c: "F"}], [5, {m: 10, c: "G"}], [6, {m: 11, c: "A"}], [7, {m: 1, c: "B"}], [1, {m: 3, c: "C"}], [2, {m: 5, c: "D"}]]));
KeyScaleMidiMap.set("Abm", new Map([[3, {m: 11, c: "A"}], [4, {m: 1, c: "B"}], [5, {m: 3, c: "C"}], [6, {m: 4, c: "D"}], [7, {m: 6, c: "E"}], [1, {m: 8, c: "F"}], [2, {m: 10, c: "G"}]]));
