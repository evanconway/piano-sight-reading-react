import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Measure, measuresSetPathColors } from "../music_new/models";
import { RootState } from "./store";
import { RandomMusicParams, generateRandomMusic, midiOfPitch } from "../music_new/functions";
import { DEFAULT_BOTTOM_STAFF_DURATION, DEFAULT_BOTTOM_STAFF_HIGHEST_PITCH, DEFAULT_BOTTOM_STAFF_LOWEST_PITCH, DEFAULT_BOTTOM_STAFF_NOTES_PER_CHORD, DEFAULT_KEY_SIGNATURE, DEFAULT_TIME_SIGNATURE, DEFAULT_TOP_STAFF_DURATION, DEFAULT_TOP_STAFF_HIGHEST_PITCH, DEFAULT_TOP_STAFF_LOWEST_PITCH, DEFAULT_TOP_STAFF_NOTES_PER_CHORD } from "../music_new/defaults";

interface MusicCursor {
    measureIndex: number,
    staffIndex: number,
}

interface MusicState {
    cursor: MusicCursor,
    music: Measure[],
}

/**
 * Mutates given music state so cursor is advanced to next entry in staff array
 * 
 * @param musicState 
 */
const musicStateStepCursorForward = (musicState: MusicState) => {
    const cursor = musicState.cursor;
    const music = musicState.music;
    cursor.staffIndex++;
    // recall  that top and bottoms staffs of music will always be the same length

    // check if staff index is beyond staff length
    if (cursor.staffIndex >= music[cursor.measureIndex].staffTop.length) {
        // if at final measure, revert to last index of last measure
        if (cursor.measureIndex === music.length - 1) {
            cursor.staffIndex = music[cursor.measureIndex].staffTop.length - 1;
        // otherwise advance measure
        } else {
            cursor.measureIndex++;
            cursor.staffIndex = 0;
        }
    }
};

/**
 * Mutates given music state so cursor is retreated to previous entry in staff array.
 * 
 * @param musicState 
 */
const musicStateStepCursorBackward = (musicState: MusicState) => {
    const cursor = musicState.cursor;
    const music = musicState.music;
    cursor.staffIndex--;
    // recall  that top and bottoms staffs of music will always be the same length

    // check if staff index is before start
    if (cursor.staffIndex < 0) {
        // if at first measure, revert to first index of first measure
        if (cursor.measureIndex === 0) {
            cursor.staffIndex = 0;
        // otherwise retreat measure
        } else {
            cursor.measureIndex--;
            cursor.staffIndex = music[cursor.measureIndex].staffTop.length - 1;
        }
    }
};

const musicStateCursorIsAtEnd = (musicState: MusicState) => {
    const staffEnd = musicState.music[musicState.cursor.measureIndex].staffTop.length - 1;
    const musicEnd = musicState.music.length - 1;
    if (musicState.cursor.measureIndex === musicEnd && musicState.cursor.staffIndex === staffEnd) return true;
    return false;
};

const musicStateCursorIsAtStart = (musicState: MusicState) => {
    return musicState.cursor.staffIndex === 0 && musicState.cursor.measureIndex === 0;
};

/**
 * Returns boolean indicating if there is a valid chord at current cursor of given music state.
 * 
 * @param musicState 
 * @returns 
 */
const musicStateChordAtCursorIsValid = (musicState: MusicState) => {
    const chordTop = musicState.music[musicState.cursor.measureIndex].staffTop[musicState.cursor.staffIndex];
    const chordBottom = musicState.music[musicState.cursor.measureIndex].staffBottom[musicState.cursor.staffIndex];
    return (chordTop !== null || chordBottom !== null);
};

const musicStateHighlightCursor = (musicState: MusicState) => {
    measuresSetPathColors(musicState.music, "#000");
    const pathIdTop = musicState.music[musicState.cursor.measureIndex].staffTop[musicState.cursor.staffIndex]?.pathId;
    const pathIdBottom = musicState.music[musicState.cursor.measureIndex].staffBottom[musicState.cursor.staffIndex]?.pathId;
    const topPaths = document.querySelector(`#${pathIdTop}`)?.children;
    const bottomPaths = document.querySelector(`#${pathIdBottom}`)?.children;

    if (topPaths !== undefined) Array.from(topPaths).forEach(p => p.setAttribute("fill", "#0c0"));
    if (bottomPaths !== undefined) Array.from(bottomPaths).forEach(p => p.setAttribute("fill", "#0c0"));
};

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
            // recall that staffTop and staffBottom will always be the same size
            const originalCursor = { ...state.cursor };
            musicStateStepCursorForward(state);
            while (!musicStateChordAtCursorIsValid(state) && !musicStateCursorIsAtEnd(state)) musicStateStepCursorForward(state);
            /*
            If the cursor made it to the final index of the music, but the current chord is not
            valid, then the cursor was already at correct end position. Revert.
            */
            if (!musicStateChordAtCursorIsValid(state) && musicStateCursorIsAtEnd(state)) {
                state.cursor.measureIndex = originalCursor.measureIndex;
                state.cursor.staffIndex = originalCursor.staffIndex;
            }
            musicStateHighlightCursor(state);
        },
        retreatCursor: (state) => {
            // recall that staffTop and staffBottom will always be the same size
            const originalCursor = { ...state.cursor };
            musicStateStepCursorBackward(state);
            while (!musicStateChordAtCursorIsValid(state) && !musicStateCursorIsAtStart(state)) musicStateStepCursorBackward(state);
            /*
            If the cursor made it to the first index of the music, but the current chord is not
            valid, then the cursor was already at the correct first position. Revert.
            */
            if (!musicStateChordAtCursorIsValid(state) && musicStateCursorIsAtStart(state)) {
                state.cursor.measureIndex = originalCursor.measureIndex;
                state.cursor.staffIndex = originalCursor.staffIndex;
            }
            musicStateHighlightCursor(state);
        },
        highlightCurrentChord: (state) => {
            musicStateHighlightCursor(state);
        },
        randomizeMusic: (state, action: PayloadAction<RandomMusicParams>) => {
            state.music = generateRandomMusic(action.payload);
        },
    },
});

export const { advanceCursor, retreatCursor, highlightCurrentChord, randomizeMusic } = musicSlice.actions;

export const selectCursor = (state: RootState) => state.music.cursor;
export const selectMusic = (state: RootState) => state.music.music;
export const selectCursorAtEndOfMusic = (state: RootState) => musicStateCursorIsAtEnd(state.music);
export const selectMusicCurrentMidi = (state: RootState) => {
    const music = state.music.music;
    const measureIndex = state.music.cursor.measureIndex;
    const staffIndex = state.music.cursor.staffIndex;
    const pitchesTop = music[measureIndex].staffTop[staffIndex]?.pitches;
    const pitchesBot = music[measureIndex].staffBottom[staffIndex]?.pitches;
    const keySignature = music[measureIndex].keySignature;
    const midiPitchesTop = pitchesTop ? pitchesTop.map(p => midiOfPitch(keySignature, p)) : [];
    const midiPitchesBot = pitchesBot ? pitchesBot.map(p => midiOfPitch(keySignature, p)) : [];
    // remove duplicates from returned array
    return Array.from(new Set([...midiPitchesTop, ...midiPitchesBot])).sort();
};

export default musicSlice.reducer;
