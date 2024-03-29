export type PitchRegister = -1 | 0 | 1 | 2| 3 | 4 | 5 | 6 | 7 | 8;
export type ScaleDegree = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export const ScaleDegrees: ScaleDegree[] = [1, 2, 3, 4, 5, 6, 7];
export type Accidental = -2 | -1 | 0 | 1 | 2; // negative for flat, positive for sharp
type AccidentalSymbol = '#' | 'b';
export type PitchClass = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';

export type PitchCap = {
    pitchClass: PitchClass,
    register: PitchRegister,
};

export type NoteDuration = 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth' | 'quarter-dotted' | 'half-dotted';
export type TimeSignature = '4/4' | '3/4' | '6/8';
export const TimeSignatures: TimeSignature[] = ['3/4', '4/4', '6/8'];
export const NOTE_DURATION_BASE = 96;

export const durationsAllowedInTimeSignatureMap = new Map<TimeSignature, NoteDuration[]>();
durationsAllowedInTimeSignatureMap.set('3/4', ['sixteenth', 'eighth', 'quarter', 'half-dotted']);
durationsAllowedInTimeSignatureMap.set('4/4', ['whole', 'half', 'quarter', 'eighth', 'sixteenth']);
durationsAllowedInTimeSignatureMap.set('6/8', ['sixteenth', 'eighth', 'quarter', 'quarter-dotted']);

/**
 * Returns the value of a duration given a NoteDuration. This value is the number of entries in
 * a chord array the duration occupies.
 * @param noteDuration 
 * @returns {number} Number of entries in chord array given note duration occupies.
 */
export const getNoteDurationValue = (noteDuration: NoteDuration): number => {
    if (noteDuration === 'sixteenth') return NOTE_DURATION_BASE / 16;
    if (noteDuration === 'eighth') return NOTE_DURATION_BASE / 8;
    if (noteDuration === 'quarter') return NOTE_DURATION_BASE / 4;
    if (noteDuration === 'half') return NOTE_DURATION_BASE / 2;
    if (noteDuration === 'whole') return NOTE_DURATION_BASE; // technically incorrect but more intuitive
    if (noteDuration === 'quarter-dotted') return NOTE_DURATION_BASE / 4 * 3 / 2;
    if (noteDuration === 'half-dotted') return NOTE_DURATION_BASE / 2 * 3 / 2;
    return 0;
};

/**
 * Returns the array size of a measure given a time signature.
 * @param timeSignature
 * @returns {number} Array size of given time signature.
 */
export const getMeasureDuration = (timeSignature: TimeSignature): number => {
    if (timeSignature === '3/4') return getNoteDurationValue('quarter') * 3;
    if (timeSignature === '4/4') return getNoteDurationValue('quarter') * 4;
    if (timeSignature === '6/8') return getNoteDurationValue('eighth') * 6;
    return 0;
};

export type KeySignature = 
'C' |
'G' |
'D' |
'A' |
'E' |
'B' |
'F#' |
'C#' |
'F' |
'Bb' |
'Eb' |
'Ab' |
'Db' |
'Gb' |
'Cb' |
'Am' |
'Em' |
'Bm' |
'F#m' |
'C#m' |
'G#m' |
'D#m' |
'A#m' |
'Dm' |
'Gm' |
'Cm' |
'Fm' |
'Bbm' |
'Ebm' |
'Abm';

export const isMajorKey = (key: KeySignature) => {
    if (key === 'C') return true;
    if (key === 'G') return true;
    if (key === 'D') return true;
    if (key === 'A') return true;
    if (key === 'E') return true;
    if (key === 'B') return true;
    if (key === 'F#') return true;
    if (key === 'C#') return true;
    if (key === 'F') return true;
    if (key === 'Bb') return true;
    if (key === 'Eb') return true;
    if (key === 'Ab') return true;
    if (key === 'Db') return true;
    if (key === 'Gb') return true;
    if (key === 'Cb') return true;
    return false;
}

