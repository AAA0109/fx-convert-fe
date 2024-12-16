import { Box, Grid } from '@mui/material';
import type { ReactNode } from 'react';

interface GridPageProps {
  left: ReactNode;
  right: ReactNode;
  isTabPanel?: boolean;
  contentColumnCount?: number;
  panelColumnCount?: number;
}

export const GridTabPanel = ({
  left,
  right,
  isTabPanel = true,
  contentColumnCount = 6,
  panelColumnCount = 3,
}: GridPageProps) => {
  const totalColumns = contentColumnCount + panelColumnCount + 1; //1 is for gutter
  return (
    <Grid container direction={'row'} columns={totalColumns}>
      <Grid item xl={contentColumnCount} minWidth={0}>
        {left}
      </Grid>
      <Grid item xl={1}>
        &nbsp;
      </Grid>
      <Grid item xl={panelColumnCount}>
        {!isTabPanel ? (
          <Box top={264} position={'sticky'}>
            {right}
          </Box>
        ) : (
          <Box>{right}</Box>
        )}
      </Grid>
    </Grid>
  );
};
export default GridTabPanel;
