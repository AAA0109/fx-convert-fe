import { Box, Grid } from '@mui/material';
import type { ReactNode } from 'react';

interface GridPageProps {
  left: ReactNode;
  right: ReactNode;
  fixed?: boolean;
  titleRowNode?: ReactNode;
}

export const Grid63Layout = ({
  left,
  right,
  fixed,
  titleRowNode,
}: GridPageProps) => {
  return (
    <Grid
      container
      columnSpacing={3}
      justifyContent='space-between'
      direction='row'
    >
      {titleRowNode ? (
        <>
          <Grid item xl={1}>
            &nbsp;
          </Grid>
          <Grid item xl={10}>
            {titleRowNode}
          </Grid>
          <Grid item xl={1}>
            &nbsp;
          </Grid>
        </>
      ) : null}
      <Grid item xl={1}>
        &nbsp;
      </Grid>
      <Grid item xl={6} minWidth={0}>
        {left}
      </Grid>
      <Grid item xl={1}>
        &nbsp;
      </Grid>
      <Grid item xl={3}>
        <Box top={264} position={fixed ? 'unset' : 'sticky'}>
          {right}
        </Box>
      </Grid>
      <Grid item xl={1}>
        &nbsp;
      </Grid>
    </Grid>
  );
};
export default Grid63Layout;
