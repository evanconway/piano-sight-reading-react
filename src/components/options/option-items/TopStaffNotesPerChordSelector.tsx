import "react";
import { Select, MenuItem } from "@mui/material";
import { selectUserPreferences, userPreferencesSetTopStaffNotesPerChord } from "../../../state/userPreferencesSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import OptionItem from "../OptionItem";

const TopStaffNotesPerChordSelector = () => {
    const dispatch = useAppDispatch();
    const { topStaffNotesPerChord } = useAppSelector(selectUserPreferences);

    return <OptionItem title='Top Staff Notes Per Chord'>
        <Select
            name='options-notes-per-chord-top-staff'
            value={topStaffNotesPerChord}
            sx={{ marginLeft: "auto" }}
            onChange={e => {
                dispatch(userPreferencesSetTopStaffNotesPerChord(e.target.value as number));
            }}
        >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
        </Select>
    </OptionItem>;
};

export default TopStaffNotesPerChordSelector;
