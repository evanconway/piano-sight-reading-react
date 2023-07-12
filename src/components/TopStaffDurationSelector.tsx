import "react";
import { Select, MenuItem, FormControl, Typography } from "@mui/material";
import { NoteDuration } from "../music_new/models";
import { selectUserPreferences, userPreferencesSetTopStaffDuration } from "../state/userPreferencesSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import OptionsFormControlWrapper from "./OptionsFormControlWrapper";
import OptionTypography from "./OptionTypography";

const TopStaffDurationSelector = () => {
    const dispatch = useAppDispatch();

    const userPreferences = useAppSelector(selectUserPreferences);

    return <OptionsFormControlWrapper>
        <OptionTypography>Top Staff Duration</OptionTypography>
        <Select
            id="options-duration-top-staff"
            value={userPreferences.topStaffDuration}
            sx={{ marginLeft: "auto" }}
            onChange={e => {
                dispatch(userPreferencesSetTopStaffDuration(e.target.value as NoteDuration));
            }}
        >
            <div>hello</div>
            <MenuItem value={"whole"}>Whole</MenuItem>
            <MenuItem value={"half"}>Half</MenuItem>
            <MenuItem value={"quarter"}>Quarter</MenuItem>
            <MenuItem value={"eighth"}>Eighth</MenuItem>
            <MenuItem value={"sixteenth"}>Sixteenth</MenuItem>
        </Select>
    </OptionsFormControlWrapper>
};

export default TopStaffDurationSelector;
