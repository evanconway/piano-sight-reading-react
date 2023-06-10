import "react";
import { useEffect } from "react";
import { renderAbcjs } from "../music_new/functions";
import { useAppDispatch, useAppSelector } from "../hooks";
import { advanceCursor, selectMusic } from "../state/musicSlice";

const Score = () => {
    const dispatch = useAppDispatch();
    const music = useAppSelector(selectMusic);

    /*
    The last staff doesn't stretch correctly when the width is greater than 1100 for some
    unknown reason. This is a temporary hack until we fix that issue.
    */
    const getWidth = () => Math.min(window.innerWidth * 0.9, 1100);

    useEffect(() => {
        const render = () => renderAbcjs(music, getWidth());
        render();
        const onKeyRight = (e: KeyboardEvent) => {
            if (e.code !== "ArrowRight") return;
            console.log(e);
            // why is this an action creator and not an action???
            dispatch(advanceCursor());
            console.log("dispatch happened");
        };
        window.addEventListener("resize", render);
        window.addEventListener("keydown", onKeyRight);
        return () => {
            window.removeEventListener("resize", render);
            window.removeEventListener("keydown", onKeyRight);
        };
    }, [music]);

    return <div id="score" style={{
        backgroundColor: "#ffe0b3",
        textAlign: "center",
    }}/>;
};

export default Score;
