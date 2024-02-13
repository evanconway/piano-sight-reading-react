import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

type MidiSupport = 'supported' | 'unsupported' | 'checking';

interface AppState {
    midiSupport: MidiSupport,
}

const initialState: AppState = {
    midiSupport: 'checking',
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        appSetMidiSupport: (state, action: PayloadAction<MidiSupport>) => {
            state.midiSupport = action.payload;
        },
    },
});

export const { appSetMidiSupport } = appSlice.actions;

export const selectAppMidiSupport = (state: RootState) => state.app.midiSupport;

export default appSlice.reducer;
