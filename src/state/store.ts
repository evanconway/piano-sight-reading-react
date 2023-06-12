import { configureStore } from "@reduxjs/toolkit"; 
import musicReducer from "./musicSlice";
import userPreferencesReducer from "./userPreferencesSlice";

export const store = configureStore({
    reducer: {
        music: musicReducer,
        userPreferences: userPreferencesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
