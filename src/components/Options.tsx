import "react";
import { useEffect, useRef, useState } from "react";
import { Modal, Button, Box, Select, MenuItem, InputLabel, FormControl, Typography } from "@mui/material";
import { NoteDuration, getNoteDurationValue } from "../music_new/models";
import { selectUserPreferences, userPreferencesSetTopStaffDuration } from "../state/userPreferencesSlice";
import { useAppDispatch, useAppSelector } from "../hooks";

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
    
    const userPreferences = useAppSelector(selectUserPreferences);

    const dispatch = useAppDispatch();

    return <>
        {exists ? <Button 
            sx={{
                position: "absolute",
                zIndex: 1,
                animation: animation,
            }}
            variant="contained"
            onClick={() => setOptionsOpen(true)}
        >Options</Button> : null}
        <Modal open={optionsOpen} onClose={() => setOptionsOpen(false)}>
            <div
                style={{
                    position: "absolute",
                    backgroundColor: "#fff",
                    //width: "200px",
                    //height: "200px",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <FormControl fullWidth sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}>
                    <Typography sx={{ padding: "10px" }}>Top Staff Duration</Typography>
                    <Select
                        id="options-duration-top-staff"
                        value={userPreferences.topStaffDuration}
                        label="top staff duration"
                        sx={{ marginLeft: "auto" }}
                        onChange={e => {
                            dispatch(userPreferencesSetTopStaffDuration(e.target.value as NoteDuration));
                            
                        }}
                    >
                        <MenuItem value={"whole"}>Whole</MenuItem>
                        <MenuItem value={"half"}>Half</MenuItem>
                        <MenuItem value={"quarter"}>Quarter</MenuItem>
                        <MenuItem value={"eighth"}>Eighth</MenuItem>
                        <MenuItem value={"sixteenth"}>Sixteenth</MenuItem>
                    </Select>
                </FormControl>
            </div>
        </Modal>
    </>;
};

export default Options;
