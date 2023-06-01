import abcjs from "abcjs";
import { KeySignatureBase, Measure, NoteDuration, Pitch, PitchClass, PitchRegister, TimeSignature } from "./models";

type PitchCap = { class: PitchClass, register: PitchRegister };

interface RandomMusicParams {
    numberOfMeasures?: number,
    timeSignature?: TimeSignature,
    keySignatureBase?: KeySignatureBase,
    minor?: boolean,
    topStaffDuration?: NoteDuration,
    topStaffHighestPitch?: PitchCap,
    topStaffLowestPitch?: PitchCap,
    topStaffNotesPerChord?: number,
    bottomStaffDuration?: NoteDuration,
    bottomStaffHighestPitch?: PitchCap,
    bottomStaffLowestPitch?: PitchCap,
    bottomStaffNotesPerChord?: number,
}

const generateRandomMusic = (params?: RandomMusicParams) => {
    // setup default values
    const numberOfMeasures = params?.numberOfMeasures !== undefined ? params.numberOfMeasures : 16;
    const timeSignature = params?.timeSignature ? params.timeSignature : "4/4";
    const keySignatureBase = params?.keySignatureBase ? params.keySignatureBase : "C";
    const minor = params?.minor !== undefined ? params.minor : false;
    const topStaffDuration = params?.topStaffDuration ? params.topStaffDuration : "quarter";
    const topStaffHighestPitch: PitchCap = params?.topStaffHighestPitch ? params.topStaffHighestPitch : { class: "G", register: 5 };
    const topStaffLowestPitch: PitchCap = params?.topStaffLowestPitch ? params.topStaffLowestPitch : { class: "C", register: 4 };
    const topStaffNotesPerChord = params?.topStaffNotesPerChord ? params.topStaffNotesPerChord : 2;
    const bottomStaffDuration = params?.bottomStaffDuration ? params.bottomStaffDuration : "quarter";
    const bottomStaffHighestPitch: PitchCap = params?.bottomStaffHighestPitch ? params.bottomStaffHighestPitch : { class: "C", register: 4 };
    const bottomStaffLowestPitch: PitchCap = params?.bottomStaffLowestPitch ? params.bottomStaffLowestPitch : { class: "E", register: 2 };
    const bottomStaffNotesPerChord = params?.bottomStaffNotesPerChord ? params.bottomStaffNotesPerChord : 2;

    // create array of all pitches possible on piano within the given key signature.
    const allPossiblePitches = new Array<Pitch>(0);

    // top staff
    // filter out ones that don't fit within caps
    const pitchesTop = allPossiblePitches.filter(p => {
        // if p is lower than lowest pitch, return false
        // if p is higher than highest pitch, return false
    });

    // bottom staff
    const pitchesBot = allPossiblePitches.filter(p => {
        // same but with bottom staff values
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
