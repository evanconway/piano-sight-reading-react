import { MenuItem, Select } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { selectUserPreferences, userPreferencesSetTopStaffLowestPitch } from "../../../state/userPreferencesSlice";
import { PitchCap, pitchCapIsHigherThan, pitchCapOrder } from "../../../music/models";
import { getPitchCapString, getPitchCapsInRange } from "../../../music/functions";
import OptionItem from "../OptionItem";

const TopStaffLowestPitchSelector = () => {
    const dispatch = useAppDispatch();
    const { keySignature, topStaffHighestPitch, topStaffLowestPitch, topStaffNotesPerChord } = useAppSelector(selectUserPreferences);

    const indexOfTopStaffHighestPitch = pitchCapOrder.findIndex(cap => cap.pitchClass === topStaffHighestPitch.pitchClass && cap.register === topStaffHighestPitch.register);
    const maximum = pitchCapOrder[indexOfTopStaffHighestPitch - topStaffNotesPerChord + 1];

    const pitchCapMap = new Map<string, PitchCap>();
    const pitchCaps = getPitchCapsInRange({ pitchClass: "G", register: 3 }, { pitchClass: "C", register: 6 });
    pitchCaps.forEach(cap => pitchCapMap.set(getPitchCapString(cap, keySignature), cap));

    return <OptionItem title='Top Staff Lowest Pitch'>
        <Select
            name='options-Lowest-pitch-top-staff'
            value={getPitchCapString(topStaffLowestPitch, keySignature)}
            sx={{ marginLeft: "auto" }}
            onChange={e => {
                const newPitchCap = pitchCapMap.get(e.target.value);
                if (newPitchCap === undefined) return;
                dispatch(userPreferencesSetTopStaffLowestPitch(newPitchCap));
            }}
        >
            {pitchCaps.map(cap => {
                const capString = getPitchCapString(cap, keySignature);
                const disabled = pitchCapIsHigherThan(cap, maximum);
                return <MenuItem key={capString} disabled={disabled} value={capString}>{capString}</MenuItem>
            }).reverse()}
        </Select>
    </OptionItem>;
};

export default TopStaffLowestPitchSelector;
