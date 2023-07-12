import { Typography } from "@mui/material";
import { ReactChildren } from "../constants";

interface OptionTypographyProps {
    children: ReactChildren;
}

const OptionTypography = ({ children }: OptionTypographyProps) => {
    return <Typography sx={{ padding: "10px" }}>{children}</Typography>;
};

export default OptionTypography;
