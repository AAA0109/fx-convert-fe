import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
} from '@mui/material';
import React from 'react';
import { customTheme, PangeaColors } from 'styles';

export const ListTableOfContents = ({
  listItems,
}: {
  listItems: {
    text: string;
    title?: boolean;
    href?: string;
    icon?: React.ReactElement;
  }[];
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
        return item.title ? (
          <Typography
            px={3}
            pt={2}
            pb={1}
            borderBottom={`1px solid ${PangeaColors.Gray}`}
            key={index}
          >
            {item.text}
          </Typography>
        ) : (
          <ListItem disablePadding divider key={index}>
            <ListItemButton href={item.href ?? ''} disableTouchRipple>
              {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
              <Typography
                style={
                  item.href
                    ? {
                        ...customTheme.typography.body2,
                      }
                    : {
                        ...customTheme.typography.body1,
                      }
                }
                sx={{
                  padding: '.25rem .5rem',
                }}
              >
                {item.text}
              </Typography>
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};
export default ListTableOfContents;
