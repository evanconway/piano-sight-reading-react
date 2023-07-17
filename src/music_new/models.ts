export type PitchRegister = -1 | 0 | 1 | 2| 3 | 4 | 5 | 6 | 7 | 8;
export type ScaleDegree = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Accidental = -2 | -1 | 0 | 1 | 2; // negative for flat, positive for sharp
type AccidentalSymbol = "#" | "b";
export type PitchClass = "C" | "D" | "E" | "F" | "G" | "A" | "B";

export type PitchCap = {
    pitchClass: PitchClass,
    register: PitchRegister,
};

export type NoteDuration = "whole" | "half" | "quarter" | "eighth" | "sixteenth";

export type TimeSignature = "4/4" | "3/4" | "6/8";

const EIGHTH_BASE = 12;

/**
 * Returns the array size of a measure given a time signature.
 * @param timeSignature
 * @returns {number} Array size of given time signature.
 */
export const getMeasureDuration = (timeSignature: TimeSignature): number => {
    if (timeSignature === "3/4") return EIGHTH_BASE * 2 * 3;
    if (timeSignature === "4/4") return EIGHTH_BASE * 2 * 4;
    if (timeSignature === "6/8") return EIGHTH_BASE * 6;
    return 0;
};

/**
 * Returns the value of a duration given a NoteDuration. This value is the number of entries in
 * a chord array the duration occupies.
 * @param noteDuration 
 * @returns {number} Number of entries in chord array given note duration occupies.
 */
export const getNoteDurationValue = (noteDuration: NoteDuration): number => {
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
    pathId: string, // reference to the html element that abcjs renders the note with
}

export interface Measure {
    keySignature: KeySignature,
    timeSignature: TimeSignature,
    staffTop: (Chord | null)[],
    staffBottom: (Chord | null)[],
}

/**
 * Sets color of paths of given measure array
 * 
 * @param measures 
 */
export const measuresSetPathColors = (measures: Measure[], color: string) => {
    measures.forEach(m => {
        m.staffTop.forEach(c => {
            const paths = document.querySelector(`#${c?.pathId}`)?.children;
            if (paths !== undefined) Array.from(paths).forEach(p => p.setAttribute("fill", color));
        });
        m.staffBottom.forEach(c => {
            const paths = document.querySelector(`#${c?.pathId}`)?.children;
            if (paths !== undefined) Array.from(paths).forEach(p => p.setAttribute("fill", color));
        });
    });
};

/**
 * Returns width of given measure in pixels.
 * @param measure 
 * @returns 
 */
export const getMeasureWidth = (measure: Measure) => {
    const noteWidth = 65 as number; // arbitrary value
    const topWidth = measure.staffTop.map(c => c ? noteWidth : 0).reduce((prev, curr) => prev + curr, 0);
    const bottomWidth = measure.staffBottom.map(c => c ? noteWidth : 0).reduce((prev, curr) => prev + curr, 0);
    return Math.max(topWidth, bottomWidth);
};

//A mapping of key signatures to a mapping of scale degrees to base midi values.
export const KeyScaleMidiMap = new Map<KeySignature, Map<ScaleDegree, { midi: number, pitchClass: PitchClass }>>();

