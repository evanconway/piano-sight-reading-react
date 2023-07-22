import "react";
import { useEffect, useRef, useState } from "react";
import { getMeasureWidthFromUserSettings, getMeasuresPerLine, renderAbcjs } from "../music_new/functions";
import { useAppDispatch, useAppSelector } from "../hooks";
import { advanceCursor, highlightCurrentChord, randomizeMusic, retreatCursor, selectCursorAtFinalChord, selectMusic, selectMusicCurrentMidi, setCursorToPathId, setCursorToStart } from "../state/musicSlice";
import { selectUserPreferences, userPreferencesSetNumberOfMeasures } from "../state/userPreferencesSlice";
import { SCORE_ID } from "../constants";

const Score = () => {
    const dispatch = useAppDispatch();
    const music = useAppSelector(selectMusic);
    const scoreRef = useRef<HTMLDivElement>(null);
    const userPreferences = useAppSelector(selectUserPreferences);

    // handle choosing number of measures to generate based on screen size
    useEffect(() => {
        const onResize = () => {
            if (scoreRef.current === null) return;
            const html = document.getElementsByTagName("html")[0];
            const width = Math.min(html.offsetWidth, 1100);
            const height = html.offsetHeight * 0.9;
            const lineHeight = 170; // arbitrary assume lines are 100px high
            const numOfLines = Math.floor(height / lineHeight);
            const { timeSignature, topStaffDuration, bottomStaffDuration, numberOfMeasures } = userPreferences;
            const measuresPerLine = getMeasuresPerLine(width, getMeasureWidthFromUserSettings(timeSignature, topStaffDuration, bottomStaffDuration));
            const newNumOfMeasures = numOfLines * measuresPerLine;
            if (newNumOfMeasures !== numberOfMeasures) dispatch(userPreferencesSetNumberOfMeasures(newNumOfMeasures));
        };
        window.addEventListener("resize", onResize);
        onResize();
        return () => window.removeEventListener("resize", onResize);
    }, [userPreferences]);

    // regenerage music on preferences change
    useEffect(() => {
        dispatch(randomizeMusic(userPreferences));
        dispatch(setCursorToStart());
    }, [userPreferences]);

    // render
    useEffect(() => {
        const render = () => {
            if (scoreRef.current === null) return;
            renderAbcjs(
                music,
                scoreRef.current.getBoundingClientRect().width,
                (e) => dispatch(setCursorToPathId(e.abselem.elemset[0].id)),
            );
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

    return <div
        id={SCORE_ID}
        ref={scoreRef}
        style={{
            backgroundColor: "#fff",
            maxWidth: "1100px",
            height: "100%",
            boxShadow: "10px 10px 10px #888",
            margin: "0 auto",
            borderRadius: 4,
            animation: "animation-fadein 0.6s, animation-risein 0.6s",
        }}
    />;
};

export default Score;
