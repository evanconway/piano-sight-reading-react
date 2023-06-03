import abcjs from "abcjs";
import { Chord, KeyScaleMidiMap, KeySignature, Measure, NoteDuration, Pitch, TimeSignature, getMeasureSize, getNoteDurationValue } from "./models";

const midiOfPitch = (keySignature: KeySignature, pitch: Pitch) => {
    const scaleMidiMap = KeyScaleMidiMap.get(keySignature);
    const baseMidi = scaleMidiMap?.get(pitch.scaleDegree);
    if (!baseMidi) return 0;
    return baseMidi + pitch.accidental + pitch.register;
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
    const result: Chord = { duration, pitches: [] };

    // prepare array of pitches in given key starting at lowest pitch and ending at highest
    let possiblePitches: Pitch[] = [];
    let pitchToAdd = {...lowest};
    while (midiOfPitch(keySig, pitchToAdd) <= midiOfPitch(keySig, highest)) {
        possiblePitches.push(pitchToAdd);
        pitchToAdd = {...pitchToAdd};
        pitchToAdd.scaleDegree++;
        if (pitchToAdd.scaleDegree > 7) {
            pitchToAdd.scaleDegree = 1;
            pitchToAdd.register++;
        }
    }

    // add pitches to result, ensuring already added pitches, and pitches outside of octave limit are removed
    for (let i = 0; i < numberOfPitches; i++) {
        const newPitchIndex = Math.floor(Math.random() * possiblePitches.length);
        result.pitches.push(possiblePitches[newPitchIndex]);
        result.pitches.sort((a, b) => midiOfPitch(keySig, a) - midiOfPitch(keySig, b));
        possiblePitches = possiblePitches.filter((p, i) => {
            if (i === newPitchIndex) return false;
            if (midiOfPitch(keySig, p) > (midiOfPitch(keySig, result.pitches[0]) + 12)) return false;
            if (midiOfPitch(keySig, p) < (midiOfPitch(keySig, result.pitches[result.pitches.length - 1]) - 12)) return false;
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
    const bottomValue = getNoteDurationValue(topStaffDuration);

    /*
    We assume an eigth note has a "value" of 12. Based on the given time signature
    we ensure both the top and bottom staff chord arrays have enough entries. For
    example a time signature of 4/4 yields an array size of 96.
    */
    const mSize = getMeasureSize(timeSignature);

    // this makes an array of the correct size but empty values? 
    const result = [...Array(numberOfMeasures)].map(() => {
        return {
            keySignature,
            timeSignature,
            staffTop: [...Array(mSize)].map((_, i) => i % topValue === 0 ? getRandomChord(
                topStaffDuration,
                keySignature,
                topStaffNotesPerChord,
                topStaffHighestPitch,
                topStaffLowestPitch
            ) as Chord : null),
            staffBottom: [...Array(mSize)].map((_, i) => i % bottomValue === 0 ? getRandomChord(
                bottomStaffDuration,
                keySignature,
                bottomStaffNotesPerChord,
                bottomStaffHighestPitch,
                bottomStaffLowestPitch
            ) as Chord : null),
        } as Measure;
    });

    return result;
};

export const renderAbcjs = (measures: Measure[], width: number) => {
    // generate string

    // first measure to get values from
    const firstM = measures[0];

    let result = `
        T:
        M:${firstM.timeSignature}
        L:1/48
        K:${firstM.keySignature}
        %%staves {1 2}
    `;

    const headerTop = `V:1\n[K:${firstM.keySignature} clef=treble]\n`;
    const headerBot = `V:2\n[K:${firstM.keySignature} clef=bass]\n`;

    
    // working string for testing
    const abcjsString = `
        T:
        M:4/4
        L:1/48
        K:C
        %%staves {1 2}
        V:1
        [K:C clef=treble]
        [CC']12 D'12 D12 A12 |F'12 F'12 D12 F'12 |G12 F12 C'12 C'12 |F'12 G'12 C'12 G'12 |
        V:2
        [K:C clef=bass]
        E,24 C24 |A,,24 C24 |F,24 F,24 |C24 C24 |
        V:1
        [K:C clef=treble]
        D12 G'12 F'12 G'12 |C'12 F'12 D12 [CEF]12 |[CBC']12 F12 A12 [CGB]12 |C'12 E'12 D12 F12 |
        V:2
        [K:C clef=bass]
        A,24 B,,24 |G,24 E,24 |C,24 A,24 |C,24 F,,24 |
        V:1
        [K:C clef=treble]
        F12 E'12 F12 F'12 |D'12 G'12 E12 E12 |D12 E'12 F'12 D'12 |F'12 E'12 F12 B12 |
        V:2
        [K:C clef=bass]
        G,24 A,,24 |C,24 A,24 |E,24 F,24 |C24 F,,24 |
        V:1
        [K:C clef=treble]
        G12 D'12 E12 D12 |G'12 G12 G'12 A12 |F12 F'12 [CBC']12 E12 |D'12 E12 F'12 [CC']12 |
        V:2
        [K:C clef=bass]
        B,,24 C24 |G,24 B,24 |A,,24 G,,24 |F,,24 E,24 |
        V:1
        [K:C clef=treble]
        C'12 [CEA]12 C'12 A12 |B12 G'12 C'12 F'12 |B12 C'12 G'12 B12 |E'12 D12 G'12 B12 |]
        V:2
        [K:C clef=bass]
        B,24 C,24 |F,,24 E,24 |A,24 A,24 |E,24 B,,24 |]
    `;

	// https://paulrosen.github.io/abcjs/visual/render-abc-options.html
    abcjs.renderAbc("score", abcjsString, {
        add_classes: true,
        selectionColor: "#000",
        staffwidth: width,
    });
};