export const KeySignatures: KeySignature[] = [
    'C',
    'G',
    'D',
    'A',
    'E',
    'B',
    'F#',
    'C#',
    'F',
    'Bb',
    'Eb',
    'Ab',
    'Db',
    'Gb',
    'Cb',
    'Am',
    'Em',
    'Bm',
    'F#m',
    'C#m',
    'G#m',
    'D#m',
    'A#m',
    'Dm',
    'Gm',
    'Cm',
    'Fm',
    'Bbm',
    'Ebm',
    'Abm',
];

interface DegreeAccidental {
    degree: ScaleDegree,
    accidental: Accidental,
}

export interface Pitch extends DegreeAccidental {
    register: PitchRegister,
}

export interface Chord {
    duration: NoteDuration,
    pitches: Pitch[],
    pathId: string, // reference to the html element that abcjs renders the note with
}

export interface Measure {
    keySignature: KeySignature,
    timeSignature: TimeSignature,
    staffChords: ({ top: Chord | null, bottom: Chord | null })[],
}

/**
 * Sets color of paths of given measure array
 * 
 * @param measures 
 */
export const measuresSetPathColors = (measures: Measure[], color: string) => {
    measures.forEach(m => m.staffChords.forEach(staffEntry => {
        const pathsTop = document.querySelector(`#${staffEntry.top?.pathId}`)?.children;
        if (pathsTop !== undefined) Array.from(pathsTop).forEach(p => p.setAttribute('fill', color));
        const pathsBottom = document.querySelector(`#${staffEntry.bottom?.pathId}`)?.children;
        if (pathsBottom !== undefined) Array.from(pathsBottom).forEach(p => p.setAttribute('fill', color));
    }));
};

export const NOTE_WIDTH = 40 as number; // arbitrary value indicating width of individual notes in pixels

/**
 * Returns width of given measure in pixels.
 * 
 * @param measure 
 * @returns 
 */
export const getMeasureWidth = (measure: Measure) => {
    const topWidth = measure.staffChords.reduce((prev, curr) => prev + (curr.top === null ? 0 : NOTE_WIDTH), 0);
    const bottomWidth = measure.staffChords.reduce((prev, curr) => prev + (curr.bottom === null ? 0 : NOTE_WIDTH), 0);
    return Math.max(topWidth, bottomWidth);
};

//A mapping of key signatures to a mapping of scale degrees to base midi values.
export const KeyScaleMidiMap = new Map<KeySignature, Map<ScaleDegree, { midi: number, pitchClass: PitchClass }>>();

