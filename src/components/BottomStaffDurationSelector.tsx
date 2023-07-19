import "react";
import { Select, MenuItem } from "@mui/material";
import { NoteDuration, durationsAllowedInTimeSignatureMap } from "../music_new/models";
import { selectUserPreferences, userPreferencesSetBottomStaffDuration } from "../state/userPreferencesSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import OptionsFormControlWrapper from "./OptionsFormControlWrapper";
import OptionTypography from "./OptionTypography";

const BottomStaffDurationSelector = () => {
    const dispatch = useAppDispatch();
    const { bottomStaffDuration, timeSignature } = useAppSelector(selectUserPreferences);

    return <OptionsFormControlWrapper>
        <OptionTypography>Bottom Staff Duration</OptionTypography>
        <Select
            id="options-notes-per-chord-bottom-staff"
            value={bottomStaffDuration}
            sx={{ marginLeft: "auto" }}
            onChange={e => {
                dispatch(userPreferencesSetBottomStaffDuration(e.target.value as NoteDuration));
            }}
        >
            {durationsAllowedInTimeSignatureMap.get(timeSignature)?.map(duration => {
                return <MenuItem key={duration} value={duration}>{duration}</MenuItem>
            })}
        </Select>
    </OptionsFormControlWrapper>
};

export default BottomStaffDurationSelector;
