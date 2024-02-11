import abcjs from "abcjs";
import { Chord, KeyScaleMidiMap, KeySignature, Measure, NOTE_DURATION_BASE, NOTE_WIDTH, NoteDuration, Pitch, PitchCap, TimeSignature, getAccidentalsInKey, getMeasureDuration, getMeasureWidth, getNoteDurationValue, getPitchFromPitchCap, raisePitchCap } from "./models";
import { SCORE_ELEMENT_HEIGHT_STYLE, SCORE_ID, SCORE_SCREEN_SIZE_STYLES } from "../constants";

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

/**
 * Get number of quarters notes per given note duration.
 * 
 * @param noteDuration 
 * @returns 
 */
const getNotesPerQuarter = (noteDuration: NoteDuration) => {
    if (noteDuration === "whole") return 1/4;
    if (noteDuration === "half") return 1/2;
    if (noteDuration === "quarter") return 1;
    if (noteDuration === "eighth") return 2;
    if (noteDuration === "sixteenth") return 4;
    if (noteDuration === "half-dotted") return 1/3;
    if (noteDuration === "quarter-dotted") return 2/3;
    return 0;
};

/**
 * Determines how wide each measure with the given preferences would be in pixels.
 * 
 * @param userPreferences 
 * @returns 
 */
export const getMeasureWidthFromUserSettings = (
    timeSignature: TimeSignature,
    topStaffDuration: NoteDuration,
    bottomStaffDuration: NoteDuration,
) => {
    const numberOfQuarters = timeSignature === "4/4" ? 4 : 3;
    const notesPerQuarterTop = getNotesPerQuarter(topStaffDuration);
    const notesPerQuarterBottom = getNotesPerQuarter(bottomStaffDuration);
    const result = notesPerQuarterTop > notesPerQuarterBottom ? numberOfQuarters * notesPerQuarterTop : numberOfQuarters * notesPerQuarterBottom;
    return Math.max(result * NOTE_WIDTH, 50);
};

export interface RandomMusicParams {
    numberOfLines: number,
    measuresPerLine: number,
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
        numberOfLines,
        measuresPerLine,
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

    const mSize = getMeasureDuration(timeSignature);

    const pathIdBase = "abc-note-path-id-";
    let pathIdCount = 0;

    const music: Measure[][] = [];

    for (let lines = 0; lines < numberOfLines; lines++) {
        const line: Measure[] = [];
        for (let measures = 0; measures < measuresPerLine; measures++) {
            line.push({
                keySignature,
                timeSignature,
                staffTop: [...Array(mSize)].map((_, i) => {
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
                }),
                staffBottom: [...Array(mSize)].map((_, i) => {
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
                }),
            });
        }
        music.push(line);
    }

    return music;
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
    const beamBreakIndexes: number[] = [];
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

export const getScorePaddingXFromWidth = (width: number) => {
    // if (width < SCORE_SCREEN_SIZE_STYLES.PHONE.SIZE) return SCORE_SCREEN_SIZE_STYLES.PHONE.PADDING_X;
    // if (width < SCORE_SCREEN_SIZE_STYLES.TABLET.SIZE) return SCORE_SCREEN_SIZE_STYLES.TABLET.PADDING_X;
    return SCORE_SCREEN_SIZE_STYLES.DESKTOP.PADDING_X;
};

export const getScorePaddingBottomFromWidth = (width: number) => {
    // if (width < SCORE_SCREEN_SIZE_STYLES.PHONE.SIZE) return SCORE_SCREEN_SIZE_STYLES.PHONE.PADDING_BOTTOM;
    // if (width < SCORE_SCREEN_SIZE_STYLES.TABLET.SIZE) return SCORE_SCREEN_SIZE_STYLES.TABLET.PADDING_BOTTOM;
    return SCORE_SCREEN_SIZE_STYLES.DESKTOP.PADDING_BOTTOM;
};

export const getScoreScaleFromWidth = (width: number) => {
    // if (width < SCORE_SCREEN_SIZE_STYLES.PHONE.SIZE) return SCORE_SCREEN_SIZE_STYLES.PHONE.SCALE;
    // if (width < SCORE_SCREEN_SIZE_STYLES.TABLET.SIZE) return SCORE_SCREEN_SIZE_STYLES.TABLET.SCALE;
    return SCORE_SCREEN_SIZE_STYLES.DESKTOP.SCALE;
};

/**
 * A simple division function. But helps ensure consistency.
 * 
 * @param lineWidth 
 * @param measureWidth 
 */
export const getMeasuresPerLine = (lineWidth: number, measureWidth: number) => {
    return Math.max(Math.floor(lineWidth / measureWidth), 1);
};

/**
 * Renders the given array of measures to the score.
 * https://paulrosen.github.io/abcjs/
 * https://abcnotation.com/wiki/abc:standard:v2.1
 * 
 * @param lines 
 * @param width 
 * @returns 
 */
export const renderAbcjsToScore = (lines: Measure[][], onClick: (e: abcjs.AbcElem) => void) => {
    //prepare string
    const firstM = lines[0][0]; // first measure to get values from

    let abcString = "";//"T:Sight Reading Practice\n";
    abcString += `M:${firstM.timeSignature}\n`;
    abcString += `L:1/${NOTE_DURATION_BASE}\n`;
    abcString += `K:${firstM.keySignature}\n`;
    abcString += `%%stretchlast`;
    abcString += `%%staves {1 2}\n`;

    /*
    Because of how abcjs strings are written out, we have to write this out line by line, and staff
    by staff. To be extra clear, we have to do top staff line 1, then bottom staff line 1, then top
    staff line 2, then bottom staff line 2, and so on.
    */
    lines.forEach((line, iLine) => {
        // top staff
        abcString += `V:1\n[K:${firstM.keySignature} clef=treble]\n`;
        line.forEach((measure, iMeasure) => {
            abcString += getAbcStringFromMeasureStaff(measure, 'top');
            abcString += ' |';
            if (iLine === lines.length - 1 && iMeasure === line.length - 1) abcString += ']';
        });
        abcString += '\n';
        // bottom staff
        abcString += `V:2\n[K:${firstM.keySignature} clef=bass]\n`;
        line.forEach((measure, iMeasure) => {
            abcString += getAbcStringFromMeasureStaff(measure, 'bottom');
            abcString += ' |';
            if (iLine === lines.length - 1 && iMeasure === line.length - 1) abcString += ']';
        });
        abcString += '\n';
    });

    abcjs.renderAbc(SCORE_ID, abcString, {
        add_classes: true,
        selectionColor: "#000",
        clickListener: onClick,
    });

    // iterate over all staff chords
    // assign path ids to abcjs generated values
    const pathsTop = Array.from(document.querySelectorAll("g.abcjs-note.abcjs-v0"));
    const pathsBot = Array.from(document.querySelectorAll("g.abcjs-note.abcjs-v1"));
    let pathsTopIndex = 0;
    let pathsBotIndex = 0;
    lines.forEach(line => {
        line.forEach(measure => {
            measure.staffTop.forEach(chord => {
                if (chord === null) return;
                pathsTop[pathsTopIndex++].id = chord.pathId;
            });
            measure.staffBottom.forEach(chord => {
                if (chord === null) return;
                pathsBot[pathsBotIndex++].id = chord.pathId;
            });
        });
    });
};
