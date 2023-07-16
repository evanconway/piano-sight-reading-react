import { MenuItem, Select } from "@mui/material";
import OptionTypography from "./OptionTypography";
import OptionsFormControlWrapper from "./OptionsFormControlWrapper";
import { useAppDispatch, useAppSelector } from "../hooks";
import { selectUserPreferences, userPreferencesSetTopStaffHighestPitch } from "../state/userPreferencesSlice";
import { getPitchRangeInKey, getStringFromPitch } from "../music_new/functions";
import { Pitch } from "../music_new/models";

const TopStaffHighestPitchSelector = () => {
    const dispatch = useAppDispatch();
    const { keySignature, topStaffLowestPitch, topStaffHighestPitch } = useAppSelector(selectUserPreferences);
    const pitchMap = new Map<string, Pitch>();
    const pitches = getPitchRangeInKey(keySignature, topStaffLowestPitch, { scaleDegree: 1, register: 8, accidental: 0});
    pitches.forEach(p => pitchMap.set(getStringFromPitch(p, keySignature), p));

    return <OptionsFormControlWrapper>
        <OptionTypography>Top Staff Highest Pitch</OptionTypography>
        <Select
            id="options-highest-pitch-top-staff"
            value={getStringFromPitch(topStaffHighestPitch, keySignature)}
            sx={{ marginLeft: "auto" }}
            onChange={e => {
                const newPitchCap = pitchMap.get(e.target.value);
                if (newPitchCap === undefined) return;
                dispatch(userPreferencesSetTopStaffHighestPitch(newPitchCap));
            }}
        >
            {pitches.map(p => {
                const pitchString = getStringFromPitch(p, keySignature);
                return <MenuItem value={pitchString}>{pitchString}</MenuItem>
            }).reverse()}
        </Select>
    </OptionsFormControlWrapper>
};

export default TopStaffHighestPitchSelector;
