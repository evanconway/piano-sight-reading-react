import "react";
import { useEffect } from "react";
import { makeMusic } from "../music/abcmusic";

const Score = () => {
    useEffect(makeMusic);

    return <div id="score" style={{
        backgroundColor: "#ffe0b3",
        textAlign: "center",
    }}/>;
};

export default Score;