import { SxProps, Chip } from '@mui/material';
import { PangeaBeneficiaryStatusEnum, setAlpha } from 'lib';
import { memo } from 'react';
import { PangeaColors } from 'styles';

function statusToColorMapper(status: PangeaBeneficiaryStatusEnum): SxProps {
  switch (status) {
    case PangeaBeneficiaryStatusEnum.Approved:
      return {
        backgroundColor: PangeaColors.SecurityGreenMedium,
        color: PangeaColors.White,
      };
    case PangeaBeneficiaryStatusEnum.Pending:
    case PangeaBeneficiaryStatusEnum.PendingDelete:
    case PangeaBeneficiaryStatusEnum.PendingUpdate:
      return {
        backgroundColor: PangeaColors.CautionYellowMedium,
        color: PangeaColors.White,
      };
    case PangeaBeneficiaryStatusEnum.Draft:
      return {
        backgroundColor: PangeaColors.SolidSlateMedium,
        color: PangeaColors.White,
      };
    case PangeaBeneficiaryStatusEnum.Deleted:
      return {
        backgroundColor: PangeaColors.RiskBerryMedium,
        color: PangeaColors.White,
      };
    case PangeaBeneficiaryStatusEnum.Synced:
      return {
        backgroundColor: PangeaColors.EarthBlueMedium,
        color: PangeaColors.White,
      };
    default:
      return {
        backgroundColor: setAlpha('#000', 0.08),
        color: setAlpha('#000', 0.87),
      };
  }
}

export const BeneficiaryStatusChip = memo(function BeneficiaryStatusChip({
  status,
}: {
  status: PangeaBeneficiaryStatusEnum;
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

export default BeneficiaryStatusChip;
