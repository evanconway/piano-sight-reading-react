import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_BOTTOM_STAFF_DURATION, DEFAULT_BOTTOM_STAFF_HIGHEST_PITCH, DEFAULT_BOTTOM_STAFF_LOWEST_PITCH, DEFAULT_BOTTOM_STAFF_NOTES_PER_CHORD, DEFAULT_KEY_SIGNATURE, DEFAULT_TIME_SIGNATURE, DEFAULT_TOP_STAFF_DURATION, DEFAULT_TOP_STAFF_HIGHEST_PITCH, DEFAULT_TOP_STAFF_LOWEST_PITCH, DEFAULT_TOP_STAFF_NOTES_PER_CHORD } from "../constants";
import { RandomMusicParams } from "../music/functions";
import { KeySignature, NoteDuration, PitchCap, TimeSignature } from "../music/models";
import { RootState } from "./store";

const initialState: RandomMusicParams = {
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
};

const userPreferencesSlice = createSlice({
    name: "userPreferences",
    initialState,
    reducers: {
        userPreferencesSetScoreDimensions: (state, action: PayloadAction<{ numberOfLines: number, measuresPerLine: number }>) => {
            state.numberOfLines = action.payload.numberOfLines;
            state.measuresPerLine = action.payload.measuresPerLine;
        },
        userPreferencesSetKeySignature: (state, action: PayloadAction<KeySignature>) => {
            state.keySignature = action.payload;
        },
        userPreferencesSetTimeSignature: (state, action: PayloadAction<TimeSignature>) => {
            state.timeSignature = action.payload;
            // also set durations to default values for given tiem signature
            if (state.timeSignature === "3/4" || state.timeSignature === "4/4") {
                state.topStaffDuration = "quarter";
                state.bottomStaffDuration = "quarter";
            }
            if (state.timeSignature === "6/8") {
                state.topStaffDuration = "quarter-dotted";
                state.bottomStaffDuration = "quarter-dotted";
            }
        },
        userPreferencesSetTopStaffDuration: (state, action: PayloadAction<NoteDuration>) => {
            state.topStaffDuration = action.payload;
        },
        userPreferencesSetTopStaffHighestPitch: (state, action: PayloadAction<PitchCap>) => {
            state.topStaffHighestPitch = action.payload;
        },
        userPreferencesSetTopStaffLowestPitch: (state, action: PayloadAction<PitchCap>) => {
            state.topStaffLowestPitch = action.payload;
        },
        userPreferencesSetTopStaffNotesPerChord: (state, action: PayloadAction<number>) => {
            state.topStaffNotesPerChord = action.payload;
        },
        userPreferencesSetBottomStaffDuration: (state, action: PayloadAction<NoteDuration>) => {
            state.bottomStaffDuration = action.payload;
        },
        userPreferencesSetBottomStaffHighestPitch: (state, action: PayloadAction<PitchCap>) => {
            state.bottomStaffHighestPitch = action.payload;
        },
        userPreferencesSetBottomStaffLowestPitch: (state, action: PayloadAction<PitchCap>) => {
            state.bottomStaffLowestPitch = action.payload;
        },
        userPreferencesSetBottomStaffNotesPerChord: (state, action: PayloadAction<number>) => {
            state.bottomStaffNotesPerChord = action.payload;
        },
    },
});

export const {
    userPreferencesSetScoreDimensions,
    userPreferencesSetKeySignature,
    userPreferencesSetTimeSignature,
    userPreferencesSetTopStaffDuration,
    userPreferencesSetTopStaffHighestPitch,
    userPreferencesSetTopStaffLowestPitch,
    userPreferencesSetTopStaffNotesPerChord,
    userPreferencesSetBottomStaffDuration,
    userPreferencesSetBottomStaffHighestPitch,
    userPreferencesSetBottomStaffLowestPitch,
    userPreferencesSetBottomStaffNotesPerChord,
} = userPreferencesSlice.actions;

export const  selectUserPreferences = (state: RootState) => state.userPreferences;

export default userPreferencesSlice.reducer;
