import { Typography } from "@mui/material";
import { ReactChildren } from "../constants";

interface OptionTypographyProps {
    children: ReactChildren;
}

const OptionTypography = ({ children }: OptionTypographyProps) => {
    return <Typography sx={{}}>{children}</Typography>;
};

export default OptionTypography;
