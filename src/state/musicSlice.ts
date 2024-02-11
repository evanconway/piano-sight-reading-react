import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { Measure, measuresSetPathColors } from "../music_new/models";
import { RootState } from "./store";
import { RandomMusicParams, generateRandomMusic, getMidiOfPitch } from "../music_new/functions";
import { DEFAULT_BOTTOM_STAFF_DURATION, DEFAULT_BOTTOM_STAFF_HIGHEST_PITCH, DEFAULT_BOTTOM_STAFF_LOWEST_PITCH, DEFAULT_BOTTOM_STAFF_NOTES_PER_CHORD, DEFAULT_KEY_SIGNATURE, DEFAULT_TIME_SIGNATURE, DEFAULT_TOP_STAFF_DURATION, DEFAULT_TOP_STAFF_HIGHEST_PITCH, DEFAULT_TOP_STAFF_LOWEST_PITCH, DEFAULT_TOP_STAFF_NOTES_PER_CHORD } from "../constants";

interface MusicCursor {
    measureIndex: number,
    staffIndex: number, // index of exact position in top/bottom staff within measure
}

interface MusicState {
    cursor: MusicCursor,
    measures: Measure[],
    measuresPerLine?: number,
}

/**
 * Mutates given music state so cursor is advanced to next entry in staff array
 * 
 * @param musicState 
 */
const musicStateStepCursorForward = (musicState: MusicState) => {
    const { cursor, measures } = musicState;
    cursor.staffIndex++;
    if (cursor.staffIndex >= measures[cursor.measureIndex].staffChords.length) {
        cursor.staffIndex = 0;
        cursor.measureIndex++;
        if (cursor.measureIndex >= measures.length) {
            cursor.measureIndex = measures.length - 1;
                cursor.staffIndex = measures[cursor.measureIndex].staffChords.length - 1;
        }
    }
};

/**
 * Mutates given music state so cursor is retreated to previous entry in staff array.
 * 
 * @param musicState 
 */
const musicStateStepCursorBackward = (musicState: MusicState) => {
    const { cursor, measures } = musicState;
    cursor.staffIndex--;
    if (cursor.staffIndex < 0) {
        cursor.measureIndex--;
        if (cursor.measureIndex < 0) {
            cursor.measureIndex = 0;
            cursor.staffIndex = 0;
        } else {
            cursor.staffIndex = measures[cursor.measureIndex].staffChords.length - 1;
        }
    }
};

/**
 * Get a MusicCursor object equal to the last position in the given music state.
 * 
 * @param musicState 
 * @returns 
 */
const musicStateGetLastCursor = (musicState: MusicState): MusicCursor => {
    const measureLastIndex = musicState.measures.length - 1;
    const staffLastIndex = musicState.measures[measureLastIndex].staffChords.length - 1;
    return { measureIndex: measureLastIndex, staffIndex: staffLastIndex };
};

/**
 * Returns boolean indicating if the cursor of the given music state is at the first position of the music.
 * 
 * @param musicState 
 * @returns 
 */
const musicStateCursorIsAtStart = (musicState: MusicState) => {
    return  musicState.cursor.measureIndex === 0 && musicState.cursor.staffIndex === 0;
};

/**
 * Returns boolean indicating if the cursor of the given music state is at the final position of the music.
 * 
 * @param musicState 
 * @returns 
 */
const musicStateCursorIsAtEnd = (musicState: MusicState) => {
    const final = musicStateGetLastCursor(musicState);
    const cursor = musicState.cursor;
    return cursor.measureIndex === final.measureIndex && cursor.staffIndex === final.staffIndex;
};

/**
 * Returns a MusicCursor set to the position of the final chord in the given music state.
 * 
 * @param musicState 
 * @returns 
 */
const musicStateGetFinalChordCursor = (musicState: MusicState): MusicCursor => {
    const result = musicStateGetLastCursor(musicState);
    const chordValid = (c: MusicCursor) => {
        const topChord = musicState.measures[c.measureIndex].staffChords[c.staffIndex].top;
        const bottomChord = musicState.measures[c.measureIndex].staffChords[c.staffIndex].bottom;
        return topChord !== null || bottomChord !== null;
    };
    while (!chordValid(result)) {
        result.staffIndex--;
        // recall  that top and bottoms staffs of music will always be the same length
        // consider reworking mutate functions to return values which are used to mutate later
        if (result.staffIndex < 0) {
            result.measureIndex--;
            if (result.measureIndex < 0) {
                result.measureIndex = 0;
                result.staffIndex = 0;
            } else {
                result.staffIndex = musicState.measures[result.measureIndex].staffChords.length - 1;
            }
        }
    }
    return result;
};

/**
 * Returns boolean indicating if the cursor the given music state is at the position
 * of the last chord in the music.
 * 
 * @param musicState 
 * @returns 
 */
