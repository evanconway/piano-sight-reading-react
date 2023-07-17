import { MenuItem, Select } from "@mui/material";
import OptionTypography from "./OptionTypography";
import OptionsFormControlWrapper from "./OptionsFormControlWrapper";
import { useAppDispatch, useAppSelector } from "../hooks";
import { selectUserPreferences, userPreferencesSetTopStaffHighestPitch } from "../state/userPreferencesSlice";

import { PitchCap, pitchCapIsHigherThan, pitchCapOrder } from "../music_new/models";
import { getPitchCapString, getPitchCapsInRange } from "../music_new/functions";

const TopStaffHighestPitchSelector = () => {
    const dispatch = useAppDispatch();
    const { keySignature, topStaffHighestPitch, topStaffLowestPitch, topStaffNotesPerChord } = useAppSelector(selectUserPreferences);

    const indexOfTopStaffLowestPitch = pitchCapOrder.findIndex(cap => cap.pitchClass === topStaffLowestPitch.pitchClass && cap.register === topStaffLowestPitch.register);
    const minimum = pitchCapOrder[indexOfTopStaffLowestPitch + topStaffNotesPerChord - 1];

    const pitchCapMap = new Map<string, PitchCap>();
    const pitchCaps = getPitchCapsInRange(minimum, { pitchClass: "C", register: 6 });
    pitchCaps.forEach(cap => pitchCapMap.set(getPitchCapString(cap, keySignature), cap));

    return <OptionsFormControlWrapper>
        <OptionTypography>Top Staff Highest Pitch</OptionTypography>
        <Select
            id="options-highest-pitch-top-staff"
            value={getPitchCapString(topStaffHighestPitch, keySignature)}
            sx={{ marginLeft: "auto" }}
            onChange={e => {
                const target = e.target;
                const value = target.value
                const newPitchCap = pitchCapMap.get(value);
                if (newPitchCap === undefined) return;
                dispatch(userPreferencesSetTopStaffHighestPitch(newPitchCap));
            }}
        >
            {pitchCaps.map(cap => {
                const capString = getPitchCapString(cap, keySignature);
                return <MenuItem disabled={pitchCapIsHigherThan(cap, minimum)} value={capString}>{capString}</MenuItem>
            }).reverse()}
        </Select>
    </OptionsFormControlWrapper>
};

export default TopStaffHighestPitchSelector;
