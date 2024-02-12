import { MenuItem, Select } from "@mui/material";
import OptionTypography from "./OptionTypography";
import OptionsFormControlWrapper from "./OptionsFormControlWrapper";
import { useAppDispatch, useAppSelector } from "../hooks";
import { selectUserPreferences, userPreferencesSetBottomStaffLowestPitch } from "../state/userPreferencesSlice";
import { PitchCap, pitchCapIsHigherThan, pitchCapOrder } from "../music/models";
import { getPitchCapString, getPitchCapsInRange } from "../music/functions";

const BottomStaffLowestPitchSelector = () => {
    const dispatch = useAppDispatch();
    const { keySignature, bottomStaffHighestPitch, bottomStaffLowestPitch, bottomStaffNotesPerChord } = useAppSelector(selectUserPreferences);

    const indexOfBottomStaffHighestPitch = pitchCapOrder.findIndex(cap => cap.pitchClass === bottomStaffHighestPitch.pitchClass && cap.register === bottomStaffHighestPitch.register);
    const maximum = pitchCapOrder[indexOfBottomStaffHighestPitch - bottomStaffNotesPerChord + 1];

    const pitchCapMap = new Map<string, PitchCap>();
    const pitchCaps = getPitchCapsInRange({ pitchClass: "C", register: 2 }, { pitchClass: "E", register: 4 });
    pitchCaps.forEach(cap => pitchCapMap.set(getPitchCapString(cap, keySignature), cap));

    return <OptionsFormControlWrapper>
        <OptionTypography>Bottom Staff Lowest Pitch</OptionTypography>
        <Select
            id="options-Lowest-pitch-bottom-staff"
            value={getPitchCapString(bottomStaffLowestPitch, keySignature)}
            sx={{ marginLeft: "auto" }}
            onChange={e => {
                const newPitchCap = pitchCapMap.get(e.target.value);
                if (newPitchCap === undefined) return;
                dispatch(userPreferencesSetBottomStaffLowestPitch(newPitchCap));
            }}
        >
            {pitchCaps.map(cap => {
                const capString = getPitchCapString(cap, keySignature);
                const disabled = pitchCapIsHigherThan(cap, maximum);
                return <MenuItem key={capString} disabled={disabled} value={capString}>{capString}</MenuItem>
            }).reverse()}
        </Select>
    </OptionsFormControlWrapper>
};

export default BottomStaffLowestPitchSelector;