const musicStateCursorIsAtFinalChord = (musicState: MusicState) => {
    const finalChordCursor = musicStateGetFinalChordCursor(musicState);
    const measureSame = finalChordCursor.measureIndex === musicState.cursor.measureIndex;
    const staffSame = finalChordCursor.staffIndex === musicState.cursor.staffIndex;
    return  measureSame && staffSame;
}

/**
 * Returns boolean indicating if there is a valid chord at current cursor of given music state.
 * 
 * @param musicState 
 * @returns 
 */
const musicStateChordAtCursorIsValid = (musicState: MusicState) => {
    const { cursor, measures } = musicState;
    const chordTop = measures[cursor.measureIndex].staffChords[cursor.staffIndex].top;
    const chordBottom = measures[cursor.measureIndex].staffChords[cursor.staffIndex].top;
    return (chordTop !== null || chordBottom !== null);
};

/**
 * Return the path ids of the top and bottoms staffs at the cursor of the state.
 * 
 * @param musicState 
 * @returns 
 */
const musicStateGetCursorPathIds = (musicState: MusicState) => {
    const { cursor, measures } = musicState;
    return {
        pathIdTop: measures[cursor.measureIndex].staffChords[cursor.staffIndex].top?.pathId,
        pathIdBottom: measures[cursor.measureIndex].staffChords[cursor.staffIndex].bottom?.pathId,
    };
};

const musicStateHighlightCursor = (musicState: MusicState) => {
    measuresSetPathColors(musicState.measures, "#000");
    const { pathIdTop, pathIdBottom } = musicStateGetCursorPathIds(musicState);
    const topPaths = document.querySelector(`#${pathIdTop}`)?.children;
    const bottomPaths = document.querySelector(`#${pathIdBottom}`)?.children;
    if (topPaths !== undefined) Array.from(topPaths).forEach(p => p.setAttribute("fill", "#0c0"));
    if (bottomPaths !== undefined) Array.from(bottomPaths).forEach(p => p.setAttribute("fill", "#0c0"));
};

const initialState: MusicState = {
    cursor: { measureIndex: 0, staffIndex: 0 },
    measures: generateRandomMusic({
        numberOfLines: 1,
        measuresPerLine: 1,
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
    measuresPerLine: 1,
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
        setCursorToPathId: (state, action: PayloadAction<string>) => {
            state.cursor.measureIndex = 0;
            state.cursor.staffIndex = 0;
            const working = (musicState: MusicState) => {
                if (musicStateGetCursorPathIds(musicState).pathIdTop === action.payload) return false;
                if (musicStateGetCursorPathIds(musicState).pathIdBottom === action.payload) return false;
                if (musicStateCursorIsAtEnd(musicState)) return false;
                return true;
            };
            while (working(state)) musicStateStepCursorForward(state);
            musicStateHighlightCursor(state);
        },
        highlightCurrentChord: (state) => {
            musicStateHighlightCursor(state);
        },
        randomizeMusic: (state, action: PayloadAction<RandomMusicParams>) => {
            state.measures = generateRandomMusic(action.payload);
            state.measuresPerLine = action.payload.measuresPerLine;
        },
        setCursorToStart: (state) => {
            state.cursor.measureIndex = 0;
            state.cursor.staffIndex = 0;
            while(!musicStateChordAtCursorIsValid(state)) musicStateStepCursorForward(state);
        },
    },
});

export const {
    advanceCursor,
    retreatCursor,
    highlightCurrentChord,
    randomizeMusic,
    setCursorToStart,
    setCursorToPathId,
} = musicSlice.actions;

export const selectCursor = (state: RootState) => state.music.cursor;
export const selectMusic = (state: RootState) => state.music;
export const selectCursorAtFinalChord = (state: RootState) => musicStateCursorIsAtFinalChord(state.music);
export const selectMusicCurrentMidi = createSelector((state: RootState) => state.music, music => {
    const { cursor, measures } = music;
    const { measureIndex, staffIndex} = cursor;
    const pitchesTop = measures[measureIndex].staffChords[staffIndex].top?.pitches;
    const pitchesBot = measures[measureIndex].staffChords[staffIndex].bottom?.pitches;
    const keySignature = measures[measureIndex].keySignature;
    const midiPitchesTop = pitchesTop ? pitchesTop.map(p => getMidiOfPitch(keySignature, p)) : [];
    const midiPitchesBot = pitchesBot ? pitchesBot.map(p => getMidiOfPitch(keySignature, p)) : [];
    // remove duplicates from returned array
    return Array.from(new Set([...midiPitchesTop, ...midiPitchesBot])).sort();
});
export const selectMusicCerrentPathId = (state: RootState) => {
    const { cursor, measures } = state.music;
    const { measureIndex, staffIndex } = cursor;
    return {
        topPathId: measures[measureIndex].staffChords[staffIndex].top?.pathId,
        bottomPathId: measures[measureIndex].staffChords[staffIndex].bottom?.pathId,
    };
};

export default musicSlice.reducer;
