import { MenuItem, Select } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { selectUserPreferences, userPreferencesSetBottomStaffHighestPitch } from "../../../state/userPreferencesSlice";
import { PitchCap, pitchCapIsLowerThan, pitchCapOrder } from "../../../music/models";
import { getPitchCapString, getPitchCapsInRange } from "../../../music/functions";
import OptionItem from "../OptionItem";

const BottomStaffHighestPitchSelector = () => {
    const dispatch = useAppDispatch();
    const { keySignature, bottomStaffHighestPitch, bottomStaffLowestPitch, bottomStaffNotesPerChord } = useAppSelector(selectUserPreferences);

    const indexOfBottomStaffLowestPitch = pitchCapOrder.findIndex(cap => cap.pitchClass === bottomStaffLowestPitch.pitchClass && cap.register === bottomStaffLowestPitch.register);
    const minimum = pitchCapOrder[indexOfBottomStaffLowestPitch + bottomStaffNotesPerChord - 1];

    const pitchCapMap = new Map<string, PitchCap>();
    const pitchCaps = getPitchCapsInRange({ pitchClass: "C", register: 2 }, { pitchClass: "E", register: 4 });
    pitchCaps.forEach(cap => pitchCapMap.set(getPitchCapString(cap, keySignature), cap));

    return <OptionItem title='Bottom Staff Highest Pitch'>
        <Select
            name='options-highest-pitch-Bottom-staff'
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
    </OptionItem>
};

export default BottomStaffHighestPitchSelector;
