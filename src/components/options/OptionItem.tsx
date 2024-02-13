import { ListItem, ListItemText } from "@mui/material";
import { ReactChildren } from "../../constants";

interface OptionItemProps {
    title: string,
    children: ReactChildren,
}

const OptionItem = ({ title, children }: OptionItemProps) => {
    return <ListItem>
        <ListItemText sx={{ userSelect: 'none', marginRight: '8px' }}>{title}</ListItemText>
        {children}
    </ListItem>;
};

export default OptionItem;
