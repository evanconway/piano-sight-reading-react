import abcjs from "abcjs";
import { Chord, KeyScaleMidiMap, KeySignature, Measure, NoteDuration, Pitch, TimeSignature, getMeasureDuration, getMeasureWidth, getNoteDurationValue } from "./models";
import { SCORE_ID, SCREEN_SIZE_STYLES } from "../constants";

/**
 * Returns the midi value of the given pitch and key signature.
 * 
 * @param keySignature 
 * @param pitch 
 * @returns 
 */
export const midiOfPitch = (keySignature: KeySignature, pitch: Pitch) => {
    const scaleMidiMap = KeyScaleMidiMap.get(keySignature);
    const baseMidi = scaleMidiMap?.get(pitch.scaleDegree)?.midi;
    if (baseMidi === undefined) return 0;
    return baseMidi + pitch.accidental + (pitch.register + 1) * 12;
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
    //debugger;
    const result: Chord = { duration, pitches: [], pathId: "" };
    // prepare array of pitches in given key starting at lowest pitch and ending at highest
    let possiblePitches: Pitch[] = [];
    let pitchToAdd = {...lowest};
    const midiOfPitchHighest = midiOfPitch(keySig, highest);
    let midiOfPitchToAdd = midiOfPitch(keySig, pitchToAdd);
    while (midiOfPitchToAdd <= midiOfPitchHighest) {
        possiblePitches.push(pitchToAdd);
        pitchToAdd = {...pitchToAdd};
        pitchToAdd.scaleDegree++;
        if (pitchToAdd.scaleDegree > 7) {
            pitchToAdd.scaleDegree = 1;
            pitchToAdd.register++;
        }
        midiOfPitchToAdd = midiOfPitch(keySig, pitchToAdd);
    }
    // add pitches to result, ensuring already added pitches, and pitches outside of octave limit are removed
    for (let i = 0; i < numberOfPitches; i++) {
        const newPitchIndex = Math.floor(Math.random() * possiblePitches.length);
        result.pitches.push(possiblePitches[newPitchIndex]);
        result.pitches.sort((a, b) => midiOfPitch(keySig, a) - midiOfPitch(keySig, b));
        possiblePitches = possiblePitches.filter((p, i) => {
            if (i === newPitchIndex) return false;
            if (midiOfPitch(keySig, p) > midiOfPitch(keySig, result.pitches[0]) + 12) return false;
            if (midiOfPitch(keySig, p) <= midiOfPitch(keySig, result.pitches[result.pitches.length - 1]) - 12) return false;
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
    topStaffHighestPitch: Pitch,
    topStaffLowestPitch: Pitch,
    topStaffNotesPerChord: number,
    bottomStaffDuration: NoteDuration,
    bottomStaffHighestPitch: Pitch,
    bottomStaffLowestPitch: Pitch,
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
                topStaffHighestPitch,
                topStaffLowestPitch,
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
                bottomStaffHighestPitch,
                bottomStaffLowestPitch,
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
 * Returns an abc string for a given array of chords.
 * 
 * @param staff 
 * @param keySignature 
 * @returns 
 */
const getAbcStringFromChordArray = (staff: (Chord | null)[], keySignature: KeySignature) => {
    let result = "";
    staff.forEach(chord => {
        if (!chord) return;
        if (chord.pitches.length > 1) result += "[";
        chord.pitches.forEach(p => {
            result += getAbcPitchFromPitch(p, keySignature);
        });
        if (chord.pitches.length > 1) result += "]";
        result += getNoteDurationValue(chord.duration);
        result += " ";
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
            abcString += getAbcStringFromChordArray(measures[i].staffTop, measures[i].keySignature);
            abcString += "|";
            if (i === measures.length - 1) abcString += "]";
        }
        abcString += "\n";
        abcString += `V:2\n[K:${firstM.keySignature} clef=bass]\n`;
        for (let i = measureStartingLine; i < measureStartingLine + measuresPerLine && i < measures.length; i++) {
            abcString += getAbcStringFromChordArray(measures[i].staffBottom, measures[i].keySignature);
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
