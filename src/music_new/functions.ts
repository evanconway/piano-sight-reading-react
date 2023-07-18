import abcjs from "abcjs";
import { Chord, KeyScaleMidiMap, KeySignature, Measure, NoteDuration, Pitch, PitchCap, TimeSignature, getAccidentalsInKey, getMeasureDuration, getMeasureWidth, getNoteDurationValue, getPitchFromPitchCap, raisePitchCap } from "./models";
import { SCORE_ID, SCREEN_SIZE_STYLES } from "../constants";

/**
 * Returns the midi value of the given pitch and key signature.
 * 
 * @param keySignature 
 * @param pitch 
 * @returns 
 */
export const getMidiOfPitch = (keySignature: KeySignature, pitch: Pitch) => {
    const scaleMidiMap = KeyScaleMidiMap.get(keySignature);
    const baseMidi = scaleMidiMap?.get(pitch.scaleDegree)?.midi;
    if (baseMidi === undefined) return 0;
    return baseMidi + pitch.accidental + (pitch.register + 1) * 12;
};

/**
 * Returns new pitch object advanced to next step in given key signature.
 * Ignore accidentals.
 * 
 * @param key 
 * @param pitch 
 */
export const getPitchAdvanced = (key: KeySignature, pitch: Pitch) => {
    const pitchClass = KeyScaleMidiMap.get(key)?.get(pitch.scaleDegree)?.pitchClass;
    if (pitchClass === undefined) return { ...pitch }; // probably a terrible idea, fix later
    return { 
        scaleDegree: pitch.scaleDegree >= 7 ? 1 : pitch.scaleDegree + 1,
        register: pitchClass === "B" ? pitch.register + 1 : pitch.register,
        accidental: 0,
     } as Pitch;
};

/**
 * Returns a chord of random pitches in the given key. Pitches will not be higher or lower than the given caps. Pitches
 * will not be more than an octave apart. Pitches will be in given harmony if supplied.
 * 
 * @param duration 
 * @param keySig 
 * @param highest highest possible note in the chord
 * @param lowest lowest possible note in the chord
 * @param harmony 
 * @returns {Chord} 
 */
const getRandomChord = (
    duration: NoteDuration,
    keySig: KeySignature,
    numberOfPitches: number,
    highest: Pitch,
    lowest: Pitch,
    harmony?: string, // not implemented yet
) => {
    const result: Chord = { duration, pitches: [], pathId: "" };
    // prepare array of pitches in given key starting at lowest pitch and ending at highest
    let possiblePitches: Pitch[] = [];
    let pitchToAdd = {...lowest};
    const midiOfPitchHighest = getMidiOfPitch(keySig, highest);
    let midiOfPitchToAdd = getMidiOfPitch(keySig, pitchToAdd);
    while (midiOfPitchToAdd <= midiOfPitchHighest) {
        possiblePitches.push({ ...pitchToAdd });
        pitchToAdd = getPitchAdvanced(keySig, pitchToAdd);
        midiOfPitchToAdd = getMidiOfPitch(keySig, pitchToAdd);
    }
    // add pitches to result, ensuring already added pitches, and pitches outside of octave limit are removed
    for (let i = 0; i < numberOfPitches; i++) {
        const newPitchIndex = Math.floor(Math.random() * possiblePitches.length);
        result.pitches.push(possiblePitches[newPitchIndex]);
        result.pitches.sort((a, b) => getMidiOfPitch(keySig, a) - getMidiOfPitch(keySig, b));
        possiblePitches = possiblePitches.filter((p, i) => {
            if (i === newPitchIndex) return false;
            const midiOfPitch = getMidiOfPitch(keySig, p);
            const midiMax = getMidiOfPitch(keySig, result.pitches[0]) + 12;
            const midiMin = getMidiOfPitch(keySig, result.pitches[result.pitches.length - 1]) - 12;
            if (midiOfPitch > midiMax) return false;
            if (midiOfPitch <= midiMin) return false;
            return true;
        });
    }
    return result;
};

export interface RandomMusicParams {
    numberOfMeasures: number,
    keySignature: KeySignature,
    timeSignature: TimeSignature,
    topStaffDuration: NoteDuration,
    topStaffHighestPitch: PitchCap,
    topStaffLowestPitch: PitchCap,
    topStaffNotesPerChord: number,
    bottomStaffDuration: NoteDuration,
    bottomStaffHighestPitch: PitchCap,
    bottomStaffLowestPitch: PitchCap,
    bottomStaffNotesPerChord: number,
}

/**
 * Returns an array of measure objects with randomly generated music.
 * 
 * @param params 
 * @returns 
 */
