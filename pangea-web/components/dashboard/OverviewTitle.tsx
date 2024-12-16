import { ArrowBack } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import { activeHedgeState } from 'atoms';
import { PangeaPageTitle } from 'components/shared';
import { ensureArray, getHedgeItemsProperty } from 'lib';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';

export const OverviewTitle = (): JSX.Element => {
  const router = useRouter();
  const activeHedge = useRecoilValue(activeHedgeState);
  const title = getHedgeItemsProperty(
    ensureArray(activeHedge),
    'name',
  ) as string;
  return (
    <Stack>
      <Button
        startIcon={<ArrowBack />}
        variant='outlined'
        sx={{ width: 'fit-content' }}
        onClick={() => router.push('/dashboard')}
      >
        Back
      </Button>
      <PangeaPageTitle
        title={title}
        variant='h4'
        pageTitleOverride='Your Cashflow'
        color={PangeaColors.BlackSemiTransparent87}
      />
    </Stack>
  );
};

export default OverviewTitle;