KeyScaleMidiMap.set("C", new Map([[1, {midi: 0, pitchClass: "C"}], [2, {midi: 2, pitchClass: "D"}], [3, {midi: 4, pitchClass: "E"}], [4, {midi: 5, pitchClass: "F"}], [5, {midi: 7, pitchClass: "G"}], [6, {midi: 9, pitchClass: "A"}], [7, {midi: 11, pitchClass: "B"}]]));
KeyScaleMidiMap.set("G", new Map([[1, {midi: 7, pitchClass: "G"}], [2, {midi: 9, pitchClass: "A"}], [3, {midi: 11, pitchClass: "B"}], [4, {midi: 0, pitchClass: "C"}], [5, {midi: 2, pitchClass: "D"}], [6, {midi: 4, pitchClass: "E"}], [7, {midi: 6, pitchClass: "F"}]]));
KeyScaleMidiMap.set("D", new Map([[1, {midi: 2, pitchClass: "D"}], [2, {midi: 4, pitchClass: "E"}], [3, {midi: 6, pitchClass: "F"}], [4, {midi: 7, pitchClass: "G"}], [5, {midi: 9, pitchClass: "A"}], [6, {midi: 11, pitchClass: "B"}], [7, {midi: 1, pitchClass: "C"}]]));
KeyScaleMidiMap.set("A", new Map([[1, {midi: 9, pitchClass: "A"}], [2, {midi: 11, pitchClass: "B"}], [3, {midi: 1, pitchClass: "C"}], [4, {midi: 2, pitchClass: "D"}], [5, {midi: 4, pitchClass: "E"}], [6, {midi: 6, pitchClass: "F"}], [7, {midi: 8, pitchClass: "G"}]]));
KeyScaleMidiMap.set("E", new Map([[1, {midi: 4, pitchClass: "E"}], [2, {midi: 6, pitchClass: "F"}], [3, {midi: 8, pitchClass: "G"}], [4, {midi: 9, pitchClass: "A"}], [5, {midi: 11, pitchClass: "B"}], [6, {midi: 1, pitchClass: "C"}], [7, {midi: 3, pitchClass: "D"}]]));
KeyScaleMidiMap.set("B", new Map([[1, {midi: 11, pitchClass: "B"}], [2, {midi: 1, pitchClass: "C"}], [3, {midi: 3, pitchClass: "D"}], [4, {midi: 4, pitchClass: "E"}], [5, {midi: 6, pitchClass: "F"}], [6, {midi: 8, pitchClass: "G"}], [7, {midi: 10, pitchClass: "A"}]]));
KeyScaleMidiMap.set("F#", new Map([[1, {midi: 6, pitchClass: "F"}], [2, {midi: 8, pitchClass: "G"}], [3, {midi: 10, pitchClass: "A"}], [4, {midi: 11, pitchClass: "B"}], [5, {midi: 1, pitchClass: "C"}], [6, {midi: 3, pitchClass: "E"}], [7, {midi: 5, pitchClass: "E"}]]));
KeyScaleMidiMap.set("C#", new Map([[1, {midi: 1, pitchClass: "C"}], [2, {midi: 3, pitchClass: "D"}], [3, {midi: 5, pitchClass: "E"}], [4, {midi: 6, pitchClass: "F"}], [5, {midi: 8, pitchClass: "G"}], [6, {midi: 10, pitchClass: "A"}], [7, {midi: 0, pitchClass: "B"}]]));
KeyScaleMidiMap.set("F", new Map([[1, {midi: 5, pitchClass: "F"}], [2, {midi: 7, pitchClass: "G"}], [3, {midi: 9, pitchClass: "A"}], [4, {midi: 10, pitchClass: "B"}], [5, {midi: 0, pitchClass: "C"}], [6, {midi: 2, pitchClass: "D"}], [7, {midi: 4, pitchClass: "E"}]]));
KeyScaleMidiMap.set("Bb", new Map([[1, {midi: 10, pitchClass: "B"}], [2, {midi: 0, pitchClass: "C"}], [3, {midi: 2, pitchClass: "D"}], [4, {midi: 3, pitchClass: "E"}], [5, {midi: 5, pitchClass: "F"}], [6, {midi: 7, pitchClass: "G"}], [7, {midi: 9, pitchClass: "A"}]]));
KeyScaleMidiMap.set("Eb", new Map([[1, {midi: 3, pitchClass: "E"}], [2, {midi: 5, pitchClass: "F"}], [3, {midi: 7, pitchClass: "G"}], [4, {midi: 8, pitchClass: "A"}], [5, {midi: 10, pitchClass: "B"}], [6, {midi: 0, pitchClass: "C"}], [7, {midi: 2, pitchClass: "E"}]]));
KeyScaleMidiMap.set("Ab", new Map([[1, {midi: 8, pitchClass: "A"}], [2, {midi: 10, pitchClass: "B"}], [3, {midi: 0, pitchClass: "C"}], [4, {midi: 1, pitchClass: "D"}], [5, {midi: 3, pitchClass: "E"}], [6, {midi: 5, pitchClass: "F"}], [7, {midi: 7, pitchClass: "G"}]]));
KeyScaleMidiMap.set("Db", new Map([[1, {midi: 1, pitchClass: "D"}], [2, {midi: 3, pitchClass: "E"}], [3, {midi: 5, pitchClass: "F"}], [4, {midi: 6, pitchClass: "G"}], [5, {midi: 8, pitchClass: "A"}], [6, {midi: 10, pitchClass: "B"}], [7, {midi: 0, pitchClass: "C"}]]));
KeyScaleMidiMap.set("Gb", new Map([[1, {midi: 6, pitchClass: "G"}], [2, {midi: 8, pitchClass: "A"}], [3, {midi: 10, pitchClass: "B"}], [4, {midi: 11, pitchClass: "C"}], [5, {midi: 1, pitchClass: "D"}], [6, {midi: 3, pitchClass: "E"}], [7, {midi: 5, pitchClass: "F"}]]));
KeyScaleMidiMap.set("Cb", new Map([[1, {midi: 11, pitchClass: "C"}], [2, {midi: 1, pitchClass: "D"}], [3, {midi: 3, pitchClass: "E"}], [4, {midi: 4, pitchClass: "F"}], [5, {midi: 6, pitchClass: "G"}], [6, {midi: 8, pitchClass: "A"}], [7, {midi: 10, pitchClass: "B"}]]));

