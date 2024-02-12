import { MenuItem, Select } from "@mui/material";
import OptionTypography from "./OptionTypography";
import OptionsFormControlWrapper from "./OptionsFormControlWrapper";
import { useAppDispatch, useAppSelector } from "../hooks";
import { selectUserPreferences, userPreferencesSetTopStaffHighestPitch } from "../state/userPreferencesSlice";
import { PitchCap, pitchCapIsLowerThan, pitchCapOrder } from "../music/models";
import { getPitchCapString, getPitchCapsInRange } from "../music/functions";

const TopStaffHighestPitchSelector = () => {
    const dispatch = useAppDispatch();
    const { keySignature, topStaffHighestPitch, topStaffLowestPitch, topStaffNotesPerChord } = useAppSelector(selectUserPreferences);

    const indexOfTopStaffLowestPitch = pitchCapOrder.findIndex(cap => cap.pitchClass === topStaffLowestPitch.pitchClass && cap.register === topStaffLowestPitch.register);
    const minimum = pitchCapOrder[indexOfTopStaffLowestPitch + topStaffNotesPerChord - 1];

    const pitchCapMap = new Map<string, PitchCap>();
    const pitchCaps = getPitchCapsInRange({ pitchClass: "G", register: 3 }, { pitchClass: "C", register: 6 });
    pitchCaps.forEach(cap => pitchCapMap.set(getPitchCapString(cap, keySignature), cap));

    return <OptionsFormControlWrapper>
        <OptionTypography>Top Staff Highest Pitch</OptionTypography>
        <Select
            id="options-highest-pitch-top-staff"
            value={getPitchCapString(topStaffHighestPitch, keySignature)}
            sx={{ marginLeft: "auto" }}
            onChange={e => {
                const newPitchCap = pitchCapMap.get(e.target.value);
                if (newPitchCap === undefined) return;
                dispatch(userPreferencesSetTopStaffHighestPitch(newPitchCap));
            }}
        >
            {pitchCaps.map(cap => {
                const capString = getPitchCapString(cap, keySignature);
                const disabled = pitchCapIsLowerThan(cap, minimum);
                return <MenuItem key={capString} disabled={disabled} value={capString}>{capString}</MenuItem>
            }).reverse()}
        </Select>
    </OptionsFormControlWrapper>
};

export default TopStaffHighestPitchSelector;
