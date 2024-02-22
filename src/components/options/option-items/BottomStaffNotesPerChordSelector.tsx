import "react";
import { Select, MenuItem } from "@mui/material";
import { selectUserPreferences, userPreferencesSetBottomStaffNotesPerChord } from "../../../state/userPreferencesSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import OptionItem from "../OptionItem";

const BottomStaffNotesPerChordSelector = () => {
    const dispatch = useAppDispatch();
    const { bottomStaffNotesPerChord } = useAppSelector(selectUserPreferences);

    return <OptionItem title='Bottom Staff Notes Per Chord'>
        <Select
            name='options-notes-per-chord-bottom-staff'
            value={bottomStaffNotesPerChord}
            sx={{ marginLeft: "auto" }}
            onChange={e => {
                dispatch(userPreferencesSetBottomStaffNotesPerChord(e.target.value as number));
            }}
        >
            <MenuItem value={0}>0</MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
        </Select>
    </OptionItem>;
};

export default BottomStaffNotesPerChordSelector;
