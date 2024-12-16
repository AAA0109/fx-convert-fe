import { DialogActions, Stack, TextField, Typography } from '@mui/material';
import { PangeaButton } from 'components/shared';
import React, { useMemo, useState } from 'react';
import { PangeaColors } from 'styles';
import EditSettlementDetailsContent from './EditSettlementDetailsContent/index';
import { PangeaUpdateRequestTypeEnum } from 'lib';

interface ForwardsFirstStepProps {
  mode: PangeaUpdateRequestTypeEnum; //'drawdown' | 'cashflow_details' | 'ndf' | 'risk_details';
  onChangeStep: (val: number, details: string) => void;
  onClose: () => void;
}

const ForwardsFirstStep: React.FC<ForwardsFirstStepProps> = ({
  mode,
  onChangeStep,
  onClose,
}) => {
  const [details, setDetails] = useState('');

  const [title, titleDescription, continueText, stepperContent] =
    useMemo(() => {
      switch (mode) {
        case 'cashflow_details':
          return [
            'Edit cash flow details?',
            'If you"d like to make changes to this cash flow, tell us about this request and confirm below by selecting “Submit Request” below. Your Pangea Advisor will reach out within 1 business day to review this adjustment and finalize the requested changes.',
            'SUBMIT REQUEST',
            <TextField
              key={mode}
              multiline
              rows={4}
              variant='filled'
              placeholder={'ABOUT THIS REQUEST'}
              onChange={(e) => setDetails(e.target.value)}
              value={details}
            />,
          ];
        case 'ndf':
          return [
            'Edit Settlement details',
            '',
            'SAVE',
            <EditSettlementDetailsContent key={mode} />,
          ];
        case 'risk_details':
          return [
            'Edit risk details?',
            'If you’d like to make changes to the risk details for this cash flow, tell us about this request and select “Submit Request” below. Your Pangea Advisor will reach out within 1 business day to review this adjustment and finalize the change for you.',
            'SUBMIT REQUEST',
            <TextField
              key={mode}
              multiline
              rows={4}
              variant='filled'
              placeholder={'ABOUT THIS REQUEST'}
              onChange={(e) => setDetails(e.target.value)}
              value={details}
            />,
          ];
        case 'drawdown':
          return [
            'Draw down early?',
            'If you’d like to drawdown early, tell us about this request and select “Submit Request” below. Your Pangea Advisor will reach out within 1 business day to review and finalize the change for you.',
            'SUBMIT REQUEST',
            <TextField
              key={mode}
              multiline
              rows={4}
              variant='filled'
              placeholder={'ABOUT THIS REQUEST'}
              onChange={(e) => setDetails(e.target.value)}
              value={details}
            />,
          ];
        default:
          return [
            'Edit cash flow details?',
            'If you"d like to make changes to this cash flow, tell us about this request and confirm below by selecting “Submit Request” below. Your Pangea Advisor will 1 business day to review this adjustment and finalize the requested changes.',
            'SUBMIT REQUEST',
            <TextField
              key={mode}
              multiline
              rows={4}
              variant='filled'
              placeholder={'ABOUT THIS REQUEST'}
              onChange={(e) => setDetails(e.target.value)}
              value={details}
            />,
          ];
      }
    }, [details, mode]);
  return (
    <Stack spacing={2}>
      <Typography component='h2' variant='h4' marginBottom={3}>
        {title}
      </Typography>
      <Typography variant='body1' color={PangeaColors.BlackSemiTransparent60}>
        {titleDescription}
      </Typography>
      {stepperContent}
      <DialogActions>
        <PangeaButton
          onClick={onClose}
          size='large'
          style={{ minWidth: 96 }}
          variant='outlined'
        >
          Cancel
        </PangeaButton>
        <PangeaButton
          onClick={() => onChangeStep(1, details)}
          size='large'
          style={{ minWidth: 159 }}
        >
          {continueText}
        </PangeaButton>
      </DialogActions>
    </Stack>
  );
};

export default ForwardsFirstStep;
