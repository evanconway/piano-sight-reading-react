import "react";
import { Select, MenuItem } from "@mui/material";
import { NoteDuration, durationsAllowedInTimeSignatureMap } from "../../../music/models";
import { selectUserPreferences, userPreferencesSetBottomStaffDuration } from "../../../state/userPreferencesSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import OptionItem from "../OptionItem";

const BottomStaffDurationSelector = () => {
    const dispatch = useAppDispatch();
    const { bottomStaffDuration, timeSignature } = useAppSelector(selectUserPreferences);

    return <OptionItem title='Bottom Staff Duration'>
        <Select
            name='options-notes-per-chord-bottom-staff'
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
    </OptionItem>;
};

export default BottomStaffDurationSelector;
