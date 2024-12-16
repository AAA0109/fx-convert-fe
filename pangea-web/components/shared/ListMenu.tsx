import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { IAccountPageListItem, setAlpha } from 'lib';
import { PangeaColors } from 'styles';

export const ListMenu = ({
  stateGetter,
  stateSetter,
  listItems,
}: {
  stateGetter: number;
  stateSetter(n: number): void;
  listItems: IAccountPageListItem[];
}) => {
  return (
    <List
      disablePadding
      dense
      sx={{
        bgcolor: PangeaColors.White,
        border: `1px solid ${PangeaColors.Gray}`,
        borderRadius: '4px',
      }}
    >
      {listItems.map((item, index) => {
        return (
          <ListItem
            disablePadding
            divider
            key={index}
            sx={{
              bgcolor:
                stateGetter === index
                  ? setAlpha(PangeaColors.SolidSlateMedium, 0.08)
                  : PangeaColors.White,
            }}
          >
            <ListItemButton
              data-router={item.urlPathPart}
              onClick={() => {
                stateSetter(index);
              }}
              selected={stateGetter === index}
            >
              {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};
export default ListMenu;
