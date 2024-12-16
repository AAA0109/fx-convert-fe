import { Box, Stack, Typography } from '@mui/material';
import { ReactElement } from 'react';
import { PangeaColors } from 'styles';
import { IconBorder } from '../icons/IconBorder';
import { PangeaButton } from '../shared';

export const EmptyDashboardState = (props: {
  tab: string;
  title: string;
  message: string;
  buttonTitle: string;
  buttonHref: string;
  outlinedIcon: ReactElement;
}) => {
  return (
    <>
      <Box
        border={`1px solid ${PangeaColors.Gray}`}
        borderRadius='4px'
        bgcolor={PangeaColors.White}
        justifyContent='center'
        mt={6}
        px={3}
        mx='auto'
        py={4}
      >
        <Stack alignItems='center' spacing={3}>
          <IconBorder borderColor={PangeaColors.Black}>
            {props.outlinedIcon}
          </IconBorder>
          <Typography component='h1' variant='h4'>
            {props.title}
          </Typography>
          <Box>
            <Typography
              variant='body1'
              color={PangeaColors.BlackSemiTransparent60}
            >
              {props.message}
            </Typography>
          </Box>
          <PangeaButton
            size='medium'
            variant='contained'
            href={props.buttonHref}
          >
            {props.buttonTitle}
          </PangeaButton>
        </Stack>
      </Box>
    </>
  );
};
export default EmptyDashboardState;
