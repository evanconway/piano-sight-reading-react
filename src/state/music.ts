import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Measure } from "../music_new/models";
import { RootState } from "./store";
import { RandomMusicParams, generateRandomMusic } from "../music_new/functions";
import { DEFAULT_BOTTOM_STAFF_DURATION, DEFAULT_BOTTOM_STAFF_HIGHEST_PITCH, DEFAULT_BOTTOM_STAFF_LOWEST_PITCH, DEFAULT_BOTTOM_STAFF_NOTES_PER_CHORD, DEFAULT_KEY_SIGNATURE, DEFAULT_TIME_SIGNATURE, DEFAULT_TOP_STAFF_DURATION, DEFAULT_TOP_STAFF_HIGHEST_PITCH, DEFAULT_TOP_STAFF_LOWEST_PITCH, DEFAULT_TOP_STAFF_NOTES_PER_CHORD } from "../music_new/defaults";

interface MusicState {
    cursor: number,
    music: Measure[],
}

const initialState: MusicState = {
    cursor: 0,
    music: generateRandomMusic({
        numberOfMeasures: 16,
        keySignature: DEFAULT_KEY_SIGNATURE,
        timeSignature: DEFAULT_TIME_SIGNATURE,
        topStaffDuration: DEFAULT_TOP_STAFF_DURATION,
        topStaffHighestPitch: DEFAULT_TOP_STAFF_HIGHEST_PITCH,
        topStaffLowestPitch: DEFAULT_TOP_STAFF_LOWEST_PITCH,
        topStaffNotesPerChord: DEFAULT_TOP_STAFF_NOTES_PER_CHORD,
        bottomStaffDuration: DEFAULT_BOTTOM_STAFF_DURATION,
        bottomStaffHighestPitch: DEFAULT_BOTTOM_STAFF_HIGHEST_PITCH,
        bottomStaffLowestPitch: DEFAULT_BOTTOM_STAFF_LOWEST_PITCH,
        bottomStaffNotesPerChord: DEFAULT_BOTTOM_STAFF_NOTES_PER_CHORD,
    }),
};

export const musicSlice = createSlice({
    name: "music",
    initialState,
    reducers: {
        setCursor: (state, action: PayloadAction<number>) => {
            state.cursor = action.payload;
        },
        randomizeMusic: (state, action: PayloadAction<RandomMusicParams>) => {
            state.music = generateRandomMusic(action.payload);
        },
    },
});

export const { setCursor } = musicSlice.actions;

export const selectCursor = (state: RootState) => state.music.cursor;

export default musicSlice.reducer;
