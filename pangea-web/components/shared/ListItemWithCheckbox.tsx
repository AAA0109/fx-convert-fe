import {
  FormControl,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Radio,
} from '@mui/material';
import { ReactNode } from 'react';
import { PangeaColors } from 'styles';

interface ListItemWithCheckboxProps {
  onChange?: (selection: string) => void;
  value: Optional<Nullable<string>>;
  iconFontSize?: string;
  primaryTextSize?: string;
  primaryTextMB?: string;
  iconMarginRight?: string;
  listData: {
    primaryText?: Optional<string>;
    secondaryText?: Optional<string>;
    icon?: ReactNode;
    value: string;
  }[];
}

export const ListItemWithCheckbox = (props: ListItemWithCheckboxProps) => {
  const {
    iconFontSize = '35px',
    primaryTextSize = 'heroBody',
    primaryTextMB = '4px',
    iconMarginRight = '20px',
  } = props;
  return (
    <>
      <FormControl>
        <List
          sx={{
            width: '100%',
            maxWidth: '516px',
            padding: 0,
            '& .MuiListItem-root': {
              marginBottom: '24px',
              minWidth: 'auto',
            },
            '& .MuiListItem-root:last-child': {
              marginBottom: '0px',
            },
            '& .MuiRadio-root': {
              paddingTop: '0px',
              paddingBottom: '0px',
            },
            '& .MuiListItemIcon-root': {
              minWidth: 'auto',
              marginTop: '0px',
            },
          }}
        >
          {props.listData.map((item, i) => {
            return (
              <ListItem
                sx={{
                  borderRadius: '4px',
                  border: `1px solid ${PangeaColors.Gray}`,
                  padding: 0,
                }}
                key={i}
              >
                <ListItemButton
                  alignItems='flex-start'
                  disableTouchRipple
                  sx={{
                    padding: '24px',
                    display: 'flex',
                  }}
                  onClick={() => {
                    props.onChange?.(item.value);
                  }}
                >
                  <ListItemIcon
                    sx={{
                      marginTop: 0,
                      '& .MuiSvgIcon-root': {
                        fontSize: `${iconFontSize}`,
                        marginRight: `${iconMarginRight}`,
                      },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    sx={{ margin: 0 }}
                    primaryTypographyProps={{
                      typography: `${primaryTextSize}`,
                      marginBottom: `${primaryTextMB}`,
                    }}
                    primary={item.primaryText}
                    secondary={item.secondaryText}
                  />
                  <ListItemIcon>
                    <Radio
                      value={item.value}
                      checked={props.value == item.value}
                    />
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </FormControl>
    </>
  );
};
export default ListItemWithCheckbox;
