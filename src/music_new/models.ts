export type PitchRegister = 1 | 2| 3 | 4 | 5 | 6 | 7;
export type ScaleDegree = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Accidental = -2 | -1 | 0 | 1 | 2; // negative for flat, positive for sharp

export type NoteDuration = "whole" | "half" | "quarter" | "eighter" | "sixteenth";

export type TimeSignature = "4/4" | "3/4" | "6/8";

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
    accidental?: Accidental,
}

export interface Chord {
    duration: NoteDuration,
    pitches: Pitch[],
}

export interface Measure {
    keySignature: KeySignature,
    timeSignature: TimeSignature,
    staffTop: Chord[],
    staffBot: Chord[],
}

//A mapping of key signatures to a mapping of scale degrees to base midi values.
const KeyScaleMidiMap = new Map<KeySignature, Map<ScaleDegree, number>>();

KeyScaleMidiMap.set("C", new Map([[1, 0], [2, 2], [3, 4], [4, 5], [5, 7], [6, 9], [7, 11]]));
KeyScaleMidiMap.set("G", new Map([[1, 7], [2, 9], [3, 11], [4, 0], [5, 2], [6, 4], [7, 6]]));
KeyScaleMidiMap.set("D", new Map([[1, 2], [2, 4], [3, 6], [4, 7], [5, 9], [6, 11], [7, 1]]));
KeyScaleMidiMap.set("A", new Map([[1, 9], [2, 11], [3, 1], [4, 2], [5, 4], [6, 6], [7, 8]]));
KeyScaleMidiMap.set("E", new Map([[1, 4], [2, 6], [3, 8], [4, 9], [5, 11], [6, 1], [7, 3]]));
KeyScaleMidiMap.set("B", new Map([[1, 11], [2, 1], [3, 3], [4, 4], [5, 6], [6, 8], [7, 10]]));
KeyScaleMidiMap.set("F#", new Map([[1, 6], [2, 8], [3, 10], [4, 11], [5, 1], [6, 3], [7, 5]]));
KeyScaleMidiMap.set("C#", new Map([[1, 1], [2, 3], [3, 5], [4, 6], [5, 8], [6, 10], [7, 0]]));
KeyScaleMidiMap.set("F", new Map([[1, 5], [2, 7], [3, 9], [4, 10], [5, 0], [6, 2], [7, 4]]));
KeyScaleMidiMap.set("Bb", new Map([[1, 10], [2, 0], [3, 2], [4, 3], [5, 5], [6, 7], [7, 9]]));
KeyScaleMidiMap.set("Eb", new Map([[1, 3], [2, 5], [3, 7], [4, 8], [5, 10], [6, 0], [7, 2]]));
KeyScaleMidiMap.set("Ab", new Map([[1, 8], [2, 10], [3, 0], [4, 1], [5, 3], [6, 5], [7, 7]]));
KeyScaleMidiMap.set("Db", new Map([[1, 1], [2, 3], [3, 5], [4, 6], [5, 8], [6, 10], [7, 0]]));
KeyScaleMidiMap.set("Gb", new Map([[1, 6], [2, 8], [3, 10], [4, 11], [5, 1], [6, 3], [7, 5]]));
KeyScaleMidiMap.set("Cb", new Map([[1, 11], [2, 1], [3, 3], [4, 4], [5, 6], [6, 8], [7, 10]]));

KeyScaleMidiMap.set("Am", new Map([[3, 0], [4, 2], [5, 4], [6, 5], [7, 7], [1, 9], [2, 11]]));
KeyScaleMidiMap.set("Em", new Map([[3, 7], [4, 9], [5, 11], [6, 0], [7, 2], [1, 4], [2, 6]]));
KeyScaleMidiMap.set("Bm", new Map([[3, 2], [4, 4], [5, 6], [6, 7], [7, 9], [1, 11], [2, 1]]));
KeyScaleMidiMap.set("F#m", new Map([[3, 9], [4, 11], [5, 1], [6, 2], [7, 4], [1, 6], [2, 8]]));
KeyScaleMidiMap.set("C#m", new Map([[3, 4], [4, 6], [5, 8], [6, 9], [7, 11], [1, 1], [2, 3]]));
KeyScaleMidiMap.set("G#m", new Map([[3, 11], [4, 1], [5, 3], [6, 4], [7, 6], [1, 8], [2, 10]]));
KeyScaleMidiMap.set("D#m", new Map([[3, 6], [4, 8], [5, 10], [6, 11], [7, 1], [1, 3], [2, 5]]));
KeyScaleMidiMap.set("A#m", new Map([[3, 1], [4, 3], [5, 5], [6, 6], [7, 8], [1, 10], [2, 0]]));
KeyScaleMidiMap.set("Dm", new Map([[3, 5], [4, 7], [5, 9], [6, 10], [7, 0], [1, 2], [2, 4]]));
KeyScaleMidiMap.set("Gm", new Map([[3, 10], [4, 0], [5, 2], [6, 3], [7, 5], [1, 7], [2, 9]]));
KeyScaleMidiMap.set("Cm", new Map([[3, 3], [4, 5], [5, 7], [6, 8], [7, 10], [1, 0], [2, 2]]));
KeyScaleMidiMap.set("Fm", new Map([[3, 8], [4, 10], [5, 0], [6, 1], [7, 3], [1, 5], [2, 7]]));
KeyScaleMidiMap.set("Bbm", new Map([[3, 1], [4, 3], [5, 5], [6, 6], [7, 8], [1, 10], [2, 0]]));
KeyScaleMidiMap.set("Ebm", new Map([[3, 6], [4, 8], [5, 10], [6, 11], [7, 1], [1, 3], [2, 5]]));
KeyScaleMidiMap.set("Abm", new Map([[3, 11], [4, 1], [5, 3], [6, 4], [7, 6], [1, 8], [2, 10]]));
