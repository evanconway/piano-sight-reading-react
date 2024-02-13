import { useEffect, useLayoutEffect, useRef } from "react";
import { getMeasureWidthFromUserSettings, getMeasuresPerLine, getScorePaddingBottomFromWidth, getScorePaddingXFromWidth, getScoreScaleFromWidth, renderAbcjsToScore } from "../music/functions";
import { useAppDispatch, useAppSelector } from "../hooks";
import { advanceCursor, highlightCurrentChord, randomizeMusic, retreatCursor, selectMusic, setCursorToPathId, setCursorToStart } from "../state/musicSlice";
import { selectUserPreferences, userPreferencesSetScoreDimensions } from "../state/userPreferencesSlice";
import { SCORE_ELEMENT_HEIGHT_STYLE, SCORE_ELEMENT_WIDTH_STYLE, SCORE_ID } from "../constants";

const Score = () => {
    const dispatch = useAppDispatch();
    const music = useAppSelector(selectMusic);
    const scoreRef = useRef<HTMLDivElement>(null);
    const userPreferences = useAppSelector(selectUserPreferences);

    // handle choosing number of measures to generate based on screen size
    useLayoutEffect(() => {
        const onResize = () => {
            if (scoreRef.current === null) return;
            const { timeSignature, topStaffDuration, bottomStaffDuration, numberOfLines, measuresPerLine } = userPreferences;
            const { width: scoreWidth, height: scoreHeight } = scoreRef.current.getBoundingClientRect();
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
            if (scoreRef.current === null) return;
            renderAbcjsToScore(
                music.measures,
                scoreRef.current.getBoundingClientRect().width,
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
            while (scoreRef.current?.firstChild) {
                scoreRef.current.removeChild(scoreRef.current.firstChild);
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

    return <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    }}>
        <div
            id={SCORE_ID}
            ref={scoreRef}
            style={{
                backgroundColor: "#fff",
                width: SCORE_ELEMENT_WIDTH_STYLE,
                height: SCORE_ELEMENT_HEIGHT_STYLE,
                maxWidth: "1100px",
                boxShadow: "10px 10px 10px #888",
                margin: "0 auto",
                borderRadius: 4,
                animation: "animation-fadein 0.6s, animation-risein 0.6s",
            }}
        />
    </div>;
};

export default Score;
