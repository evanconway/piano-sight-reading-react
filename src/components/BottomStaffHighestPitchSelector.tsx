import { MenuItem, Select } from "@mui/material";
import OptionTypography from "./OptionTypography";
import OptionsFormControlWrapper from "./OptionsFormControlWrapper";
import { useAppDispatch, useAppSelector } from "../hooks";
import { selectUserPreferences, userPreferencesSetBottomStaffHighestPitch } from "../state/userPreferencesSlice";
import { PitchCap, pitchCapIsLowerThan, pitchCapOrder } from "../music_new/models";
import { getPitchCapString, getPitchCapsInRange } from "../music_new/functions";

const BottomStaffHighestPitchSelector = () => {
    const dispatch = useAppDispatch();
    const { keySignature, bottomStaffHighestPitch, bottomStaffLowestPitch, bottomStaffNotesPerChord } = useAppSelector(selectUserPreferences);

    const indexOfBottomStaffLowestPitch = pitchCapOrder.findIndex(cap => cap.pitchClass === bottomStaffLowestPitch.pitchClass && cap.register === bottomStaffLowestPitch.register);
    const minimum = pitchCapOrder[indexOfBottomStaffLowestPitch + bottomStaffNotesPerChord - 1];

    const pitchCapMap = new Map<string, PitchCap>();
    const pitchCaps = getPitchCapsInRange({ pitchClass: "C", register: 2 }, { pitchClass: "E", register: 4 });
    pitchCaps.forEach(cap => pitchCapMap.set(getPitchCapString(cap, keySignature), cap));

    return <OptionsFormControlWrapper>
        <OptionTypography>Bottom Staff Highest Pitch</OptionTypography>
        <Select
            id="options-highest-pitch-Bottom-staff"
            value={getPitchCapString(bottomStaffHighestPitch, keySignature)}
            sx={{ marginLeft: "auto" }}
            onChange={e => {
                const newPitchCap = pitchCapMap.get(e.target.value);
                if (newPitchCap === undefined) return;
                dispatch(userPreferencesSetBottomStaffHighestPitch(newPitchCap));
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

export default BottomStaffHighestPitchSelector;
