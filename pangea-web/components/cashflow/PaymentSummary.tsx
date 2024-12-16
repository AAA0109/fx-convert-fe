import { Divider, Stack, Typography } from '@mui/material';
import { domesticCurrencyState, exchangeRatesState } from 'atoms';
import {
  Cashflow,
  HedgeItemComponentProps,
  Installment,
  convertToDomesticAmount,
  formatCurrency,
} from 'lib';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';

const SummaryDetail = ({
  label,
  value,
}: {
  label: NullableString;
  value: NullableString;
}) => {
  return (
    <Stack direction='column'>
      <Typography
        component='div'
        variant='body2'
        color={PangeaColors.BlackSemiTransparent60}
      >
        {label}:
      </Typography>
      <Typography component='div' variant='inputText'>
        {value}
      </Typography>
    </Stack>
  );
};
export const PaymentSummary = (props: HedgeItemComponentProps) => {
  const hedgeItemTypeSuffix =
    props.value && props.value.type == 'installments'
      ? 'installments'
      : 'recurring cash flow';
  const exchangeRate = useRecoilValue(
    exchangeRatesState(props.value?.currency),
  );
  const domesticCurrency = useRecoilValue(domesticCurrencyState);
  const labelDomestic =
    props.value && props.value.direction == 'receiving'
      ? 'Amount receiving'
      : 'Amount paying';
  const labelForeign =
    props.value && props.value.direction == 'receiving'
      ? 'Recipient pays'
      : 'Recipient gets';
  const foreignAmount = formatCurrency(
    props.value?.totalAmount ?? 0,
    props.value?.currency ?? 'USD',
    true,
    0,
    0,
    false,
  );
  const domesticAmount = formatCurrency(
    convertToDomesticAmount(props.value?.totalAmount ?? 0, exchangeRate),
    domesticCurrency,
    true,
    0,
    0,
    false,
  );
  const numberOfPayments = !props.value
    ? 0
    : props.value.type == 'installments'
    ? (props.value as Installment).cashflows.length
    : (props.value as Cashflow).getRrule()?.all().length ?? 0;
  const duration = !props.value
    ? 'Single payment'
    : props.value.type == 'installments'
    ? (props.value as Installment).duration
    : (props.value as Cashflow).duration;
  return (
    <Stack direction='column' spacing={2}>
      <Typography variant='body1'> Summary of {hedgeItemTypeSuffix}</Typography>
      <Stack
        direction='row'
        divider={
          <Divider sx={{ borderColor: PangeaColors.BlackSemiTransparent12 }} />
        }
        spacing={1}
      >
        <Stack direction='column' spacing={2} width='50%'>
          <SummaryDetail
            label={labelDomestic}
            value={`${domesticAmount} ${'USD'}`}
          />
          <SummaryDetail
            label={labelForeign}
            value={`${foreignAmount} ${props.value?.currency ?? ''}`}
          />
        </Stack>
        <Stack direction='column' spacing={2}>
          <SummaryDetail label='Duration' value={duration} />
          <SummaryDetail label='Payments' value={numberOfPayments.toString()} />
        </Stack>
      </Stack>
    </Stack>
  );
};
export default PaymentSummary;