KeyScaleMidiMap.set('C', new Map([[1, {midi: 0, pitchClass: 'C'}], [2, {midi: 2, pitchClass: 'D'}], [3, {midi: 4, pitchClass: 'E'}], [4, {midi: 5, pitchClass: 'F'}], [5, {midi: 7, pitchClass: 'G'}], [6, {midi: 9, pitchClass: 'A'}], [7, {midi: 11, pitchClass: 'B'}]]));
KeyScaleMidiMap.set('G', new Map([[1, {midi: 7, pitchClass: 'G'}], [2, {midi: 9, pitchClass: 'A'}], [3, {midi: 11, pitchClass: 'B'}], [4, {midi: 0, pitchClass: 'C'}], [5, {midi: 2, pitchClass: 'D'}], [6, {midi: 4, pitchClass: 'E'}], [7, {midi: 6, pitchClass: 'F'}]]));
KeyScaleMidiMap.set('D', new Map([[1, {midi: 2, pitchClass: 'D'}], [2, {midi: 4, pitchClass: 'E'}], [3, {midi: 6, pitchClass: 'F'}], [4, {midi: 7, pitchClass: 'G'}], [5, {midi: 9, pitchClass: 'A'}], [6, {midi: 11, pitchClass: 'B'}], [7, {midi: 1, pitchClass: 'C'}]]));
KeyScaleMidiMap.set('A', new Map([[1, {midi: 9, pitchClass: 'A'}], [2, {midi: 11, pitchClass: 'B'}], [3, {midi: 1, pitchClass: 'C'}], [4, {midi: 2, pitchClass: 'D'}], [5, {midi: 4, pitchClass: 'E'}], [6, {midi: 6, pitchClass: 'F'}], [7, {midi: 8, pitchClass: 'G'}]]));
KeyScaleMidiMap.set('E', new Map([[1, {midi: 4, pitchClass: 'E'}], [2, {midi: 6, pitchClass: 'F'}], [3, {midi: 8, pitchClass: 'G'}], [4, {midi: 9, pitchClass: 'A'}], [5, {midi: 11, pitchClass: 'B'}], [6, {midi: 1, pitchClass: 'C'}], [7, {midi: 3, pitchClass: 'D'}]]));
KeyScaleMidiMap.set('B', new Map([[1, {midi: 11, pitchClass: 'B'}], [2, {midi: 1, pitchClass: 'C'}], [3, {midi: 3, pitchClass: 'D'}], [4, {midi: 4, pitchClass: 'E'}], [5, {midi: 6, pitchClass: 'F'}], [6, {midi: 8, pitchClass: 'G'}], [7, {midi: 10, pitchClass: 'A'}]]));
KeyScaleMidiMap.set('F#', new Map([[1, {midi: 6, pitchClass: 'F'}], [2, {midi: 8, pitchClass: 'G'}], [3, {midi: 10, pitchClass: 'A'}], [4, {midi: 11, pitchClass: 'B'}], [5, {midi: 1, pitchClass: 'C'}], [6, {midi: 3, pitchClass: 'D'}], [7, {midi: 5, pitchClass: 'E'}]]));
KeyScaleMidiMap.set('C#', new Map([[1, {midi: 1, pitchClass: 'C'}], [2, {midi: 3, pitchClass: 'D'}], [3, {midi: 5, pitchClass: 'E'}], [4, {midi: 6, pitchClass: 'F'}], [5, {midi: 8, pitchClass: 'G'}], [6, {midi: 10, pitchClass: 'A'}], [7, {midi: 0, pitchClass: 'B'}]]));
KeyScaleMidiMap.set('F', new Map([[1, {midi: 5, pitchClass: 'F'}], [2, {midi: 7, pitchClass: 'G'}], [3, {midi: 9, pitchClass: 'A'}], [4, {midi: 10, pitchClass: 'B'}], [5, {midi: 0, pitchClass: 'C'}], [6, {midi: 2, pitchClass: 'D'}], [7, {midi: 4, pitchClass: 'E'}]]));
KeyScaleMidiMap.set('Bb', new Map([[1, {midi: 10, pitchClass: 'B'}], [2, {midi: 0, pitchClass: 'C'}], [3, {midi: 2, pitchClass: 'D'}], [4, {midi: 3, pitchClass: 'E'}], [5, {midi: 5, pitchClass: 'F'}], [6, {midi: 7, pitchClass: 'G'}], [7, {midi: 9, pitchClass: 'A'}]]));
KeyScaleMidiMap.set('Eb', new Map([[1, {midi: 3, pitchClass: 'E'}], [2, {midi: 5, pitchClass: 'F'}], [3, {midi: 7, pitchClass: 'G'}], [4, {midi: 8, pitchClass: 'A'}], [5, {midi: 10, pitchClass: 'B'}], [6, {midi: 0, pitchClass: 'C'}], [7, {midi: 2, pitchClass: 'D'}]]));
KeyScaleMidiMap.set('Ab', new Map([[1, {midi: 8, pitchClass: 'A'}], [2, {midi: 10, pitchClass: 'B'}], [3, {midi: 0, pitchClass: 'C'}], [4, {midi: 1, pitchClass: 'D'}], [5, {midi: 3, pitchClass: 'E'}], [6, {midi: 5, pitchClass: 'F'}], [7, {midi: 7, pitchClass: 'G'}]]));
KeyScaleMidiMap.set('Db', new Map([[1, {midi: 1, pitchClass: 'D'}], [2, {midi: 3, pitchClass: 'E'}], [3, {midi: 5, pitchClass: 'F'}], [4, {midi: 6, pitchClass: 'G'}], [5, {midi: 8, pitchClass: 'A'}], [6, {midi: 10, pitchClass: 'B'}], [7, {midi: 0, pitchClass: 'C'}]]));
KeyScaleMidiMap.set('Gb', new Map([[1, {midi: 6, pitchClass: 'G'}], [2, {midi: 8, pitchClass: 'A'}], [3, {midi: 10, pitchClass: 'B'}], [4, {midi: 11, pitchClass: 'C'}], [5, {midi: 1, pitchClass: 'D'}], [6, {midi: 3, pitchClass: 'E'}], [7, {midi: 5, pitchClass: 'F'}]]));
KeyScaleMidiMap.set('Cb', new Map([[1, {midi: 11, pitchClass: 'C'}], [2, {midi: 1, pitchClass: 'D'}], [3, {midi: 3, pitchClass: 'E'}], [4, {midi: 4, pitchClass: 'F'}], [5, {midi: 6, pitchClass: 'G'}], [6, {midi: 8, pitchClass: 'A'}], [7, {midi: 10, pitchClass: 'B'}]]));

