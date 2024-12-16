import { currenciesState, domesticCurrencyState } from 'atoms';
import {
  Cashflow,
  SummaryItemProps,
  convertToDomesticAmount,
  ensureArray,
  formatCurrency,
} from 'lib';
import { useRecoilValue } from 'recoil';
import { AccordionContentBlock } from './AccordionContentBlock';

export const SummaryContent_CashflowAmountUSD = ({
  value,
  isChanged,
  accordionContentBlockProps,
}: SummaryItemProps) => {
  const hedgeItems = ensureArray(value);
  const currencies = useRecoilValue(currenciesState);
  const domesticCurrency = useRecoilValue(domesticCurrencyState);
  let paymentAmountDisplay;
  const curr = hedgeItems[0]?.currency ?? domesticCurrency;
  const rate = currencies[curr]?.rate ?? '0';
  const isInstallment =
    hedgeItems.length == 1 && hedgeItems[0]?.type == 'installments';
  const isRecurring =
    hedgeItems.length == 1 && hedgeItems[0]?.type == 'recurring';
  if (!isInstallment && isRecurring) {
    const c = hedgeItems[0] as Cashflow;
    const paymentAmountDomestic =
      c.booked_base_amount ??
      c.indicative_base_amount ??
      parseFloat(convertToDomesticAmount(c.amount, rate));
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
      label={'Amount (USD)'}
      expanded={accordionContentBlockProps?.expanded}
      labelRight={paymentAmountDisplay}
    ></AccordionContentBlock>
  );
};
export default SummaryContent_CashflowAmountUSD;
