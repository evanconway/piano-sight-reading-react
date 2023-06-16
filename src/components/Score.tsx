import "react";
import { useEffect, useRef, useState } from "react";
import { renderAbcjs } from "../music_new/functions";
import { useAppDispatch, useAppSelector } from "../hooks";
import { advanceCursor, highlightCurrentChord, randomizeMusic, retreatCursor, selectCursorAtFinalChord, selectMusic, selectMusicCurrentMidi, setCursorToStart } from "../state/musicSlice";
import { selectUserPreferences } from "../state/userPreferencesSlice";
import { SCORE_ID } from "../constants";

const Score = () => {
    const dispatch = useAppDispatch();
    const music = useAppSelector(selectMusic);

    const scoreRef = useRef<HTMLDivElement>(null);

    // render
    useEffect(() => {
        const render = () => {
            if (scoreRef.current === null) return;
            renderAbcjs(music, scoreRef.current.getBoundingClientRect().width);
            /*
            Unfortunately, the abcjs.render function is not pure, and modifies the styles of
            the target element, which is the score in this case. When the scale of the render
            is less than 1, it adds a width style to the div. This breaks our resize logic.
            To fix this, we remove the width style if it exists.
            */
            scoreRef.current.style.width = "";
            dispatch(highlightCurrentChord());
        };
        window.addEventListener("resize", render);
        render();
        return () => {
            window.removeEventListener("resize", render);
            while (scoreRef.current?.firstChild) {
                scoreRef.current.removeChild(scoreRef.current.firstChild);
            }
        };
    }, [music]);

    // arrow keys
    useEffect(() => {
        const onArrowKeys = (e: KeyboardEvent) => {
            if (e.code === "ArrowRight") dispatch(advanceCursor());
            if (e.code === "ArrowLeft") dispatch(retreatCursor());
        };
        window.addEventListener("keydown", onArrowKeys);
        return () => window.removeEventListener("keydown", onArrowKeys);
    }, []);

    const [midiAccess, setMidiAccess] = useState<MIDIAccess>();
    const [playedMidi, setPlayedMidi] = useState<number[]>([]);

    // the midi values the user is supposed to play
    const musicCurrentMidi = useAppSelector(selectMusicCurrentMidi);

    const cursorAtEnd = useAppSelector(selectCursorAtFinalChord);

    if (midiAccess === undefined) navigator.requestMIDIAccess()
        .then(ma => setMidiAccess(ma))
        .catch(e => console.log(e));

    const userPreferences = useAppSelector(selectUserPreferences);

    // midi handling
    useEffect(() => {
        if (midiAccess === undefined) return;
        const handleMidi = (e: Event) => {
            const midiData = (e as MIDIMessageEvent).data;
            let newPlayedMidi: number[] = [];
            if (midiData.length >= 1 && [248, 254, 176].includes(midiData[0])) return;
            if (midiData[0] === 144 && midiData[2] > 0) newPlayedMidi = [...playedMidi, midiData[1]].sort();
            if (midiData[0] === 144 && midiData[2] <= 0) newPlayedMidi = playedMidi.filter(m => m !== midiData[1]).sort();
            if (midiData[0] === 128) newPlayedMidi = playedMidi.filter(m => m !== midiData[1]).sort();

            console.log(`played: ${newPlayedMidi}\ntarget: ${musicCurrentMidi}`);
            if (newPlayedMidi.length !== musicCurrentMidi.length) {
                setPlayedMidi(newPlayedMidi);
                return;
            }
            for (let i = 0; i < newPlayedMidi.length; i++) {
                if (newPlayedMidi[i] !== musicCurrentMidi[i]) {
                    setPlayedMidi(newPlayedMidi);
                    return;
                }
            }
            setPlayedMidi([]);
            if (cursorAtEnd) {
                dispatch(randomizeMusic(userPreferences));
                dispatch(setCursorToStart());
            } else dispatch(advanceCursor());
        };
        const addMidiHandlers = () => Array.from(midiAccess.inputs.values()).forEach(i => i.onmidimessage = handleMidi);
        /*
        Mindlessly add midi handles to all inputs whenever state changes. We don't really care what midi device plays the note,
        and if the device is disconnected there's no harm done.
        */
        addMidiHandlers();
        midiAccess.onstatechange = addMidiHandlers;
        return () => Array.from(midiAccess.inputs.values()).forEach(input => input.onmidimessage = null);
    }, [
        midiAccess,
        playedMidi,
        setPlayedMidi,
        musicCurrentMidi,
        dispatch,
        advanceCursor,
        randomizeMusic,
        cursorAtEnd,
        userPreferences
    ]);

    return <div id={SCORE_ID} ref={scoreRef} style={{
        backgroundColor: "#fff", // "#ffe0b3"
        maxWidth: "1100px",
        border: "3px solid #000",
        margin: "0 auto",
        borderRadius: 8,
    }}/>;
};

export default Score;
