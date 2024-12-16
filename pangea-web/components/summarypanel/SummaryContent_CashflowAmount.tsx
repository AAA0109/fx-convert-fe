import { Grid, Typography } from '@mui/material';
import { currenciesState, domesticCurrencyState } from 'atoms';
import {
  Cashflow,
  Installment,
  SummaryItemProps,
  convertToDomesticAmount,
  ensureArray,
  formatCurrency,
  standardizeDate,
} from 'lib';
import { isUndefined } from 'lodash';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { AccordionContentBlock } from './AccordionContentBlock';

export const SummaryContent_CashflowAmount = ({
  value,
  mode,
  original_value,
  isChanged,
  accordionContentBlockProps,
}: SummaryItemProps) => {
  const [payingAmount, setPayingAmount] = useState(0);
  const [receivingAmount, setReceivingAmount] = useState(0);
  const currencies = useRecoilValue(currenciesState);
  const domesticCurrency = useRecoilValue(domesticCurrencyState);
  const hedgeItems = ensureArray(original_value ?? value);
  if (
    mode === 'manage' &&
    isUndefined(isChanged) &&
    !isUndefined(original_value)
  ) {
    if ((value as Cashflow).id > 0) {
      const currentVal =
        (value as Cashflow).booked_cntr_amount ??
        (value as Cashflow).indicative_cntr_amount ??
        ensureArray(value)[0]?.amount ??
        0;
      const origVal =
        (original_value as Cashflow).booked_cntr_amount ??
        (original_value as Cashflow).indicative_cntr_amount ??
        ensureArray(original_value)[0].amount;
      isChanged = currentVal != origVal;
    }
  }
  useEffect(() => {
    if (!value) {
      return;
    }
    if (hedgeItems.length == 0) {
      return;
    }

    const paying = hedgeItems
      .filter((hI) => hI?.direction == 'paying')
      .reduce((sum, hI) => {
        const curr = hI?.currency ?? domesticCurrency;
        const rate = currencies[curr]?.rate ?? '0';
        return (
          sum +
          parseFloat(
            (hI as Cashflow)?.booked_base_amount?.toString() ??
              (hI as Cashflow)?.indicative_base_amount?.toString() ??
              convertToDomesticAmount(hI?.totalAmount ?? 0, rate),
          )
        );
      }, 0);
    const receiving = hedgeItems
      .filter((hI) => hI?.direction == 'receiving')
      .reduce((sum, hI) => {
        const curr = hI?.currency ?? domesticCurrency;
        const rate = currencies[curr]?.rate ?? '0';
        return (
          sum +
          parseFloat(
            (hI as Cashflow)?.booked_base_amount?.toString() ??
              (hI as Cashflow)?.indicative_base_amount?.toString() ??
              convertToDomesticAmount(hI?.totalAmount ?? 0, rate),
          )
        );
      }, 0);
    setPayingAmount(paying);
    setReceivingAmount(receiving);
  }, [value, currencies, hedgeItems, domesticCurrency]);

  const totalAmountDisplay = formatCurrency(
    payingAmount + receivingAmount,
    domesticCurrency,
    true,
    0,
    0,
  );
  const showPayingReceiving = payingAmount > 0 && receivingAmount > 0;
  const isInstallment =
    hedgeItems.length == 1 && hedgeItems[0]?.type == 'installments';
  const isRecurring =
    hedgeItems.length == 1 && hedgeItems[0]?.type == 'recurring';
  let paymentsRemainingDisplay,
    paymentAmountDisplay,
    remainingAmountDisplay = '';
  const curr = hedgeItems[0]?.currency ?? 'USD';
  const rate = currencies[curr]?.rate ?? '0';
  if (isInstallment) {
    const i = hedgeItems[0] as Installment;
    const futurePayments = i.cashflows.filter(
      (c) => c.date >= standardizeDate(new Date()),
    );
    paymentsRemainingDisplay = `${futurePayments.length}/${i.cashflows.length}`;
    remainingAmountDisplay = formatCurrency(
      futurePayments.reduce(
        (sum, c) =>
          sum +
          parseFloat(
            (c as Cashflow)?.booked_base_amount?.toString() ??
              (c as Cashflow)?.indicative_base_amount?.toString() ??
              convertToDomesticAmount(c.amount, rate),
          ),
        0,
      ),
      domesticCurrency,
      true,
      0,
      0,
    );
  } else if (isRecurring) {
    const c = hedgeItems[0] as Cashflow;
    const allOccurrences = c.getRrule()?.all();
    const numRemaining =
      allOccurrences?.filter(
        (o) => o.getTime() > standardizeDate(new Date()).getTime(),
      ).length ?? 0;

    const paymentAmountDomestic = parseFloat(
      (c as Cashflow)?.booked_base_amount?.toString() ??
        (c as Cashflow)?.indicative_base_amount?.toString() ??
        convertToDomesticAmount(c.amount, rate),
    );
    paymentsRemainingDisplay = `${numRemaining}/${allOccurrences?.length ?? 0}`;
    remainingAmountDisplay = formatCurrency(
      numRemaining * paymentAmountDomestic,
      domesticCurrency,
      true,
      0,
      0,
    );
    paymentAmountDisplay = formatCurrency(
      paymentAmountDomestic,
      domesticCurrency,
      true,
      0,
      0,
    );
  }
  return (
    <AccordionContentBlock
      isChanged={isChanged}
      label={
        payingAmount > 0
          ? receivingAmount > 0
            ? 'Total'
            : 'Total (USD)'
          : receivingAmount > 0
          ? 'Receiving'
          : 'Total'
      }
      expanded={accordionContentBlockProps?.expanded}
    >
      <Typography variant='h5' component='span'>
        {totalAmountDisplay}
      </Typography>
      {showPayingReceiving ? (
        <>
          <AccordionContentBlock
            label='Paying'
            isChanged={isChanged}
            {...accordionContentBlockProps}
          >
            {formatCurrency(payingAmount, domesticCurrency, true, 0, 0)}
          </AccordionContentBlock>
          <AccordionContentBlock
            label='Receiving'
            isChanged={isChanged}
            {...accordionContentBlockProps}
          >
            {formatCurrency(receivingAmount, domesticCurrency, true, 0, 0)}
          </AccordionContentBlock>
        </>
      ) : (
        <>
          {isRecurring ? (
            <AccordionContentBlock
              label='Payment Amount (USD)'
              isChanged={isChanged}
              {...accordionContentBlockProps}
            >
              {paymentAmountDisplay}
            </AccordionContentBlock>
          ) : null}
          {isRecurring || isInstallment ? (
            <Grid item xl={12}>
              <AccordionContentBlock
                label='Payments Remaining'
                isChanged={isChanged}
                {...accordionContentBlockProps}
              >
                {paymentsRemainingDisplay}
              </AccordionContentBlock>
              <AccordionContentBlock
                label='Remaining (USD)'
                isChanged={isChanged}
                {...accordionContentBlockProps}
              >
                {remainingAmountDisplay}
              </AccordionContentBlock>
            </Grid>
          ) : null}
        </>
      )}
    </AccordionContentBlock>
  );
};
export default SummaryContent_CashflowAmount;