KeyScaleMidiMap.set("Am", new Map([[3, {midi: 0, pitchClass: "A"}], [4, {midi: 2, pitchClass: "B"}], [5, {midi: 4, pitchClass: "C"}], [6, {midi: 5, pitchClass: "D"}], [7, {midi: 7, pitchClass: "E"}], [1, {midi: 9, pitchClass: "F"}], [2, {midi: 11, pitchClass: "G"}]]));
KeyScaleMidiMap.set("Em", new Map([[3, {midi: 7, pitchClass: "E"}], [4, {midi: 9, pitchClass: "F"}], [5, {midi: 11, pitchClass: "G"}], [6, {midi: 0, pitchClass: "A"}], [7, {midi: 2, pitchClass: "B"}], [1, {midi: 4, pitchClass: "C"}], [2, {midi: 6, pitchClass: "D"}]]));
KeyScaleMidiMap.set("Bm", new Map([[3, {midi: 2, pitchClass: "B"}], [4, {midi: 4, pitchClass: "C"}], [5, {midi: 6, pitchClass: "D"}], [6, {midi: 7, pitchClass: "E"}], [7, {midi: 9, pitchClass: "F"}], [1, {midi: 11, pitchClass: "G"}], [2, {midi: 1, pitchClass: "A"}]]));
KeyScaleMidiMap.set("F#m", new Map([[3, {midi: 9, pitchClass: "F"}], [4, {midi: 11, pitchClass: "G"}], [5, {midi: 1, pitchClass: "A"}], [6, {midi: 2, pitchClass: "B"}], [7, {midi: 4, pitchClass: "C"}], [1, {midi: 6, pitchClass: "D"}], [2, {midi: 8, pitchClass: "E"}]]));
KeyScaleMidiMap.set("C#m", new Map([[3, {midi: 4, pitchClass: "C"}], [4, {midi: 6, pitchClass: "D"}], [5, {midi: 8, pitchClass: "E"}], [6, {midi: 9, pitchClass: "F"}], [7, {midi: 11, pitchClass: "G"}], [1, {midi: 1, pitchClass: "A"}], [2, {midi: 3, pitchClass: "B"}]]));
KeyScaleMidiMap.set("G#m", new Map([[3, {midi: 11, pitchClass: "G"}], [4, {midi: 1, pitchClass: "A"}], [5, {midi: 3, pitchClass: "B"}], [6, {midi: 4, pitchClass: "C"}], [7, {midi: 6, pitchClass: "D"}], [1, {midi: 8, pitchClass: "E"}], [2, {midi: 10, pitchClass: "F"}]]));
KeyScaleMidiMap.set("D#m", new Map([[3, {midi: 6, pitchClass: "D"}], [4, {midi: 8, pitchClass: "E"}], [5, {midi: 10, pitchClass: "F"}], [6, {midi: 11, pitchClass: "G"}], [7, {midi: 1, pitchClass: "A"}], [1, {midi: 3, pitchClass: "B"}], [2, {midi: 5, pitchClass: "C"}]]));
KeyScaleMidiMap.set("A#m", new Map([[3, {midi: 1, pitchClass: "A"}], [4, {midi: 3, pitchClass: "B"}], [5, {midi: 5, pitchClass: "C"}], [6, {midi: 6, pitchClass: "D"}], [7, {midi: 8, pitchClass: "E"}], [1, {midi: 10, pitchClass: "F"}], [2, {midi: 0, pitchClass: "G"}]]));
KeyScaleMidiMap.set("Dm", new Map([[3, {midi: 5, pitchClass: "D"}], [4, {midi: 7, pitchClass: "E"}], [5, {midi: 9, pitchClass: "F"}], [6, {midi: 10, pitchClass: "G"}], [7, {midi: 0, pitchClass: "A"}], [1, {midi: 2, pitchClass: "B"}], [2, {midi: 4, pitchClass: "C"}]]));
KeyScaleMidiMap.set("Gm", new Map([[3, {midi: 10, pitchClass: "G"}], [4, {midi: 0, pitchClass: "A"}], [5, {midi: 2, pitchClass: "B"}], [6, {midi: 3, pitchClass: "C"}], [7, {midi: 5, pitchClass: "D"}], [1, {midi: 7, pitchClass: "E"}], [2, {midi: 9, pitchClass: "F"}]]));
KeyScaleMidiMap.set("Cm", new Map([[3, {midi: 3, pitchClass: "C"}], [4, {midi: 5, pitchClass: "D"}], [5, {midi: 7, pitchClass: "E"}], [6, {midi: 8, pitchClass: "F"}], [7, {midi: 10, pitchClass: "G"}], [1, {midi: 0, pitchClass: "A"}], [2, {midi: 2, pitchClass: "B"}]]));
KeyScaleMidiMap.set("Fm", new Map([[3, {midi: 8, pitchClass: "F"}], [4, {midi: 10, pitchClass: "G"}], [5, {midi: 0, pitchClass: "A"}], [6, {midi: 1, pitchClass: "B"}], [7, {midi: 3, pitchClass: "C"}], [1, {midi: 5, pitchClass: "D"}], [2, {midi: 7, pitchClass: "E"}]]));
KeyScaleMidiMap.set("Bbm", new Map([[3, {midi: 1, pitchClass: "B"}], [4, {midi: 3, pitchClass: "C"}], [5, {midi: 5, pitchClass: "D"}], [6, {midi: 6, pitchClass: "E"}], [7, {midi: 8, pitchClass: "F"}], [1, {midi: 10, pitchClass: "G"}], [2, {midi: 0, pitchClass: "A"}]]));
KeyScaleMidiMap.set("Ebm", new Map([[3, {midi: 6, pitchClass: "E"}], [4, {midi: 8, pitchClass: "F"}], [5, {midi: 10, pitchClass: "G"}], [6, {midi: 11, pitchClass: "A"}], [7, {midi: 1, pitchClass: "B"}], [1, {midi: 3, pitchClass: "C"}], [2, {midi: 5, pitchClass: "D"}]]));
KeyScaleMidiMap.set("Abm", new Map([[3, {midi: 11, pitchClass: "A"}], [4, {midi: 1, pitchClass: "B"}], [5, {midi: 3, pitchClass: "C"}], [6, {midi: 4, pitchClass: "D"}], [7, {midi: 6, pitchClass: "E"}], [1, {midi: 8, pitchClass: "F"}], [2, {midi: 10, pitchClass: "G"}]]));

