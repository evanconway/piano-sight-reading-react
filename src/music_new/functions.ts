import abcjs from "abcjs";
import { Chord, KeyScaleMidiMap, KeySignature, Measure, NoteDuration, Pitch, TimeSignature } from "./models";

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

interface RandomMusicParams {
    numberOfMeasures?: number,
    keySignatureBase?: KeySignature,
    timeSignature?: TimeSignature,
    topStaffDuration?: NoteDuration,
    topStaffHighestPitch?: Pitch,
    topStaffLowestPitch?: Pitch,
    topStaffNotesPerChord?: number,
    bottomStaffDuration?: NoteDuration,
    bottomStaffHighestPitch?: Pitch,
    bottomStaffLowestPitch?: Pitch,
    bottomStaffNotesPerChord?: number,
}

export const generateRandomMusic = (params?: RandomMusicParams) => {
    // setup default values
    const numberOfMeasures = params?.numberOfMeasures !== undefined ? params.numberOfMeasures : 16;
    const keySignature = params?.keySignatureBase ? params.keySignatureBase : "C";
    const timeSignature = params?.timeSignature ? params.timeSignature : "4/4";
    const topStaffDuration = params?.topStaffDuration ? params.topStaffDuration : "quarter";
    const topStaffHighestPitch: Pitch = params?.topStaffHighestPitch ? params.topStaffHighestPitch : { scaleDegree: 5, register: 5, accidental: 0 };
    const topStaffLowestPitch: Pitch = params?.topStaffLowestPitch ? params.topStaffLowestPitch : { scaleDegree: 1, register: 4, accidental: 0 };
    const topStaffNotesPerChord = params?.topStaffNotesPerChord ? params.topStaffNotesPerChord : 2;
    const bottomStaffDuration = params?.bottomStaffDuration ? params.bottomStaffDuration : "quarter";
    const bottomStaffHighestPitch: Pitch = params?.bottomStaffHighestPitch ? params.bottomStaffHighestPitch : { scaleDegree: 1, register: 4, accidental: 0 };
    const bottomStaffLowestPitch: Pitch = params?.bottomStaffLowestPitch ? params.bottomStaffLowestPitch : { scaleDegree: 3, register: 2, accidental: 0 };
    const bottomStaffNotesPerChord = params?.bottomStaffNotesPerChord ? params.bottomStaffNotesPerChord : 2;

    return new Array<Measure>(numberOfMeasures).map(() => {

        return {
            keySignature,
            timeSignature,
        } as Measure;
    });
};

export const renderAbcjs = (measures: Measure[], width: number) => {
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
