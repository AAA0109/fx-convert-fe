import { Grid } from '@mui/material';
import React from 'react';

interface GridPageProps {
  children: React.ReactNode;
}

export const GridLayoutOneTenOne = ({ children }: GridPageProps) => {
  return (
    <Grid
      container
      columnSpacing={3}
      justifyContent='space-between'
      direction='row'
    >
      <Grid item xl={1}>
        &nbsp;
      </Grid>
      <Grid item xl={10} minWidth={0}>
        {children}
      </Grid>
      <Grid item xl={1}>
        &nbsp;
      </Grid>
    </Grid>
  );
};
export default GridLayoutOneTenOne;
