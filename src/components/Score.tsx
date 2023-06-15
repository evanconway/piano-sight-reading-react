import "react";
import { useEffect, useState } from "react";
import { renderAbcjs } from "../music_new/functions";
import { useAppDispatch, useAppSelector } from "../hooks";
import { advanceCursor, highlightCurrentChord, randomizeMusic, retreatCursor, selectCursorAtFinalChord, selectMusic, selectMusicCurrentMidi, setCursorToStart } from "../state/musicSlice";
import { selectUserPreferences } from "../state/userPreferencesSlice";
import { SCORE_ID } from "../music_new/defaults";

const Score = () => {
    const dispatch = useAppDispatch();
    const music = useAppSelector(selectMusic);

    // render
    useEffect(() => {
        const clearChildren = (element: Element) => {
            while (element.firstChild) element.removeChild(element.firstChild);
        };
        const render = () => {
            const scoreElement = document.querySelector(`#${SCORE_ID}`);
            if (scoreElement === null) return;
            clearChildren(scoreElement); // remove old svg to be safe
            renderAbcjs(music, scoreElement.getBoundingClientRect().width);
            dispatch(highlightCurrentChord());
        };
        render();
        window.addEventListener("resize", render);
        return () => {
            window.removeEventListener("resize", render);
            const scoreElement = document.querySelector(`#${SCORE_ID}`);
            if (scoreElement !== null) clearChildren(scoreElement);
        }
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

    // midi handling
    const [midiAccess, setMidiAccess] = useState<MIDIAccess>();
    const [playedMidi, setPlayedMidi] = useState<number[]>([]);

    // the midi values the user is supposed to play
    const musicCurrentMidi = useAppSelector(selectMusicCurrentMidi);

    const cursorAtEnd = useAppSelector(selectCursorAtFinalChord);

    if (midiAccess === undefined) navigator.requestMIDIAccess()
        .then(ma => setMidiAccess(ma))
        .catch(e => console.log(e));

    const userPreferences = useAppSelector(selectUserPreferences);

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

    return <div id={SCORE_ID} style={{
        backgroundColor: "#ffe0b3",
        textAlign: "center",
        maxWidth: "1100px",
        borderRadius: 8,
    }}/>;
};

export default Score;
