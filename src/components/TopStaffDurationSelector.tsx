import "react";
import { Select, MenuItem } from "@mui/material";
import { NoteDuration, durationsAllowedInTimeSignatureMap } from "../music/models";
import { selectUserPreferences, userPreferencesSetTopStaffDuration } from "../state/userPreferencesSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import OptionsFormControlWrapper from "./OptionsFormControlWrapper";
import OptionTypography from "./OptionTypography";

const TopStaffDurationSelector = () => {
    const dispatch = useAppDispatch();
    const { topStaffDuration, timeSignature } = useAppSelector(selectUserPreferences);

    return <OptionsFormControlWrapper>
        <OptionTypography>Top Staff Duration</OptionTypography>
        <Select
            id="options-duration-top-staff"
            value={topStaffDuration}
            sx={{ marginLeft: "auto" }}
            onChange={e => {
                dispatch(userPreferencesSetTopStaffDuration(e.target.value as NoteDuration));
            }}
        >
            {durationsAllowedInTimeSignatureMap.get(timeSignature)?.map(duration => {
                return <MenuItem key={duration} value={duration}>{duration}</MenuItem>
            })}
        </Select>
    </OptionsFormControlWrapper>
};

export default TopStaffDurationSelector;
