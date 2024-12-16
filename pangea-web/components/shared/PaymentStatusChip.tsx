import { Chip, SxProps } from '@mui/material';
import { PangeaPaymentStatusEnum, setAlpha } from 'lib';
import { memo } from 'react';
import { PangeaColors } from 'styles';

function statusToColorMapper(status: PangeaPaymentStatusEnum): SxProps {
  switch (status) {
    case PangeaPaymentStatusEnum.Booked:
      return {
        backgroundColor: PangeaColors.SecurityGreenMedium,
        color: PangeaColors.White,
      };
    case PangeaPaymentStatusEnum.AwaitingFunds:
    case PangeaPaymentStatusEnum.PendAuth:
    case PangeaPaymentStatusEnum.PendingApproval:
      return {
        backgroundColor: PangeaColors.CautionYellowMedium,
        color: PangeaColors.White,
      };
    case PangeaPaymentStatusEnum.InTransit:
      return { backgroundColor: '#42A5F5', color: PangeaColors.White };
    case PangeaPaymentStatusEnum.Delivered:
      return {
        backgroundColor: PangeaColors.SolidSlateMedium,
        color: PangeaColors.White,
      };
    case PangeaPaymentStatusEnum.Canceled:
    case PangeaPaymentStatusEnum.Failed:
      return {
        backgroundColor: PangeaColors.RiskBerryMedium,
        color: PangeaColors.White,
      };
    case PangeaPaymentStatusEnum.Working:
      return {
        backgroundColor: PangeaColors.EarthBlueMedium,
        color: PangeaColors.White,
      };
    case PangeaPaymentStatusEnum.Scheduled:
    case PangeaPaymentStatusEnum.Drafting:
    default:
      return {
        backgroundColor: setAlpha('#000', 0.08),
        color: setAlpha('#000', 0.87),
      };
  }
}

export const PaymentStatusChip = memo(function PaymentStatusChip({
  status,
}: {
  status: PangeaPaymentStatusEnum;
}) {
  const colorProps = statusToColorMapper(status);
  return (
    <Chip
      label={status.split('_').join(' ')}
      size='small'
      sx={{
        borderRadius: '1rem',
        textTransform: 'capitalize',
        fontWeight: 400,
        fontSize: '0.8125rem',
        lineHeight: '1.125rem',
        ...colorProps,
      }}
    />
  );
});

export default PaymentStatusChip;
