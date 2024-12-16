import { CheckCircleOutline } from '@mui/icons-material';
import { DialogActions, Skeleton, Stack, Typography } from '@mui/material';
import { clientApiState } from 'atoms';
import { PangeaButton } from 'components/shared';
import { useLoading } from 'hooks';
import { PangeaCompany, PangeaUpdateRequestTypeEnum } from 'lib';
import { isError } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';

interface ForwardsSecondStepProps {
  mode: PangeaUpdateRequestTypeEnum; //'drawdown' | 'cashflow_details' | 'ndf' | 'risk_details';
  onClose: () => void;
}

const ForwardsSecondStep: React.FC<ForwardsSecondStepProps> = ({
  mode,
  onClose,
}) => {
  const authHelper = useRecoilValue(clientApiState);
  const [companyData, setCompanyData] = useState<PangeaCompany>();
  const { loadingPromise, loadingState } = useLoading();
  useEffect(() => {
    const getCompanyData = async () => {
      const api = authHelper.getAuthenticatedApiHelper();
      const comp = await api.getCompanyAsync();
      if (!comp || isError(comp)) {
        return;
      }
      setCompanyData(comp);
    };
    loadingPromise(getCompanyData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isLoading = loadingState.isLoading || !companyData;
  const serviceRep = `Your Client Services Representative, ${companyData?.rep.first_name} ${companyData?.rep.last_name} at ${companyData?.rep.email}`;
  const [title, titleDescription, contactInfo] = useMemo(() => {
    switch (mode) {
      case 'cashflow_details':
        return [
          'Request Sent',
          'Your Pangea advisor as been notified of this request. We will review this request and reach out to your primary contact within the next business day.',
          serviceRep,
        ];
      case 'ndf':
        return [
          'Updated',
          'The settlement account for this cash low has been updated.',
          '',
        ];
      default:
        return [
          'Request Sent',
          'Your Pangea advisor as been notified of this request. We will review this request and reach out to your primary contact within the next business day.',
          serviceRep,
        ];
    }
  }, [mode, serviceRep]);
  return (
    <Stack spacing={2} alignItems={'center'} maxWidth={500}>
      {isLoading ? (
        <Skeleton width={120} height={120} variant='circular' />
      ) : (
        <CheckCircleOutline sx={{ fontSize: '120px' }} color='success' />
      )}
      {isLoading ? (
        <Skeleton height={32} width={185} />
      ) : (
        <Typography component='h2' variant='h4' align='center'>
          {title}
        </Typography>
      )}
      {isLoading ? (
        <Skeleton width='100%' height={18} />
      ) : (
        <Typography
          variant='body2'
          color={PangeaColors.BlackSemiTransparent60}
          align='center'
        >
          {titleDescription}
        </Typography>
      )}
      {isLoading ? (
        <Skeleton width='100%' height={18} variant='rectangular' />
      ) : (
        <Typography
          variant='body2'
          color={PangeaColors.BlackSemiTransparent60}
          align='center'
        >
          {contactInfo}
        </Typography>
      )}
      <DialogActions>
        {isLoading ? (
          <Skeleton width={159} height={20} variant='rectangular' />
        ) : (
          <PangeaButton
            onClick={onClose}
            size='large'
            style={{ minWidth: 159 }}
          >
            GOT IT
          </PangeaButton>
        )}
      </DialogActions>
    </Stack>
  );
};

export default ForwardsSecondStep;
