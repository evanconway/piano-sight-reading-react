import { Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { selectUserPreferences, userPreferencesSetUseHarmony } from "../../../state/userPreferencesSlice";
import OptionItem from "../OptionItem";

const useHarmonySelector = () => {
    const dispatch = useAppDispatch();
    const useHarmony = useAppSelector(selectUserPreferences).useHarmony;

    return <OptionItem title='Use Harmony'>
        <Button
        onClick={() => dispatch(userPreferencesSetUseHarmony(!useHarmony))}
        >
            {useHarmony ? 'True' : 'False'}
        </Button>
    </OptionItem>;
};

export default useHarmonySelector;
