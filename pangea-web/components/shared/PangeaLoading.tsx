import { Backdrop, Box, Container, Stack, Typography } from '@mui/material';
import { ResponsiveStyleValue } from '@mui/system';
import { isString } from 'lodash';
import { ReactNode } from 'react';
import { PangeaColors } from 'styles';
import { PangeaSpinner } from './PangeaSpinner';

export const PangeaLoading = ({
  loadingPhrase,
  useBackdrop = false,
  direction = 'row',
  centerPhrase = false,
}: {
  loadingPhrase?: NullableString[] | NullableString;
  useBackdrop?: boolean;
  direction?:
    | ResponsiveStyleValue<'row' | 'row-reverse' | 'column' | 'column-reverse'>
    | undefined;
  centerPhrase?: boolean;
}) => {
  const RootContainer = ({ children }: { children: ReactNode }) => {
    return useBackdrop ? (
      <Backdrop
        sx={{
          backdropFilter: 'blur(2px)',
          backgroundColor: PangeaColors.StoryWhiteLighterSemiTransparent87,
          color: PangeaColors.BlackSemiTransparent87,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={true}
      >
        {children}
      </Backdrop>
    ) : (
      <>{children}</>
    );
  };
  const phrases =
    loadingPhrase && loadingPhrase instanceof Array
      ? loadingPhrase
      : isString(loadingPhrase)
      ? [loadingPhrase]
      : [];
  return (
    <RootContainer>
      <Container
        sx={{
          flexGrow: 1,
          width: '100%',
          ...(centerPhrase
            ? { display: 'flex', justifyContent: 'center' }
            : {}),
        }}
        maxWidth={false}
        className='pangea-loading'
      >
        <Stack
          direction={direction}
          spacing={4}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Box width={50} height={50}>
            <PangeaSpinner />
          </Box>

          {phrases && phrases.length > 0
            ? phrases.map((phrase) => (
                <Typography variant='heroBody' key={phrase}>
                  {phrase}
                </Typography>
              ))
            : null}
        </Stack>
      </Container>
    </RootContainer>
  );
};
export default PangeaLoading;
