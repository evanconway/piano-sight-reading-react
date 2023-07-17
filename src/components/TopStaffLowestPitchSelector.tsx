import { MenuItem, Select } from "@mui/material";
import OptionTypography from "./OptionTypography";
import OptionsFormControlWrapper from "./OptionsFormControlWrapper";
import { useAppDispatch, useAppSelector } from "../hooks";
import { selectUserPreferences, userPreferencesSetTopStaffLowestPitch } from "../state/userPreferencesSlice";
import { PitchCap, pitchCapIsHigherThan, pitchCapOrder } from "../music_new/models";
import { getPitchCapString, getPitchCapsInRange } from "../music_new/functions";

const TopStaffLowestPitchSelector = () => {
    const dispatch = useAppDispatch();
    const { keySignature, topStaffHighestPitch, topStaffLowestPitch, topStaffNotesPerChord } = useAppSelector(selectUserPreferences);

    const indexOfTopStaffHighestPitch = pitchCapOrder.findIndex(cap => cap.pitchClass === topStaffHighestPitch.pitchClass && cap.register === topStaffHighestPitch.register);
    const maximum = pitchCapOrder[indexOfTopStaffHighestPitch - topStaffNotesPerChord + 1];

    const pitchCapMap = new Map<string, PitchCap>();
    const pitchCaps = getPitchCapsInRange({ pitchClass: "G", register: 3 }, { pitchClass: "C", register: 6 });
    pitchCaps.forEach(cap => pitchCapMap.set(getPitchCapString(cap, keySignature), cap));

    return <OptionsFormControlWrapper>
        <OptionTypography>Top Staff Lowest Pitch</OptionTypography>
        <Select
            id="options-Lowest-pitch-top-staff"
            value={getPitchCapString(topStaffLowestPitch, keySignature)}
            sx={{ marginLeft: "auto" }}
            onChange={e => {
                const target = e.target;
                const value = target.value
                const newPitchCap = pitchCapMap.get(value);
                if (newPitchCap === undefined) return;
                dispatch(userPreferencesSetTopStaffLowestPitch(newPitchCap));
            }}
        >
            {pitchCaps.map(cap => {
                const capString = getPitchCapString(cap, keySignature);
                const disabled = pitchCapIsHigherThan(cap, maximum);
                return <MenuItem disabled={disabled} value={capString}>{capString}</MenuItem>
            }).reverse()}
        </Select>
    </OptionsFormControlWrapper>
};

export default TopStaffLowestPitchSelector;
