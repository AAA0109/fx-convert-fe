import { Box, Grid, Typography } from '@mui/material';
import { AccordionContentBlockProps } from 'lib';
import { isString } from 'lodash';

export const AccordionContentBlock = ({
  label = '',
  children,
  isChanged = false,
  labelProps,
  labelRightProps,
  labelRight,
  autoWidthRight,
  expanded = false,
}: AccordionContentBlockProps) => {
  const contentIsString = isString(children);
  const maxContainerSize = expanded ? '100%' : 246;
  return (
    <Box sx={{ flexGrow: 1 }} component='div'>
      <Grid
        justifyContent='space-between'
        alignItems='center'
        alignContent='center'
        width={maxContainerSize}
        container
        spacing={0.5}
      >
        <Grid item xl='auto'>
          <Typography
            variant='dataLabel'
            color={(theme) =>
              isChanged
                ? theme.palette.info.main
                : theme.typography.dataLabel.color
            }
            {...labelProps}
          >
            {label}
          </Typography>
        </Grid>
        {labelRight ? (
          <Grid
            item
            xl='auto'
            flexGrow={1}
            sx={{ wordWrap: 'normal' }}
            style={{ maxWidth: maxContainerSize }}
            color={(theme) =>
              isChanged
                ? theme.palette.info.main
                : theme.typography.dataBody.color
            }
          >
            <Typography
              variant='dataBody'
              color={(theme) =>
                isChanged
                  ? theme.palette.info.main
                  : theme.typography.dataBody.color
              }
              {...labelRightProps}
            >
              {labelRight}
            </Typography>
          </Grid>
        ) : null}
        <Grid
          item
          xl={contentIsString || autoWidthRight ? 'auto' : 12}
          flexGrow={1}
          sx={{ wordWrap: 'normal' }}
          style={{ maxWidth: maxContainerSize }}
          color={(theme) =>
            isChanged
              ? theme.palette.info.main
              : theme.typography.dataBody.color
          }
        >
          {contentIsString ? (
            <Typography
              variant='dataBody'
              color={(theme) =>
                isChanged
                  ? theme.palette.info.main
                  : theme.typography.dataBody.color
              }
            >
              {children}
            </Typography>
          ) : (
            children
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
export default AccordionContentBlock;