KeyScaleMidiMap.set('Am', new Map([[3, {midi: 0, pitchClass: 'C'}], [4, {midi: 2, pitchClass: 'D'}], [5, {midi: 4, pitchClass: 'E'}], [6, {midi: 5, pitchClass: 'F'}], [7, {midi: 7, pitchClass: 'G'}], [1, {midi: 9, pitchClass: 'A'}], [2, {midi: 11, pitchClass: 'B'}]]));
KeyScaleMidiMap.set('Em', new Map([[3, {midi: 7, pitchClass: 'G'}], [4, {midi: 9, pitchClass: 'A'}], [5, {midi: 11, pitchClass: 'B'}], [6, {midi: 0, pitchClass: 'C'}], [7, {midi: 2, pitchClass: 'D'}], [1, {midi: 4, pitchClass: 'E'}], [2, {midi: 6, pitchClass: 'F'}]]));
KeyScaleMidiMap.set('Bm', new Map([[3, {midi: 2, pitchClass: 'D'}], [4, {midi: 4, pitchClass: 'E'}], [5, {midi: 6, pitchClass: 'F'}], [6, {midi: 7, pitchClass: 'G'}], [7, {midi: 9, pitchClass: 'A'}], [1, {midi: 11, pitchClass: 'B'}], [2, {midi: 1, pitchClass: 'C'}]]));
KeyScaleMidiMap.set('F#m', new Map([[3, {midi: 9, pitchClass: 'A'}], [4, {midi: 11, pitchClass: 'B'}], [5, {midi: 1, pitchClass: 'C'}], [6, {midi: 2, pitchClass: 'D'}], [7, {midi: 4, pitchClass: 'E'}], [1, {midi: 6, pitchClass: 'F'}], [2, {midi: 8, pitchClass: 'G'}]]));
KeyScaleMidiMap.set('C#m', new Map([[3, {midi: 4, pitchClass: 'E'}], [4, {midi: 6, pitchClass: 'F'}], [5, {midi: 8, pitchClass: 'G'}], [6, {midi: 9, pitchClass: 'A'}], [7, {midi: 11, pitchClass: 'B'}], [1, {midi: 1, pitchClass: 'C'}], [2, {midi: 3, pitchClass: 'D'}]]));
KeyScaleMidiMap.set('G#m', new Map([[3, {midi: 11, pitchClass: 'B'}], [4, {midi: 1, pitchClass: 'C'}], [5, {midi: 3, pitchClass: 'D'}], [6, {midi: 4, pitchClass: 'E'}], [7, {midi: 6, pitchClass: 'F'}], [1, {midi: 8, pitchClass: 'G'}], [2, {midi: 10, pitchClass: 'A'}]]));
KeyScaleMidiMap.set('D#m', new Map([[3, {midi: 6, pitchClass: 'F'}], [4, {midi: 8, pitchClass: 'G'}], [5, {midi: 10, pitchClass: 'A'}], [6, {midi: 11, pitchClass: 'B'}], [7, {midi: 1, pitchClass: 'C'}], [1, {midi: 3, pitchClass: 'D'}], [2, {midi: 5, pitchClass: 'E'}]]));
KeyScaleMidiMap.set('A#m', new Map([[3, {midi: 1, pitchClass: 'C'}], [4, {midi: 3, pitchClass: 'D'}], [5, {midi: 5, pitchClass: 'E'}], [6, {midi: 6, pitchClass: 'F'}], [7, {midi: 8, pitchClass: 'G'}], [1, {midi: 10, pitchClass: 'A'}], [2, {midi: 0, pitchClass: 'B'}]]));
KeyScaleMidiMap.set('Dm', new Map([[3, {midi: 5, pitchClass: 'F'}], [4, {midi: 7, pitchClass: 'G'}], [5, {midi: 9, pitchClass: 'A'}], [6, {midi: 10, pitchClass: 'B'}], [7, {midi: 0, pitchClass: 'C'}], [1, {midi: 2, pitchClass: 'D'}], [2, {midi: 4, pitchClass: 'E'}]]));
KeyScaleMidiMap.set('Gm', new Map([[3, {midi: 10, pitchClass: 'B'}], [4, {midi: 0, pitchClass: 'C'}], [5, {midi: 2, pitchClass: 'D'}], [6, {midi: 3, pitchClass: 'E'}], [7, {midi: 5, pitchClass: 'F'}], [1, {midi: 7, pitchClass: 'G'}], [2, {midi: 9, pitchClass: 'A'}]]));
KeyScaleMidiMap.set('Cm', new Map([[3, {midi: 3, pitchClass: 'E'}], [4, {midi: 5, pitchClass: 'F'}], [5, {midi: 7, pitchClass: 'G'}], [6, {midi: 8, pitchClass: 'A'}], [7, {midi: 10, pitchClass: 'B'}], [1, {midi: 0, pitchClass: 'C'}], [2, {midi: 2, pitchClass: 'D'}]]));
KeyScaleMidiMap.set('Fm', new Map([[3, {midi: 8, pitchClass: 'A'}], [4, {midi: 10, pitchClass: 'B'}], [5, {midi: 0, pitchClass: 'C'}], [6, {midi: 1, pitchClass: 'D'}], [7, {midi: 3, pitchClass: 'E'}], [1, {midi: 5, pitchClass: 'F'}], [2, {midi: 7, pitchClass: 'G'}]]));
KeyScaleMidiMap.set('Bbm', new Map([[3, {midi: 1, pitchClass: 'D'}], [4, {midi: 3, pitchClass: 'E'}], [5, {midi: 5, pitchClass: 'F'}], [6, {midi: 6, pitchClass: 'G'}], [7, {midi: 8, pitchClass: 'A'}], [1, {midi: 10, pitchClass: 'B'}], [2, {midi: 0, pitchClass: 'C'}]]));
KeyScaleMidiMap.set('Ebm', new Map([[3, {midi: 6, pitchClass: 'G'}], [4, {midi: 8, pitchClass: 'A'}], [5, {midi: 10, pitchClass: 'B'}], [6, {midi: 11, pitchClass: 'C'}], [7, {midi: 1, pitchClass: 'D'}], [1, {midi: 3, pitchClass: 'E'}], [2, {midi: 5, pitchClass: 'F'}]]));
KeyScaleMidiMap.set('Abm', new Map([[3, {midi: 11, pitchClass: 'C'}], [4, {midi: 1, pitchClass: 'D'}], [5, {midi: 3, pitchClass: 'E'}], [6, {midi: 4, pitchClass: 'F'}], [7, {midi: 6, pitchClass: 'G'}], [1, {midi: 8, pitchClass: 'A'}], [2, {midi: 10, pitchClass: 'B'}]]));

