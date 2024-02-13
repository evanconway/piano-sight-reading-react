import "react";
import { Select, MenuItem } from "@mui/material";
import { KeySignature, KeySignatures,  } from "../../../music/models";
import { selectUserPreferences, userPreferencesSetKeySignature } from "../../../state/userPreferencesSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import OptionItem from "../OptionItem";

const KeySignatureSelector = () => {
    const dispatch = useAppDispatch();
    const { keySignature } = useAppSelector(selectUserPreferences);

    return <OptionItem title='Key Signature'>
        <Select
            name='options-key-signature'
            value={keySignature}
            sx={{ marginLeft: "auto" }}
            onChange={e => dispatch(userPreferencesSetKeySignature(e.target.value as KeySignature))}
        >
            {KeySignatures.map(key => <MenuItem id={key} key={key} value={key}>{key}</MenuItem>)}
        </Select>
    </OptionItem>
};

export default KeySignatureSelector;
