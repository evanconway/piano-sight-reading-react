import { createSlice } from "@reduxjs/toolkit";

interface Pitch {
    scaleDegree: number,
    register: number,
    accidental: number,
}

interface Chord {
    duration: number,
    pitches: Pitch[],
}

interface Measure {
    keySignature: string,
    timeSignature: string,
    staffTop: Chord[],
    staffBot: Chord[],
}

interface MusicState {
    cursor: number,
    music: Measure[],
}

const initialState: MusicState = {
    cursor: 0,
    music: [],
};