const ORDER_OF_SHARPS: PitchClass[] = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];
const ORDER_OF_FLATS = ORDER_OF_SHARPS.reverse();

type NumberOfSharpsFlats = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

const sharpsInKeyMap = new Map<KeySignature, NumberOfSharpsFlats>();
sharpsInKeyMap.set('C', 0);
sharpsInKeyMap.set('G', 1);
sharpsInKeyMap.set('D', 2);
sharpsInKeyMap.set('A', 3);
sharpsInKeyMap.set('E', 4);
sharpsInKeyMap.set('B', 5);
sharpsInKeyMap.set('F#', 6);
sharpsInKeyMap.set('C#', 7);
sharpsInKeyMap.set('Am', 0);
sharpsInKeyMap.set('Em', 1);
sharpsInKeyMap.set('Bm', 2);
sharpsInKeyMap.set('F#m', 3);
sharpsInKeyMap.set('C#m', 4);
sharpsInKeyMap.set('G#m', 5);
sharpsInKeyMap.set('D#m', 6);
sharpsInKeyMap.set('A#m', 7);

const flatsInKeyMap = new Map<KeySignature, NumberOfSharpsFlats>();
flatsInKeyMap.set('C', 0);
flatsInKeyMap.set('F', 1);
flatsInKeyMap.set('Bb', 2);
flatsInKeyMap.set('Eb', 3);
flatsInKeyMap.set('Ab', 4);
flatsInKeyMap.set('Db', 5);
flatsInKeyMap.set('Gb', 6);
flatsInKeyMap.set('Cb', 7);
flatsInKeyMap.set('Am', 0);
flatsInKeyMap.set('Dm', 1);
flatsInKeyMap.set('Gm', 2);
flatsInKeyMap.set('Cm', 3);
flatsInKeyMap.set('Fm', 4);
flatsInKeyMap.set('Bbm', 5);
flatsInKeyMap.set('Ebm', 6);
flatsInKeyMap.set('Abm', 7);

