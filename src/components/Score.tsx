import "react";
import { useEffect } from "react";
import { renderAbcjs } from "../music_new/functions";

const Score = () => {
    /*
    The last staff doesn't stretch correctly when the width is greater than 1100 for some
    unknown reason. This is a temporary hack until we fix that issue.
    */
    const getWidth = () => Math.min(window.innerWidth * 0.9, 1100);

    useEffect(() => renderAbcjs([], getWidth()), []);

    useEffect(() => {
        window.addEventListener("resize", () => renderAbcjs([], getWidth()));
    }, []);

    return <div id="score" style={{
        backgroundColor: "#ffe0b3",
        textAlign: "center",
    }}/>;
};

export default Score;