const ORDER_OF_SHARPS: PitchClass[] = ["F", "C", "G", "D", "A", "E", "B"];
const ORDER_OF_FLATS = ORDER_OF_SHARPS.reverse();

type NumberOfSharpsFlats = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

const sharpsInKeyMap = new Map<KeySignature, NumberOfSharpsFlats>();
sharpsInKeyMap.set("C", 0);
sharpsInKeyMap.set("G", 1);
sharpsInKeyMap.set("D", 2);
sharpsInKeyMap.set("A", 3);
sharpsInKeyMap.set("E", 4);
sharpsInKeyMap.set("B", 5);
sharpsInKeyMap.set("F#", 6);
sharpsInKeyMap.set("C#", 7);
sharpsInKeyMap.set("Am", 0);
sharpsInKeyMap.set("Em", 1);
sharpsInKeyMap.set("Bm", 2);
sharpsInKeyMap.set("F#m", 3);
sharpsInKeyMap.set("C#m", 4);
sharpsInKeyMap.set("G#m", 5);
sharpsInKeyMap.set("D#m", 6);
sharpsInKeyMap.set("A#m", 7);

const flatsInKeyMap = new Map<KeySignature, NumberOfSharpsFlats>();
flatsInKeyMap.set("C", 0);
flatsInKeyMap.set("F", 1);
flatsInKeyMap.set("Bb", 2);
flatsInKeyMap.set("Eb", 3);
flatsInKeyMap.set("Ab", 4);
flatsInKeyMap.set("Db", 5);
flatsInKeyMap.set("Gb", 6);
flatsInKeyMap.set("Cb", 7);
flatsInKeyMap.set("Am", 0);
flatsInKeyMap.set("Dm", 1);
flatsInKeyMap.set("Gm", 2);
flatsInKeyMap.set("Cm", 3);
flatsInKeyMap.set("Fm", 4);
flatsInKeyMap.set("Bbm", 5);
flatsInKeyMap.set("Ebm", 6);
flatsInKeyMap.set("Abm", 7);