/**
 * Get object with accidental type and array of pitch classes of accidentals within given key
 * 
 * @param key 
 * @returns 
 */
export const getAccidentalsInKey = (key: KeySignature) => {
    const sharpCount = sharpsInKeyMap.get(key);
    const flatCount = flatsInKeyMap.get(key);

    const accidentalType: AccidentalSymbol = sharpCount !== undefined ? '#' : 'b';
    const accidentals: PitchClass[] = [];

    const result = {
        accidentalType,
        accidentals,
    };

    if (accidentalType === '#' && sharpCount !== undefined) {
        for (let i = 0; i < sharpCount; i++) result.accidentals.push(ORDER_OF_SHARPS[i]);
    }

    if (accidentalType === 'b' && flatCount !== undefined) {
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
    const result: Pitch = { degree: 1, register: cap.register, accidental: 0};
    const entries = KeyScaleMidiMap.get(key)?.entries();
    if (!entries) return result;
    result.degree = Array.from(entries).filter(entry => {
        return entry[1].pitchClass === cap.pitchClass;
    })[0][0];
    return result;
};

const pitchClassOrder: PitchClass[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

/**
 * Mutate given pitch cap to next highest pitch.
 * 
 * @param cap 
 */
export const raisePitchCap = (cap: PitchCap) => {
    if (cap.pitchClass === 'B') {
        cap.pitchClass = 'C';
        cap.register++;
        return;
    }
    const index = pitchClassOrder.indexOf(cap.pitchClass);
    cap.pitchClass = pitchClassOrder[index + 1];
};

export const pitchCapOrder: PitchCap[] = [];

for (
    const pitchCap: PitchCap = { pitchClass: 'A', register: 0 };
    pitchCap.pitchClass !== 'D' || pitchCap.register !== 8;
    raisePitchCap(pitchCap)
) {
    pitchCapOrder.push({ ...pitchCap });
}

const getIndexOfPitchCap = (cap: PitchCap) => {
    return pitchCapOrder.findIndex(c => c.pitchClass === cap.pitchClass && c.register === cap.register);
};

export const pitchCapIsLowerThan = (cap: PitchCap, against: PitchCap) => {
    const capIndex = getIndexOfPitchCap(cap)
    const againstIndex = getIndexOfPitchCap(against);
    if (capIndex < 0 || againstIndex < 0) return false;
    return capIndex < againstIndex;
};

export const pitchCapIsHigherThan = (cap: PitchCap, against: PitchCap) => {
    const capIndex = getIndexOfPitchCap(cap)
    const againstIndex = getIndexOfPitchCap(against);
    if (capIndex < 0 || againstIndex < 0) return false;
    return capIndex > againstIndex;
};

export type Harmony = 'I' | 'ii' | 'iii' | 'IV' | 'V' | 'vi' | 'viio' | 'i' | 'iio' | 'III' | 'iv' | 'V' | 'VI' | 'VII';

const HARMONY_MAJOR = new Map<Harmony, Harmony[]>();
HARMONY_MAJOR.set('I', ['ii', 'iii', 'IV', 'V', 'vi', 'viio']);
HARMONY_MAJOR.set('ii', ['viio', 'V']);
HARMONY_MAJOR.set('iii', ['vi']);
HARMONY_MAJOR.set('IV', ['ii', 'viio', 'V']);
HARMONY_MAJOR.set('V', ['I', 'vi']);
HARMONY_MAJOR.set('vi', ['IV', 'ii']);
HARMONY_MAJOR.set('viio', ['I']);

const HARMONY_MINOR = new Map<Harmony, Harmony[]>();
HARMONY_MINOR.set('i', ['iio', 'III', 'iv', 'V', 'VI', 'VII']);
HARMONY_MINOR.set('iio', ['viio', 'V']);
HARMONY_MINOR.set('III', ['VI', 'iv', 'iio']);
HARMONY_MINOR.set('iv', ['iio', 'viio', 'V']);
HARMONY_MINOR.set('V', ['VI', 'i']);
HARMONY_MINOR.set('VI', ['iv', 'iio']);
HARMONY_MINOR.set('viio', ['i']);
HARMONY_MINOR.set('VII', ['III'])

export const getNextMajorHarmony = (currentHarmony: Harmony) => {
    const options = HARMONY_MAJOR.get(currentHarmony);
    if (options === undefined) {
        console.error('Major harmony undefined.');
        return 'I';
    }
    return options[Math.floor(Math.random() * options.length)];
};

export const getNextMinorHarmony = (currentHarmony: Harmony) => {
    const options = HARMONY_MINOR.get(currentHarmony);
    if (options === undefined) {
        console.error('Minor harmony undefined');
        return 'i';
    }
    return options[Math.floor(Math.random() * options.length)];
};

const getDegreeAccidentalsInHarmony = (key: KeySignature, harmony: Harmony): DegreeAccidental[] => {
    // this list will have to be added to over time, for now we're just covering most expected harmony

    // diatonic
    if (harmony === 'I' || harmony === 'i') return [{ degree: 1, accidental: 0}, { degree: 3, accidental: 0}, { degree: 5, accidental: 0}];
    if (harmony === 'ii' || harmony === 'iio') return [{ degree: 2, accidental: 0}, { degree: 4, accidental: 0}, { degree: 6, accidental: 0}];
    if (harmony === 'iii' || harmony === 'III') return [{ degree: 3, accidental: 0}, { degree: 5, accidental: 0}, { degree: 7, accidental: 0}];
    if (harmony === 'IV' || harmony === 'iv') return [{ degree: 4, accidental: 0}, { degree: 6, accidental: 0}, { degree: 1, accidental: 0}];
    if (harmony === 'V') {
        if (isMajorKey(key)) return [{ degree: 5, accidental: 0}, { degree: 7, accidental: 0}, { degree: 2, accidental: 0}];
        else return [{ degree: 5, accidental: 0}, { degree: 7, accidental: 1}, { degree: 2, accidental: 0}];
    }
    if (harmony === 'VI' || harmony === 'vi') return [{ degree: 6, accidental: 0}, { degree: 1, accidental: 0}, { degree: 3, accidental: 0}];
    if (harmony === 'VII' || harmony === 'viio') return [{ degree: 7, accidental: 0}, { degree: 2, accidental: 0}, { degree: 4, accidental: 0}];

    return [];
};

export const getIsPitchInHarmony = (pitch: Pitch, key: KeySignature, harmony: Harmony) => {
    const pitches = getDegreeAccidentalsInHarmony(key, harmony);
    for (let i = 0; i < pitches.length; i++) {
        if (pitches[i].degree === pitch.degree && pitches[i].accidental === pitch.accidental) return true;
    }
    return false;
};
