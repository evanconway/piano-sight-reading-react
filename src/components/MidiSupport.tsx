import { useEffect, useState } from "react";
import { Alert, Typography } from "@mui/material";
import { useAppSelector } from "../hooks";
import { selectAppMidiSupport } from "../state/appSlice";

const MidiSupport = () => {
    const [visible, setVisible] = useState(false);
    const status = useAppSelector(selectAppMidiSupport);

    useEffect(() => {
        setVisible(status === 'unsupported' ? true : false);
    }, [status]);

    return visible ? <Alert severity='error' sx={{ position: 'absolute', bottom: '16px', right: '16px' }}>
        <Typography>Not Supported</Typography>
        <p>Please use a browser that supports the WebMidi api.</p>
    </Alert> : null;
};

export default MidiSupport;
