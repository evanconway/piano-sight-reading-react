import "react";
import { Select, MenuItem } from "@mui/material";
import { selectUserPreferences, userPreferencesSetTopStaffNotesPerChord } from "../state/userPreferencesSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import OptionsFormControlWrapper from "./OptionsFormControlWrapper";
import OptionTypography from "./OptionTypography";

const TopStaffNotesPerChordSelector = () => {
    const dispatch = useAppDispatch();
    const userPreferences = useAppSelector(selectUserPreferences);

    return <OptionsFormControlWrapper>
        <OptionTypography>Top Staff Notes Per Chord</OptionTypography>
        <Select
            id="options-notes-per-chord-top-staff"
            value={userPreferences.topStaffNotesPerChord}
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
    </OptionsFormControlWrapper>
};

export default TopStaffNotesPerChordSelector;
