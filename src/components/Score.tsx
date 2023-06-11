import "react";
import { useEffect } from "react";
import { renderAbcjs } from "../music_new/functions";
import { useAppDispatch, useAppSelector } from "../hooks";
import { advanceCursor, highlightCurrentChord, retreatCursor, selectMusic } from "../state/musicSlice";

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
        const onArrowKeys = (e: KeyboardEvent) => {
            // why is this an action creator and not an action???
            if (e.code === "ArrowRight") dispatch(advanceCursor);
            if (e.code === "ArrowLeft") dispatch(retreatCursor);
        };
        window.addEventListener("resize", render);
        window.addEventListener("keydown", onArrowKeys);
        dispatch(highlightCurrentChord);

        const midiToIgnore = [248, 254];

        const handleMidiEvent = (e: Event) => {
            const midiMsg = e as MIDIMessageEvent;
            if (midiMsg.data.length === 1 && midiToIgnore.includes(midiMsg.data[0])) return;
            console.log(midiMsg);
        };

        const addMidiHandlers = (ma: MIDIAccess) => {
            Array.from(ma.inputs.values()).forEach(input => {
                input.onmidimessage = handleMidiEvent;
                console.log("midi event handler added to input:", input);
            });
            // midiAccess.onstatechange = () => addMessagehandlers(inputs);
        };

        navigator.requestMIDIAccess().then(addMidiHandlers).catch(e => console.log(e));
        
        return () => {
            window.removeEventListener("resize", render);
            window.removeEventListener("keydown", onArrowKeys);
            navigator.requestMIDIAccess().then((ma: MIDIAccess) => {
                Array.from(ma.inputs.values()).forEach(input => {
                    console.log("input to remove events from:", input);
                });
            });
        };
    }, [music]);

    return <div id="score" style={{
        backgroundColor: "#ffe0b3",
        textAlign: "center",
    }}/>;
};

export default Score;
