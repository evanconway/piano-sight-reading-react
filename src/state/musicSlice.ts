import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Measure } from "../music_new/models";
import { RootState } from "./store";
import { RandomMusicParams, generateRandomMusic } from "../music_new/functions";
import { DEFAULT_BOTTOM_STAFF_DURATION, DEFAULT_BOTTOM_STAFF_HIGHEST_PITCH, DEFAULT_BOTTOM_STAFF_LOWEST_PITCH, DEFAULT_BOTTOM_STAFF_NOTES_PER_CHORD, DEFAULT_KEY_SIGNATURE, DEFAULT_TIME_SIGNATURE, DEFAULT_TOP_STAFF_DURATION, DEFAULT_TOP_STAFF_HIGHEST_PITCH, DEFAULT_TOP_STAFF_LOWEST_PITCH, DEFAULT_TOP_STAFF_NOTES_PER_CHORD } from "../music_new/defaults";

interface MusicCursor {
    measureIndex: number,
    staffIndex: number,
}

interface MusicState {
    cursor: MusicCursor,
    music: Measure[],
}

const initialState: MusicState = {
    cursor: { measureIndex: 0, staffIndex: 0 },
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
        advanceCursor: (state) => {
            console.log("advance cursor");
            // recall that staffTop and staffBottom will always be the same size

            // advance staff index to next valid chord
            state.cursor.staffIndex++;
            while (
                state.music[state.cursor.measureIndex].staffTop[state.cursor.staffIndex] === null &&
                state.music[state.cursor.measureIndex].staffBottom[state.cursor.staffIndex] === null &&
                state.cursor.staffIndex < state.music[state.cursor.measureIndex].staffTop.length
            ) {
                state.cursor.staffIndex++;
            }

            // advance to next measure if no valid chord found
            if (state.cursor.staffIndex >= state.music[state.cursor.measureIndex].staffTop.length) {
                state.cursor.staffIndex = 0;
                state.cursor.measureIndex++;
            }

            // if measure index has gone to far, we were at the end
            if (state.cursor.measureIndex >= state.music.length) {
                state.cursor.measureIndex = state.music.length - 1;
                state.cursor.staffIndex = state.music[state.cursor.measureIndex].staffTop.length - 1;
                while (
                    state.music[state.cursor.measureIndex].staffTop[state.cursor.staffIndex] === null &&
                    state.music[state.cursor.measureIndex].staffBottom[state.cursor.staffIndex] === null &&
                    state.cursor.staffIndex >= 0
                ) {
                    state.cursor.staffIndex--;
                }
            }
            debugger;
            const pathId = state.music[state.cursor.measureIndex].staffTop[state.cursor.staffIndex]?.pathId;
            if (pathId === undefined) return;
            const element = document.querySelector(`#${pathId}`);
            if (element === null) return;
            element.setAttribute("fill", "#fff");
        },
        randomizeMusic: (state, action: PayloadAction<RandomMusicParams>) => {
            state.music = generateRandomMusic(action.payload);
        },
    },
});

export const { advanceCursor } = musicSlice.actions;

export const selectCursor = (state: RootState) => state.music.cursor;
export const selectMusic = (state: RootState) => state.music.music;

export default musicSlice.reducer;
