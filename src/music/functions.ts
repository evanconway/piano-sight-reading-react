import abcjs from "abcjs";
import { Chord, Harmony, KeyScaleMidiMap, KeySignature, Measure, NOTE_DURATION_BASE, NOTE_WIDTH, NoteDuration, Pitch, PitchCap, TimeSignature, getAccidentalsInKey, getIsPitchInHarmony, getMeasureDuration, getNextMajorHarmony, getNoteDurationValue, getPitchFromPitchCap, isMajorKey, raisePitchCap } from "./models";
import { SCORE_ELEMENT_HEIGHT_STYLE, SCORE_ELEMENT_WIDTH_STYLE, SCORE_ID, SCORE_SCREEN_SIZE_STYLES } from "../constants";

/**
 * Returns the midi value of the given pitch and key signature.
 * 
 * @param keySignature 
 * @param pitch 
 * @returns 
 */
export const getMidiOfPitch = (keySignature: KeySignature, pitch: Pitch) => {
    const scaleMidiMap = KeyScaleMidiMap.get(keySignature);
    const baseMidi = scaleMidiMap?.get(pitch.degree)?.midi;
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
    const pitchClass = KeyScaleMidiMap.get(key)?.get(pitch.degree)?.pitchClass;
    if (pitchClass === undefined) return { ...pitch }; // probably a terrible idea, fix later
    return { 
        degree: pitch.degree >= 7 ? 1 : pitch.degree + 1,
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
    harmony?: Harmony,
) => {
    debugger;
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

    // remove non-harmony pitches if defined
    if (harmony !== undefined) {
        possiblePitches = possiblePitches.filter(p => getIsPitchInHarmony(p, keySig, harmony));
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
    useHarmony: boolean,
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
export const generateRandomMusic = (params: RandomMusicParams): Measure[] => {
    const {
        numberOfLines,
        measuresPerLine,
        keySignature,
        timeSignature,
        useHarmony,
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
    const keyIsMajor = isMajorKey(keySignature);
    let pathIdCount = 0;
    let harmony: Harmony =  keyIsMajor ? 'I' : 'i';

    /*
    Originally we assigned path ids to the entire top staff then the entire bottom staff. Since changing how music
    is stored and changing this loop, we now assign them chord by chord. This shouldn't break cursor highlighting,
    but if it does check here first.
    */
    return [...Array(numberOfLines * measuresPerLine)].map(() => ({
        keySignature,
        timeSignature,
        staffChords: [...Array(mSize)].map((_, i) => {
            const addChordTop = i % topValue === 0;
            const addChordBottom = i % bottomValue === 0;

            if (useHarmony && i > 0 && addChordTop && addChordBottom) {
                harmony = keyIsMajor ? getNextMajorHarmony(harmony) : getNextMajorHarmony(harmony);
            }

            const chordTop = addChordTop ? getRandomChord(
                topStaffDuration,
                keySignature,
                topStaffNotesPerChord,
                getPitchFromPitchCap(keySignature, topStaffHighestPitch),
                getPitchFromPitchCap(keySignature, topStaffLowestPitch),
                useHarmony ? harmony : undefined,
            ) : null;
            if (chordTop !== null) chordTop.pathId = pathIdBase + pathIdCount++;
            const chordBottom = addChordBottom ? getRandomChord(
                bottomStaffDuration,
                keySignature,
                bottomStaffNotesPerChord,
                getPitchFromPitchCap(keySignature, bottomStaffHighestPitch),
                getPitchFromPitchCap(keySignature, bottomStaffLowestPitch),
                useHarmony ? harmony : undefined,
            ) : null;
            if (chordBottom !== null) chordBottom.pathId = pathIdBase + pathIdCount++;
            return { top: chordTop, bottom: chordBottom };
        }),
    }));
};

/**
 * Returns the abc notation of a pitch given a pitch and key signature.
 * 
 * @param pitch 
 * @param keySignature 
 * @returns 
 */
const getAbcPitchFromPitch = (pitch: Pitch, keySignature: KeySignature) => {
    const pitchData = KeyScaleMidiMap.get(keySignature)?.get(pitch.degree);
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
const getAbcStringFromMeasureStaff = (measure: Measure, staff: 'top' | 'bottom') => {
    const chords = measure.staffChords.map(s => staff === 'top' ? s.top : s.bottom);
    let result = '';

    // logic to determine where to break beams
    const beamBreakIndexes: number[] = [];
    const divisions = measure.timeSignature === '4/4' ? 4 : measure.timeSignature === '3/4' ? 3 : 2;
    const breakInterval = chords.length / divisions;
    if (Math.floor(breakInterval) !== breakInterval) throw new Error('measure staff lengths must be multiples of 12');
    for (let i = 1; i < divisions; i++) beamBreakIndexes.push(breakInterval * i);

    // create staff string from chords
    let pitchesEncountered = false;
    chords.forEach((chord, i) => {
        if (beamBreakIndexes.includes(i)) result += ' ';
        if (!chord) return;
        
        // TODO: Rewrite. Not sure why I struggle to make this simpler.
        if (chord.pitches.length > 1) result += '[';
        chord.pitches.forEach(p => {
            result += getAbcPitchFromPitch(p, measure.keySignature);
        });
        if (chord.pitches.length > 1) result += ']';

        result += getNoteDurationValue(chord.duration);
        if (chord.pitches.length > 0) pitchesEncountered = true;
    });

    return pitchesEncountered ? result : `z${measure.staffChords.length}`;
};

export const getScorePaddingXFromWidth = () => {
    // if (width < SCORE_SCREEN_SIZE_STYLES.PHONE.SIZE) return SCORE_SCREEN_SIZE_STYLES.PHONE.PADDING_X;
    // if (width < SCORE_SCREEN_SIZE_STYLES.TABLET.SIZE) return SCORE_SCREEN_SIZE_STYLES.TABLET.PADDING_X;
    return SCORE_SCREEN_SIZE_STYLES.DESKTOP.PADDING_X;
};

export const getScorePaddingBottomFromWidth = () => {
    // if (width < SCORE_SCREEN_SIZE_STYLES.PHONE.SIZE) return SCORE_SCREEN_SIZE_STYLES.PHONE.PADDING_BOTTOM;
    // if (width < SCORE_SCREEN_SIZE_STYLES.TABLET.SIZE) return SCORE_SCREEN_SIZE_STYLES.TABLET.PADDING_BOTTOM;
    return SCORE_SCREEN_SIZE_STYLES.DESKTOP.PADDING_BOTTOM;
};

export const getScoreScaleFromWidth = () => {
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
 * @param measures 
 * @param width 
 * @returns 
 */
export const renderAbcjsToScore = (
    measures: Measure[],
    width: number,
    onClick: (e: abcjs.AbcElem) => void,
    options?: {
        measuresPerLine?: number,
    },
) => {

    //prepare string
    const firstM = measures[0]; // first measure to get values from

    let abcString = '';//"T:Sight Reading Practice\n";
    abcString += `M:${firstM.timeSignature}\n`;
    abcString += `L:1/${NOTE_DURATION_BASE}\n`;
    abcString += `K:${firstM.keySignature}\n`;
    abcString += `%%stretchlast\n`;
    if (options !== undefined && options.measuresPerLine !== undefined) abcString += `%%barsperstaff ${options.measuresPerLine}\n`;
    abcString += `%%staves {1 2}\n`;

    // prepare layout
    const scoreBoundingRect = document.querySelector("#score")?.getBoundingClientRect();
    if (!scoreBoundingRect) return;

    // top staff
    abcString += `V:1\n[K:${firstM.keySignature} clef=treble]\n`;
    measures.forEach(measure => {
        abcString += getAbcStringFromMeasureStaff(measure, 'top');
        abcString += ' |';
    });
    abcString += ']\n';

    // bottom staff
    abcString += `V:2\n[K:${firstM.keySignature} clef=bass]\n`;
    measures.forEach(measure => {
        abcString += getAbcStringFromMeasureStaff(measure, 'bottom');
        abcString += ' |';
    });
    abcString += ']\n';

    const paddingX = getScorePaddingXFromWidth();

    abcjs.renderAbc(SCORE_ID, abcString, {
        add_classes: true,
        selectionColor: "#000",
        staffwidth: width - paddingX * 2,
        paddingleft: paddingX,
        paddingright: paddingX,
        paddingbottom: getScorePaddingBottomFromWidth(),
        scale: getScoreScaleFromWidth(),
        clickListener: onClick,
    });

    const pathsTop = Array.from(document.querySelectorAll("g.abcjs-note.abcjs-v0"));
    const pathsBot = Array.from(document.querySelectorAll("g.abcjs-note.abcjs-v1"));

    let pathsTopIndex = 0;
    let pathsBotIndex = 0;

    // assign path Ids to abcjs generated elements
    if (pathsTop.length > 0) measures.forEach(measure => measure.staffChords.forEach(entry => {
        if (entry.top !== null) {
            pathsTop[pathsTopIndex++].id = entry.top.pathId;
        }
    }));
    if (pathsBot.length > 0) measures.forEach(measure => measure.staffChords.forEach(entry => {
        if (entry.bottom !== null) {
            pathsBot[pathsBotIndex++].id = entry.bottom.pathId;
        }
    }));

    /*
    COULD POSSIBLY BE FIXED BY %%pageheight <length> DIRECTIVE????

    Unfortunately, the abcjs.render function is not pure, and modifies the styles of
    the target element, which is the score in this case.
    
    Firstly, when the scale of the render is less than 1, it adds a width style to 
    the div. This breaks our resize logic.

    Secondly it changes the height of the element based on the amount of content
    added. We force the same height to ensure measure calculations are correct.
    */
    const scoreElement = document.getElementById(SCORE_ID);
    if (scoreElement !== null) {
        scoreElement.style.height = SCORE_ELEMENT_HEIGHT_STYLE;
        scoreElement.style.width = SCORE_ELEMENT_WIDTH_STYLE;
    }
};
