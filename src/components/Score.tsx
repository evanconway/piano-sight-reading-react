import "react";
import { useEffect, useState } from "react";
import { renderAbcjs } from "../music_new/functions";
import { useAppDispatch, useAppSelector } from "../hooks";
import { advanceCursor, highlightCurrentChord, randomizeMusic, retreatCursor, selectCursorAtEndOfMusic, selectMusic, selectMusicCurrentMidi } from "../state/musicSlice";
import { selectUserPreferences } from "../state/userPreferencesSlice";

const Score = () => {
    const dispatch = useAppDispatch();
    const music = useAppSelector(selectMusic);

    /*
    The last staff doesn't stretch correctly when the width is greater than 1100 for some
    unknown reason. This is a temporary hack until we fix that issue.
    */
    const getWidth = () => Math.min(window.innerWidth * 0.9, 1100);

    // render
    useEffect(() => {
        const render = () => renderAbcjs(music, getWidth());
        render();
        dispatch(highlightCurrentChord());
        window.addEventListener("resize", render);
        return () => {
            window.removeEventListener("resize", render);
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

    // midi handling
    const [midiAccess, setMidiAccess] = useState<MIDIAccess>();
    const [playedMidi, setPlayedMidi] = useState<number[]>([]);

    // the midi values the user is supposed to play
    const musicCurrentMidi = useAppSelector(selectMusicCurrentMidi);

    const cursorAtEnd = useAppSelector(selectCursorAtEndOfMusic);

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
            if (cursorAtEnd) dispatch(randomizeMusic(userPreferences));
            else dispatch(advanceCursor());
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

    return <div id="score" style={{
        backgroundColor: "#ffe0b3",
        textAlign: "center",
    }}/>;
};

export default Score;
