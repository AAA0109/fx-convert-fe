import { Box, Grid } from '@mui/material';
import type { ReactNode } from 'react';

interface GridPageProps {
  aside: ReactNode;
  main: ReactNode;
  isTabPanel?: boolean;
  asidePosition?: 'left' | 'right';
}

export const GridTabLayout = ({
  aside,
  main,
  isTabPanel = true,
  asidePosition = 'right',
}: GridPageProps) => {
  return (
    <Grid container direction={'row'} columns={10} mt={'64px'}>
      <Grid item xl={asidePosition === 'right' ? 6 : 3} minWidth={0}>
        {asidePosition === 'right' ? main : aside}
      </Grid>
      <Grid item xl={1}>
        &nbsp;
      </Grid>
      <Grid item xl={asidePosition === 'right' ? 3 : 6}>
        {!isTabPanel ? (
          <Box top={264} position={'sticky'}>
            {asidePosition === 'right' ? aside : main}
          </Box>
        ) : (
          <Box>{asidePosition === 'right' ? aside : main}</Box>
        )}
      </Grid>
    </Grid>
  );
};
export default GridTabLayout;