export const generateRandomMusic = (params: RandomMusicParams) => {
    const {
        numberOfMeasures,
        keySignature,
        timeSignature,
        topStaffDuration,
        topStaffHighestPitch,
        topStaffLowestPitch,
        topStaffNotesPerChord,
        bottomStaffDuration,
        bottomStaffHighestPitch,
        bottomStaffLowestPitch,
        bottomStaffNotesPerChord,
    } = params;

    // get duration values from duration type
    const topValue = getNoteDurationValue(topStaffDuration);
    const bottomValue = getNoteDurationValue(bottomStaffDuration);

    /*
    We assume an eigth note has a "value" of 12. Based on the given time signature
    we ensure both the top and bottom staff chord arrays have enough entries. For
    example a time signature of 4/4 yields an array size of 96.
    */
    const mSize = getMeasureDuration(timeSignature);

    const pathIdBase = "abc-note-path-id-";
    let pathIdCount = 0;

    // this is not creating the id numbers we're expecting, but it still "works" so we'll go with it for now

    const result = [...Array(numberOfMeasures)].map(() => {
        const staffTop = [...Array(mSize)].map((_, i) => {
            if (i % topValue !== 0) return null;
            const chord = getRandomChord(
                topStaffDuration,
                keySignature,
                topStaffNotesPerChord,
                getPitchFromPitchCap(keySignature, topStaffHighestPitch),
                getPitchFromPitchCap(keySignature, topStaffLowestPitch),
            );
            chord.pathId = pathIdBase + pathIdCount;
            pathIdCount++;
            return chord;
        });

        const staffBottom = [...Array(mSize)].map((_, i) => {
            if (i % bottomValue !== 0) return null;
            const chord = getRandomChord(
                bottomStaffDuration,
                keySignature,
                bottomStaffNotesPerChord,
                getPitchFromPitchCap(keySignature, bottomStaffHighestPitch),
                getPitchFromPitchCap(keySignature, bottomStaffLowestPitch),
            );
            chord.pathId = pathIdBase + pathIdCount;
            pathIdCount++;
            return chord;
        });

        return {
            keySignature,
            timeSignature,
            staffTop,
            staffBottom,
        } as Measure;
    });

    return result;
};

/**
 * Returns the abc notation of a pitch given a pitch and key signature.
 * 
 * @param pitch 
 * @param keySignature 
 * @returns 
 */
const getAbcPitchFromPitch = (pitch: Pitch, keySignature: KeySignature) => {
    const pitchData = KeyScaleMidiMap.get(keySignature)?.get(pitch.scaleDegree);
    if (!pitchData) return "";
    let result = pitchData.pitchClass as string;
    if (pitch.register === 0) result += ",,,,";
    if (pitch.register === 1) result += ",,,";
    if (pitch.register === 2) result += ",,";
    if (pitch.register === 3) result += ",";
    if (pitch.register >= 5) result = result.toLocaleLowerCase();
    if (pitch.register === 6) result += "'";
    if (pitch.register === 7) result += "''";
    if (pitch.register === 8) result += "'''";
    // need to add accidentals
    return result;
};

/**
 * Return array of pitch cap objects within given range.
 * 
 * @param min 
 * @param max 
 * @returns 
 */
export const getPitchCapsInRange = (min: PitchCap, max: PitchCap) => {
    const result: PitchCap[] = [];
    const pitchCap: PitchCap = { ...min };
    while (pitchCap.pitchClass !== max.pitchClass || pitchCap.register !== max.register) {
        result.push({...pitchCap});
        raisePitchCap(pitchCap);
    }
    result.push({ ...max });
    return result;
};

/**
 * Get given pitch cap as string using given key signature.
 * 
 * @param pitchCap 
 * @param key 
 * @returns 
 */
export const getPitchCapString = (pitchCap: PitchCap, key: KeySignature) => {
    const { accidentalType, accidentals } = getAccidentalsInKey(key);
    const accidental = accidentals.includes(pitchCap.pitchClass) ? accidentalType : "";
    return pitchCap.pitchClass + accidental + pitchCap.register;
};

/**
 * Returns the ABC notation string for the top or bottom staff of the given measure.
 * 
 * @param measure 
 * @param staff 
 * @returns 
 */
const getAbcStringFromMeasureStaff = (measure: Measure, staff: "top" | "bottom") => {
    const chords = staff === "top" ? measure.staffTop : measure.staffBottom;
    let result = "";

    // logic to determine where to break beams
    let beamBreakIndexes: number[] = [];
    const divisions = measure.timeSignature === "4/4" ? 4 : measure.timeSignature === "3/4" ? 3 : 2;
    const sdlkfjsdf = chords.length / divisions;
    if (Math.floor(sdlkfjsdf) !== sdlkfjsdf) throw new Error("measure staff lengths must be multiples of 12");
    for (let i = 1; i < divisions; i++) beamBreakIndexes.push(sdlkfjsdf * i);

    // create staff string from chords
    chords.forEach((chord, i) => {
        if (beamBreakIndexes.includes(i)) result += " ";
        if (!chord) return;
        if (chord.pitches.length > 1) result += "[";
        chord.pitches.forEach(p => {
            result += getAbcPitchFromPitch(p, measure.keySignature);
        });
        if (chord.pitches.length > 1) result += "]";
        result += getNoteDurationValue(chord.duration);
    });
    return result;
};