/**
 * Get object with accidental type and array of pitch classes of accidentals within given key
 * 
 * @param key 
 * @returns 
 */
export const getAccidentalsInKey = (key: KeySignature) => {
    const sharpCount = sharpsInKeyMap.get(key);
    const flatCount = flatsInKeyMap.get(key);

    const accidentalType: AccidentalSymbol = sharpCount !== undefined ? "#" : "b";
    const accidentals: PitchClass[] = [];

    const result = {
        accidentalType,
        accidentals,
    };

    if (accidentalType === "#" && sharpCount !== undefined) {
        for (let i = 0; i < sharpCount; i++) result.accidentals.push(ORDER_OF_SHARPS[i]);
    }

    if (accidentalType === "b" && flatCount !== undefined) {
        for (let i = 0; i < flatCount; i++) result.accidentals.push(ORDER_OF_FLATS[i]);
    }

    return result;
};

/**
 * Given a key signature and pitch cap, return a pitch object.
 * 
 * @param key 
 * @param cap 
 * @returns 
 */
export const getPitchFromPitchCap = (key: KeySignature, cap: PitchCap) => {
    const result: Pitch = { scaleDegree: 1, register: cap.register, accidental: 0};
    const entries = KeyScaleMidiMap.get(key)?.entries();
    if (!entries) return result;
    result.scaleDegree = Array.from(entries).filter(entry => {
        return entry[1].pitchClass === cap.pitchClass;
    })[0][0];
    return result;
};

const pitchClassOrder: PitchClass[] = ["C", "D", "E", "F", "G", "A", "B"];

/**
 * Mutate given pitch cap to next highest pitch.
 * 
 * @param cap 
 */
export const raisePitchCap = (cap: PitchCap) => {
    if (cap.pitchClass === "B") {
        cap.pitchClass = "C";
        cap.register++;
        return;
    }
    const index = pitchClassOrder.indexOf(cap.pitchClass);
    cap.pitchClass = pitchClassOrder[index + 1];
};

export const pitchCapOrder: PitchCap[] = [];

for (
    const pitchCap: PitchCap = { pitchClass: "A", register: 0 };
    pitchCap.pitchClass !== "D" || pitchCap.register !== 8;
    raisePitchCap(pitchCap)
) {
    pitchCapOrder.push({ ...pitchCap });
}

export const pitchCapIsLowerThan = (cap: PitchCap, against: PitchCap) => {
    const capIndex = pitchCapOrder.indexOf(cap);
    const againstIndex = pitchCapOrder.indexOf(against);
    if (capIndex < 0 || againstIndex < 0) return false;
    return capIndex < againstIndex;
};

export const pitchCapIsHigherThan = (cap: PitchCap, against: PitchCap) => {
    const capIndex = pitchCapOrder.indexOf(cap);
    const againstIndex = pitchCapOrder.indexOf(against);
    if (capIndex < 0 || againstIndex < 0) return false;
    return capIndex > againstIndex;
};