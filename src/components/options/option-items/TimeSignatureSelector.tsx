import "react";
import { Select, MenuItem } from "@mui/material";
import { TimeSignature, TimeSignatures,  } from "../../../music/models";
import { selectUserPreferences, userPreferencesSetTimeSignature } from "../../../state/userPreferencesSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import OptionItem from "../OptionItem";

const TimeSignatureSelector = () => {
    const dispatch = useAppDispatch();
    const { timeSignature } = useAppSelector(selectUserPreferences);

    return <OptionItem title='Time Signature'>
        <Select
            name='options-Time-signature'
            value={timeSignature}
            sx={{ marginLeft: "auto" }}
            onChange={e => dispatch(userPreferencesSetTimeSignature(e.target.value as TimeSignature))}
        >
            {TimeSignatures.map(ts => <MenuItem key={ts} value={ts}>{ts}</MenuItem>)}
        </Select>
    </OptionItem>;
};

export default TimeSignatureSelector;
