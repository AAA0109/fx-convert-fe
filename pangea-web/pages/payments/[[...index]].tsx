import ArrowBack from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import { clientApiState } from 'atoms';
import { TransactionOverview, TransactionSummary } from 'components/dashboard';
import { FeatureFlag, Grid63Layout, PangeaLoading } from 'components/shared';
import { useCacheableAsyncData } from 'hooks';
import { isError } from 'lodash';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useRecoilValue } from 'recoil';

const PaymentsIndex = () => {
  const router = useRouter();
  const api = useRecoilValue(clientApiState);
  const apiHelper = api.getAuthenticatedApiHelper();

  const { data, isLoading, refetchData } = useCacheableAsyncData(
    `transaction-${router.query.id ?? ''}`,
    async () => {
      if (router.query.id) {
        const res = await apiHelper.getTransactionByIdAsync(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          Number(router.query.id!),
        );
        return res;
      }
      return undefined;
    },
  );

  const handleOnApprove = useCallback(() => {
    refetchData();
  }, [refetchData]);

  if (isLoading) {
    return <PangeaLoading loadingPhrase={'Loading details...'} />;
  }
  if (isError(data) || !data) {
    return <PangeaLoading loadingPhrase={'Loading details...'} />;
  }
  return (
    <FeatureFlag name={['transactions']} fallback={<>Feature unavailable</>}>
      <Grid63Layout
        fixed
        titleRowNode={
          <Button
            variant='outlined'
            startIcon={<ArrowBack />}
            onClick={() => router.push('/dashboard/transactions')}
          >
            Back
          </Button>
        }
        left={
          <TransactionOverview data={data} onApproverChange={handleOnApprove} />
        }
        right={<TransactionSummary data={data} />}
      />
    </FeatureFlag>
  );
};

export default PaymentsIndex;
