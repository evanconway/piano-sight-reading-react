import { useEffect, useLayoutEffect, useRef } from "react";
import { getMeasureWidthFromUserSettings, getMeasuresPerLine, getScorePaddingBottomFromWidth, getScorePaddingXFromWidth, getScoreScaleFromWidth, renderAbcjsToScore } from "../music/functions";
import { useAppDispatch, useAppSelector } from "../hooks";
import { advanceCursor, highlightCurrentChord, randomizeMusic, retreatCursor, selectMusic, selectMusicCurrentPathId, setCursorToPathId, setCursorToStart } from "../state/musicSlice";
import { selectUserPreferences, userPreferencesSetScoreDimensions } from "../state/userPreferencesSlice";
import { SCORE_ID } from "../constants";

const Score = () => {
    const dispatch = useAppDispatch();
    const music = useAppSelector(selectMusic);
    const scoreWrapperRef = useRef<HTMLDivElement>(null);
    const userPreferences = useAppSelector(selectUserPreferences);

    // handle choosing number of measures to generate based on screen size
    useLayoutEffect(() => {
        const onResize = () => {
            if (scoreWrapperRef.current === null) return;
            const { timeSignature, topStaffDuration, bottomStaffDuration, numberOfLines, measuresPerLine } = userPreferences;
            const { width: scoreWidth, height: scoreHeight } = scoreWrapperRef.current.getBoundingClientRect();
            const width = scoreWidth - getScorePaddingXFromWidth() * 2;
            const height = scoreHeight - getScorePaddingBottomFromWidth();
            const scale = getScoreScaleFromWidth();
            const lineHeight = 170 * scale;
            const newNumOfLines = Math.max(Math.floor(height / lineHeight), 1);
            const measureWidth = scale * getMeasureWidthFromUserSettings(timeSignature, topStaffDuration, bottomStaffDuration);
            const newMeasuresPerLine = Math.max(getMeasuresPerLine(width, measureWidth), 1);
            if (newNumOfLines !== numberOfLines || newMeasuresPerLine !== measuresPerLine) {
                dispatch(userPreferencesSetScoreDimensions({
                    numberOfLines: newNumOfLines,
                    measuresPerLine: newMeasuresPerLine,
                }));
            }
        };
        window.addEventListener("resize", onResize);
        onResize();
        return () => window.removeEventListener("resize", onResize);
    }, [dispatch, userPreferences]);

    // regenerate music on preferences change
    useEffect(() => {
        dispatch(randomizeMusic(userPreferences));
        dispatch(setCursorToStart());
    }, [dispatch, userPreferences]);

    // render
    useEffect(() => {
        const render = () => {
            if (scoreWrapperRef.current === null) return;
            renderAbcjsToScore(
                music.measures,
                scoreWrapperRef.current.getBoundingClientRect().width,
                (e) => dispatch(setCursorToPathId(e.abselem.elemset[0].id)),
                { measuresPerLine: music.measuresPerLine },
            );
            dispatch(highlightCurrentChord());
        };

        // music must be re-rendered on resize, even with the same music, to ensure correct music positioning
        window.addEventListener("resize", render);
        render();
        return () => {
            window.removeEventListener("resize", render);

            /*
            This line undoes the rendering of renderAbcjsToScore. It doesn't seem to affect performance or
            behavior, but it is technically how useEffect should work.
            */
            const scoreElement = document.getElementById(SCORE_ID);
            while (scoreElement?.firstChild) {
                scoreElement.removeChild(scoreElement.firstChild);
            }
        };
    }, [dispatch, music]);

    // arrow keys
    useEffect(() => {
        const onArrowKeys = (e: KeyboardEvent) => {
            if (e.code === "ArrowRight") dispatch(advanceCursor());
            if (e.code === "ArrowLeft") dispatch(retreatCursor());
        };
        window.addEventListener("keydown", onArrowKeys);
        return () => window.removeEventListener("keydown", onArrowKeys);
    }, [dispatch]);

    const currentPathIds = useAppSelector(selectMusicCurrentPathId);

    // hover changes note color
    useEffect(() => {
        const onHover = (e: MouseEvent) => {
            const { clientX: mouseX, clientY: mouseY } = e;
            Array.from(document.getElementsByClassName('abcjs-note')).forEach(chord => {
                console.log(currentPathIds);
                const { x: chordX, y: chordY, width, height } = chord.getBoundingClientRect();
                const hIn = mouseX >= chordX && mouseX <= (chordX + width);
                const vIn = mouseY >= chordY && mouseY <= (chordY + height);
                const fill = vIn && hIn ? '#ccc' : '#000';
                if (chord.id === currentPathIds.topPathId || chord.id === currentPathIds.bottomPathId) return;
                Array.from(chord.getElementsByClassName('abcjs-notehead')).forEach(e => e.setAttribute('fill', fill));
                Array.from(chord.getElementsByClassName('abcjs-stem')).forEach(e => e.setAttribute('fill', fill));
            });
        };
        window.addEventListener('mouseover', onHover);
        return () => window.removeEventListener('mouseover', onHover);
    }, [currentPathIds]);

    return <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    }}>
        <div ref={scoreWrapperRef} style={{
            backgroundColor: "#fff",
            width: '100%',
            height: '90vh',
            maxWidth: "1100px",
            boxShadow: "10px 10px 10px #888",
            margin: "0 auto",
            borderRadius: 4,
            animation: "animation-fadein 0.6s, animation-risein 0.6s",
        }}>
            <div id={SCORE_ID}/>
        </div>
    </div>;
};

export default Score;
