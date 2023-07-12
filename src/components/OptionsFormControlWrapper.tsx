import FormControl from "@mui/material/FormControl";
import { ReactChildren } from "../constants";

type Props = {
    children: ReactChildren; 
  }

const OptionsFormControlWrapper = ({ children }: Props) => {
    return <FormControl sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        margin: "8px",
    }}>
        {children}
    </FormControl>
};

export default OptionsFormControlWrapper;
