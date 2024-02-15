import "react";
import { useEffect, useRef, useState } from "react";
import { Dialog, Button, DialogTitle, List, Divider } from "@mui/material";
import TopStaffDurationSelector from "./option-items/TopStaffDurationSelector";
import BottomStaffDurationSelector from "./option-items/BottomStaffDurationSelector";
import TopStaffNotesPerChordSelector from "./option-items/TopStaffNotesPerChordSelector";
import BottomStaffNotesPerChordSelector from "./option-items/BottomStaffNotesPerChordSelector";
import TopStaffHighestPitchSelector from "./option-items/TopStaffHighestPitchSelector";
import TopStaffLowestPitchSelector from "./option-items/TopStaffLowestPitchSelector";
import BottomStaffHighestPitchSelector from "./option-items/BottomStaffHighestPitchSelector";
import BottomStaffLowestPitchSelector from "./option-items/BottomStaffLowestPitchSelector";
import KeySignatureSelector from "./option-items/KeySignatureSelector";
import TimeSignatureSelector from "./option-items/TimeSignatureSelector";

const Options = () => {
    const [exists, setExists] = useState(true);
    const [animation, setAnimation] = useState("");
    const timeoutRefExist = useRef<NodeJS.Timeout>();
    const timeoutRefAnimation = useRef<NodeJS.Timeout>();
    const buttonTime = 2000;

    useEffect(() => {
        const onInteract = () => {
            setExists(true);
            clearTimeout(timeoutRefAnimation.current);
            clearTimeout(timeoutRefExist.current);
            timeoutRefAnimation.current = setTimeout(() => setAnimation("animation-fadeout 1s"), buttonTime);
            timeoutRefExist.current = setTimeout(() => {
                setAnimation("animation-fadein 0.4s");
                setExists(false);
            }, buttonTime + 950);
        };
        onInteract();
        window.addEventListener("mousemove", onInteract);
        window.addEventListener("mousedown", onInteract);
        window.addEventListener("touchstart", onInteract);
        window.addEventListener("touchmove", onInteract);
        return () => {
            window.removeEventListener("mousemove", onInteract);
            window.removeEventListener("mousedown", onInteract);
            window.removeEventListener("touchstart", onInteract);
            window.removeEventListener("touchmove", onInteract);
        };
    }, [setAnimation, setExists]);

    const [optionsOpen, setOptionsOpen] = useState(false);

    return <>
        {exists ? <Button 
            sx={{ position: "absolute", zIndex: 1, animation: animation, top: '16px', left: '16px' }}
            variant="contained"
            onClick={() => setOptionsOpen(true)}
        >Options</Button> : null}
        <Dialog open={optionsOpen} onClose={() => setOptionsOpen(false)}>
            <DialogTitle>Random Music Options</DialogTitle>
            <Divider/>
            <List>
                <KeySignatureSelector/>
                <TimeSignatureSelector/>
                <TopStaffDurationSelector/>
                <BottomStaffDurationSelector/>
                <TopStaffNotesPerChordSelector/>
                <BottomStaffNotesPerChordSelector/>
                <TopStaffHighestPitchSelector/>
                <TopStaffLowestPitchSelector/>
                <BottomStaffHighestPitchSelector/>
                <BottomStaffLowestPitchSelector/>
            </List>
            <Button variant="contained" onClick={() => setOptionsOpen(false)}>Back</Button>
        </Dialog>
    </>;
};

export default Options;
