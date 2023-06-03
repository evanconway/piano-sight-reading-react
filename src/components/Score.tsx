import "react";
import { useEffect } from "react";
import { generateRandomMusic, renderAbcjs } from "../music_new/functions";
import { useAppSelector } from "../hooks";
import { selectMusic } from "../state/musicSlice";

const Score = () => {
    const music = useAppSelector(selectMusic);

    /*
    The last staff doesn't stretch correctly when the width is greater than 1100 for some
    unknown reason. This is a temporary hack until we fix that issue.
    */
    const getWidth = () => Math.min(window.innerWidth * 0.9, 1100);

    useEffect(() => {
        const render = () => renderAbcjs(music, getWidth());
        render();
        window.addEventListener("resize", render);
        return () => window.removeEventListener("resize", render);
    }, [music]);

    return <div id="score" style={{
        backgroundColor: "#ffe0b3",
        textAlign: "center",
    }}/>;
};

export default Score;
