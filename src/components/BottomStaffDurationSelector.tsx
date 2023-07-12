import "react";
import { Select, MenuItem } from "@mui/material";
import { NoteDuration } from "../music_new/models";
import { selectUserPreferences, userPreferencesSetBottomStaffDuration } from "../state/userPreferencesSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import OptionsFormControlWrapper from "./OptionsFormControlWrapper";
import OptionTypography from "./OptionTypography";

const BottomStaffDurationSelector = () => {
    const dispatch = useAppDispatch();
    const userPreferences = useAppSelector(selectUserPreferences);

    return <OptionsFormControlWrapper>
        <OptionTypography>Bottom Staff Duration</OptionTypography>
        <Select
            id="options-notes-per-chord-bottom-staff"
            value={userPreferences.bottomStaffDuration}
            sx={{ marginLeft: "auto" }}
            onChange={e => {
                dispatch(userPreferencesSetBottomStaffDuration(e.target.value as NoteDuration));
            }}
        >
            <MenuItem value={"whole"}>Whole</MenuItem>
            <MenuItem value={"half"}>Half</MenuItem>
            <MenuItem value={"quarter"}>Quarter</MenuItem>
            <MenuItem value={"eighth"}>Eighth</MenuItem>
            <MenuItem value={"sixteenth"}>Sixteenth</MenuItem>
        </Select>
    </OptionsFormControlWrapper>
};

export default BottomStaffDurationSelector;
