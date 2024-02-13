import { Alert } from "@mui/material";
import { useAppSelector } from "../hooks";
import { selectAppMidiSupport } from "../state/appSlice";
import { useState } from "react";

const MidiSupport = () => {
    const [visible, setVisible] = useState(true);
    const status = useAppSelector(selectAppMidiSupport);

    return visible ? <Alert sx={{ position: 'absolute', bottom: '16px', right: '16px' }}>
        {status}
    </Alert> : null;
};

export default MidiSupport;
