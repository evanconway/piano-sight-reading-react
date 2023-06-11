import "react";
import { useEffect, useState } from "react";
import { renderAbcjs } from "../music_new/functions";
import { useAppDispatch, useAppSelector } from "../hooks";
import { advanceCursor, highlightCurrentChord, retreatCursor, selectMusic, selectMusicCurrentMidi } from "../state/musicSlice";

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
        dispatch(highlightCurrentChord);
        window.addEventListener("resize", render);
        return () => {
            window.removeEventListener("resize", render);
        };
    }, [music]);

    // arrow keys
    useEffect(() => {
        const onArrowKeys = (e: KeyboardEvent) => {
            if (e.code === "ArrowRight") dispatch(advanceCursor);
            if (e.code === "ArrowLeft") dispatch(retreatCursor);
        };
        window.addEventListener("keydown", onArrowKeys);
        return () => window.removeEventListener("keydown", onArrowKeys);
    }, []);

    // midi handling
    const [midiAccess, setMidiAccess] = useState<MIDIAccess>();
    const [playedMidi, setPlayedMidi] = useState<number[]>([]);

    // the midi values the user is supposed to play
    const musicCurrentMidi = useAppSelector(selectMusicCurrentMidi);

    if (midiAccess === undefined) navigator.requestMIDIAccess()
        .then(ma => setMidiAccess(ma))
        .catch(e => console.log(e));

    useEffect(() => {
        if (midiAccess === undefined) return;
        const handleMidi = (e: Event) => {
            const midiData = (e as MIDIMessageEvent).data;
            if (midiData.length === 1 && [248, 254].includes(midiData[0])) return;
            if (midiData[0] === 144 && midiData[2] > 0) setPlayedMidi([...playedMidi, midiData[1]].sort());
            if (midiData[0] === 144 && midiData[2] <= 0) setPlayedMidi(playedMidi.filter(m => m !== midiData[1]).sort());
            if (midiData[0] === 128) setPlayedMidi(playedMidi.filter(m => m !== midiData[1]).sort());
        };
        const addMidiHandlers = () => Array.from(midiAccess.inputs.values()).forEach(i => i.onmidimessage = handleMidi);
        /*
        Mindlessly add midi handles to all inputs whenever state changes. We don't really care what midi device plays the note,
        and if the device is disconnected there's no harm done.
        */
        addMidiHandlers();
        midiAccess.onstatechange = addMidiHandlers;
        return () => Array.from(midiAccess.inputs.values()).forEach(input => input.onmidimessage = null);
    }, [midiAccess, playedMidi, setPlayedMidi]);

    useEffect(() => {
        console.log("played:", playedMidi);
        console.log("target:", musicCurrentMidi);
        if (playedMidi.length !== musicCurrentMidi.length) return;
        debugger;
        for (let i = 0; i < playedMidi.length; i++) {
            if (playedMidi[i] !== musicCurrentMidi[i]) return;
        }
        setPlayedMidi([]);
        dispatch(advanceCursor)
    }, [playedMidi, musicCurrentMidi, dispatch]);

    return <div id="score" style={{
        backgroundColor: "#ffe0b3",
        textAlign: "center",
    }}/>;
};

export default Score;
