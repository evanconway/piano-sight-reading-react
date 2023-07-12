import "react";
import { useEffect, useRef, useState } from "react";
import { Modal, Button, Typography } from "@mui/material";
import TopStaffDurationSelector from "./TopStaffDurationSelector";
import BottomStaffDurationSelector from "./BottomStaffDurationSelector";
import TopStaffNotesPerChordSelector from "./TopStaffNotesPerChordSelector";
import BottomStaffNotesPerChordSelector from "./BottomStaffNotesPerChordSelector";

const Options = () => {
    const [exists, setExists] = useState(true);
    const [animation, setAnimation] = useState("");
    const timeoutRefExist = useRef<number>();
    const timeoutRefAnimation = useRef<number>();
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
            sx={{ position: "absolute", zIndex: 1, animation: animation }}
            variant="contained"
            onClick={() => setOptionsOpen(true)}
        >Options</Button> : null}
        <Modal open={optionsOpen} onClose={() => setOptionsOpen(false)}>
            <div
                style={{
                    position: "absolute",
                    backgroundColor: "#fff",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    minWidth: "350px",
                    padding: "16px",
                    borderRadius: 8,
                }}
            >
                <Typography variant="h4">Random Music Options</Typography>
                <TopStaffDurationSelector/>
                <BottomStaffDurationSelector/>
                <TopStaffNotesPerChordSelector/>
                <BottomStaffNotesPerChordSelector/>
            </div>
        </Modal>
    </>;
};

export default Options;