const getAbcPaddingXFromWidth = (width: number) => {
    if (width < SCREEN_SIZE_STYLES.PHONE.SIZE) return SCREEN_SIZE_STYLES.PHONE.PADDING_X;
    if (width < SCREEN_SIZE_STYLES.TABLET.SIZE) return SCREEN_SIZE_STYLES.TABLET.PADDING_X;
    return SCREEN_SIZE_STYLES.DESKTOP.PADDING_X;
};

const getAbcPaddingBottomFromWidth = (width: number) => {
    if (width < SCREEN_SIZE_STYLES.PHONE.SIZE) return SCREEN_SIZE_STYLES.PHONE.PADDING_BOTTOM;
    if (width < SCREEN_SIZE_STYLES.TABLET.SIZE) return SCREEN_SIZE_STYLES.TABLET.PADDING_BOTTOM;
    return SCREEN_SIZE_STYLES.DESKTOP.PADDING_BOTTOM;
};

const getAbcScaleFromWidth = (width: number) => {
    if (width < SCREEN_SIZE_STYLES.PHONE.SIZE) return SCREEN_SIZE_STYLES.PHONE.SCALE;
    if (width < SCREEN_SIZE_STYLES.TABLET.SIZE) return SCREEN_SIZE_STYLES.TABLET.SCALE;
    return SCREEN_SIZE_STYLES.DESKTOP.SCALE;
};

/**
 * Renders the given array of measures to the score.
 * 
 * @param measures 
 * @param width 
 * @returns 
 */
export const renderAbcjs = (measures: Measure[], width: number, onClick: (e: abcjs.AbcElem) => void) => {
    //prepare string
    const firstM = measures[0]; // first measure to get values from

    let abcString = "T:Sight Reading Practice\n";
    abcString += `M:${firstM.timeSignature}\n`;
    abcString += `L:1/${getMeasureDuration(firstM.timeSignature)}\n`;
    abcString += `K:${firstM.keySignature}\n`;
    abcString += `%%staves {1 2}\n`;

    // prepare layout
    const scoreBoundingRect = document.querySelector("#score")?.getBoundingClientRect();
    if (!scoreBoundingRect) return;

    const measuresPerLine = Math.ceil(scoreBoundingRect.width / getMeasureWidth(firstM));

    let measureStartingLine = 0;

    /*
    Because of how abcjs strings are written out, we have to write this out line by line, and staff
    by staff. To be extra clear, we have to do top staff line 1, then bottom staff line 1, then top
    staff line 2, then bottom staff line 2, and so on.
    */
    let writing = true;
    while (writing) {
        abcString += `V:1\n[K:${firstM.keySignature} clef=treble]\n`;
        for (let i = measureStartingLine; i < measureStartingLine + measuresPerLine && i < measures.length; i++) {
            abcString += getAbcStringFromMeasureStaff(measures[i], "top");// getAbcStringFromChordArray(measures[i].staffTop, measures[i].keySignature);
            abcString += "|";
            if (i === measures.length - 1) abcString += "]";
        }
        abcString += "\n";
        abcString += `V:2\n[K:${firstM.keySignature} clef=bass]\n`;
        for (let i = measureStartingLine; i < measureStartingLine + measuresPerLine && i < measures.length; i++) {
            abcString += getAbcStringFromMeasureStaff(measures[i], "bottom");// getAbcStringFromChordArray(measures[i].staffBottom, measures[i].keySignature);
            abcString += "|";
            if (i === measures.length - 1) abcString += "]";
        }
        abcString += "\n";
        measureStartingLine = measureStartingLine + measuresPerLine;
        if (measureStartingLine >= measures.length) writing = false;
    }

    abcjs.renderAbc(SCORE_ID, abcString, {
        add_classes: true,
        selectionColor: "#000",
        staffwidth: width - getAbcPaddingXFromWidth(width) * 2,
        paddingleft: getAbcPaddingXFromWidth(width),
        paddingright: getAbcPaddingXFromWidth(width),
        paddingbottom: getAbcPaddingBottomFromWidth(width),
        scale: getAbcScaleFromWidth(width),
        clickListener: onClick,
    });

    const pathsTop = Array.from(document.querySelectorAll("g.abcjs-note.abcjs-v0"));
    const pathsBot = Array.from(document.querySelectorAll("g.abcjs-note.abcjs-v1"));

    let pathsTopIndex = 0;
    let pathsBotIndex = 0;

    // iterate over all top staff chords
    measures.forEach(m => m.staffTop.forEach(c => {
        if (c === null) return;
        pathsTop[pathsTopIndex++].id = c.pathId;
    }));
    measures.forEach(m => m.staffBottom.forEach(c => {
        if (c === null) return;
        pathsBot[pathsBotIndex++].id = c.pathId;
    }));
};
