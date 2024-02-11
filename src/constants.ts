import { KeySignature, NoteDuration, PitchCap, TimeSignature } from "./music_new/models";

export const DEFAULT_KEY_SIGNATURE: KeySignature = "C";
export const DEFAULT_TIME_SIGNATURE: TimeSignature = "4/4";
export const DEFAULT_TOP_STAFF_DURATION: NoteDuration = "quarter";
export const DEFAULT_TOP_STAFF_HIGHEST_PITCH: PitchCap = { pitchClass: "A", register: 5 };
export const DEFAULT_TOP_STAFF_LOWEST_PITCH: PitchCap = { pitchClass: "C", register: 4 };
export const DEFAULT_TOP_STAFF_NOTES_PER_CHORD = 2;
export const DEFAULT_BOTTOM_STAFF_DURATION: NoteDuration = "quarter";
export const DEFAULT_BOTTOM_STAFF_HIGHEST_PITCH: PitchCap = { pitchClass: "B", register: 3 };
export const DEFAULT_BOTTOM_STAFF_LOWEST_PITCH: PitchCap = { pitchClass: "E", register: 2 };
export const DEFAULT_BOTTOM_STAFF_NOTES_PER_CHORD = 2;

export const SCORE_ELEMENT_HEIGHT_STYLE = '90vh';
export const SCORE_ELEMENT_WIDTH_STYLE = '100%';

export const SCORE_ID = "score";

export const SCORE_SCREEN_SIZE_STYLES = {
    DESKTOP: {
        PADDING_X: 40,
        PADDING_BOTTOM: 60,
        SCALE: 1,
    },
    TABLET: {
        SIZE: 800,
        PADDING_X: 30,
        PADDING_BOTTOM: 50,
        SCALE: 0.75,
    },
    PHONE: {
        SIZE: 500,
        PADDING_X: 20,
        PADDING_BOTTOM: 40,
        SCALE: 0.5,
    },
};

export type ReactChildren = string | JSX.Element | JSX.Element[];

const exampleAbcString = `
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
