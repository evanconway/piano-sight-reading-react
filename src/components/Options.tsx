import "react";
import { useEffect, useRef, useState } from "react";

const Options = () => {
    const [exists, setExists] = useState(true);
    const [animation, setAnimation] = useState("");
    const timeoutRefExist = useRef<number>();
    const timeoutRefAnimation = useRef<number>();

    const buttonTime = 2000;

    useEffect(() => {
        const onInteract = () => {
            setExists(true);
            clearTimeout(timeoutRefAnimation.current);
            clearTimeout(timeoutRefExist.current);
            timeoutRefAnimation.current = setTimeout(() => setAnimation("animation-fadeout 1s"), buttonTime);
            timeoutRefExist.current = setTimeout(() => {
                setAnimation("animation-fadein 0.4s");
                setExists(false);
            }, buttonTime + 950);
        };
        onInteract();
        window.addEventListener("mousemove", onInteract);
        window.addEventListener("mousedown", onInteract);
        window.addEventListener("touchstart", onInteract);
        window.addEventListener("touchmove", onInteract);
        return () => {
            window.removeEventListener("mousemove", onInteract);
            window.removeEventListener("mousedown", onInteract);
            window.removeEventListener("touchstart", onInteract);
            window.removeEventListener("touchmove", onInteract);
        };
    }, [setAnimation, setExists]);

    return exists ? <button style={{
        position: "absolute",
        fontSize: "large",
        cursor: "pointer",
        zIndex: 1,
        animation: animation,
    }}>Options</button> : null;
};

export default Options;
