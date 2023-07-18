import "react";
import { Select, MenuItem } from "@mui/material";
import { KeySignature, KeySignatures,  } from "../music_new/models";
import { selectUserPreferences, userPreferencesSetKeySignature } from "../state/userPreferencesSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import OptionsFormControlWrapper from "./OptionsFormControlWrapper";
import OptionTypography from "./OptionTypography";

const KeySignatureSelector = () => {
    const dispatch = useAppDispatch();
    const { keySignature } = useAppSelector(selectUserPreferences);

    return <OptionsFormControlWrapper>
        <OptionTypography>Key Signature</OptionTypography>
        <Select
            id="options-key-signature"
            value={keySignature}
            sx={{ marginLeft: "auto" }}
            onChange={e => dispatch(userPreferencesSetKeySignature(e.target.value as KeySignature))}
        >
            {KeySignatures.map(key => <MenuItem key={key} value={key}>{key}</MenuItem>)}
        </Select>
    </OptionsFormControlWrapper>
};

export default KeySignatureSelector;
