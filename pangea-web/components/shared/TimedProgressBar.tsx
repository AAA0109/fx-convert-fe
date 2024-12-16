import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { PangeaColors } from 'styles';
export const TimedProgressBar = ({
  maxSeconds = 60,
  caption,
}: {
  maxSeconds: number;
  caption?: string;
}) => {
  const [progress, setProgress] = useState(0);
  const normalize = (value: number) => (value * 100) / maxSeconds;
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === maxSeconds) {
          return 0;
        }

        return Math.min(oldProgress + 1, maxSeconds);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, [maxSeconds]);

  return (
    <Box sx={{ width: '100%' }} bgcolor={PangeaColors.OpenBillLight}>
      <Stack direction='column' spacing={1} p={2}>
        <LinearProgress variant='determinate' value={normalize(progress)} />
        <Typography variant='small' textAlign='center'>
          {caption}
        </Typography>
      </Stack>
    </Box>
  );
};
export default TimedProgressBar;
