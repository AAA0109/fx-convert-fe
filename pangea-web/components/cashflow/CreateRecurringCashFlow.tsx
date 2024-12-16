import { AccessTimeFilled } from '@mui/icons-material';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  clientApiState,
  currenciesState,
  domesticCurrencyState,
  pangeaAlertNotificationMessageState,
} from 'atoms';
import { useAuthHelper, useCashflowHelpers, useFeatureFlags } from 'hooks';
import { Cashflow, CashflowEditMode, convertToDomesticAmount } from 'lib';
import Router from 'next/router';
import { MouseEvent, useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { PangeaColors } from 'styles';
import { StepperShell } from '../shared';
import { CreateHedgeCurrencyBlock } from './CreateHedgeCurrencyBlock';
import { CreateHedgeCurrencyPricingBlock } from './CreateHedgeCurrencyPricingBlock';
import { CreateHedgeNameBlock } from './CreateHedgeNameBlock';
import { CreateHedgeRecurringCashFlowToggle } from './CreateHedgeRecurringCashFlowToggle';
import { PaymentSummary } from './PaymentSummary';

export const CreateRecurringCashFlow = ({
  initialState,
  onChange,
  mode = 'create',
}: {
  initialState?: Cashflow;
  onChange?: (value: Cashflow) => void;
  mode?: CashflowEditMode;
}) => {
  const [cashflow, setCashflow] = useState<Optional<Cashflow>>(initialState);
  const { isFeatureEnabled } = useFeatureFlags();
  const currencies = useRecoilValue(currenciesState);
  const domesticCurrency = useRecoilValue(domesticCurrencyState);
  const isStrategyFeatureEnabled = isFeatureEnabled('corpay-forwards-strategy');
  const authHelper = useRecoilValue(clientApiState);
  const userAuthHelper = useAuthHelper();
  const [isValidForm, setIsValidForm] = useState(true);
  const [validStatus, setValidStatus] = useState(true);
  const { isHedgeItemValid } = useCashflowHelpers();
  const handleCashflowChange = useEventCallback((c: Cashflow) => {
    setCashflow(c);
    onChange?.(c);
  });
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const continueButtonHandler = async (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    if (!cashflow) {
      return;
    }
    if (!isHedgeItemValid(cashflow)) {
      return setIsValidForm(false);
    }
    const c = cashflow.clone();
    const rate = c.currency ? currencies[c.currency]?.rate : domesticCurrency;
    c.indicative_base_amount = parseFloat(
      convertToDomesticAmount(c.amount, rate),
    );
    c.indicative_cntr_amount = c.amount;
    c.indicative_rate = c.currency
      ? parseFloat(currencies[c.currency]?.rate)
      : 0 ?? 0;
    await c.saveAsync(authHelper);
    onChange?.(c);
    setPangeaAlertNotificationMessage({
      text: `Saving "${c.name}" draft...`,
      color: 'info',
      timeout: 3500,
      icon: <AccessTimeFilled />,
    });
    Router.push(
      (mode == 'create' ? '/cashflow/hedge' : '/manage/review') +
        `?draft_id=${c.id}`,
    );
  };
  const handleSecondaryButtonClick = async (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    if (!cashflow) {
      return;
    }
    if (!isHedgeItemValid(cashflow)) {
      return setIsValidForm(false);
    }
    const c = cashflow.clone();
    c.indicative_cntr_amount = c.amount;
    c.indicative_rate = c.currency
      ? parseFloat(currencies[c.currency]?.rate)
      : 0 ?? 0;
    await c.saveAsync(authHelper);
    onChange?.(c);
    Router.push(`/manage/hedge?draft_id=${c.id}`);
  };
  const hrefBack = useMemo(
    () =>
      mode === 'create'
        ? '/cashflow/details/direction'
        : `/manage/overview?cashflow_id=${cashflow?.cashflow_id}`,
    [cashflow, mode],
  );
  return (
    <form>
      <StepperShell
        backButtonHref={hrefBack}
        secondaryButtonVisible={mode === 'manage'}
        secondaryButtonText={
          isStrategyFeatureEnabled ? 'Choose a Strategy' : 'Choose a Portfolio'
        }
        title={
          mode === 'create'
            ? "Let's fill in the details"
            : 'Update your cash flow details'
        }
        titleDescription={
          mode === 'create'
            ? undefined
            : 'Some details, like currency, cannot be edited after cash flow creation.'
        }
        continueButtonText={
          mode === 'create'
            ? isStrategyFeatureEnabled
              ? 'Choose a Strategy'
              : 'Choose a Portfolio'
            : 'Review'
        }
        continueButtonProps={{ sx: { minWidth: 118 } }}
        sx={{
          '& .MuiFormHelperText-root': {
            color: PangeaColors.BlackSemiTransparent60,
          },
        }}
        onClickBackButton={() => cashflow && onChange?.(cashflow)}
        continueButtonEnabled={userAuthHelper.canTrade && validStatus}
        onClickContinueButton={continueButtonHandler}
        onClickSecondaryButton={handleSecondaryButtonClick}
      >
        <CreateHedgeNameBlock
          value={cashflow}
          onChange={(hI) => handleCashflowChange(hI.clone() as Cashflow)}
          isValidForm={isValidForm}
          mode={mode}
        />
        <CreateHedgeCurrencyBlock
          value={cashflow}
          onChange={(hI) => handleCashflowChange(hI.clone() as Cashflow)}
          isValidForm={isValidForm}
          mode={mode}
        />
        <CreateHedgeCurrencyPricingBlock
          value={cashflow}
          onChange={(hI) => handleCashflowChange(hI.clone() as Cashflow)}
          isValidForm={isValidForm}
          mode={mode}
        />
        <CreateHedgeRecurringCashFlowToggle
          value={cashflow}
          onChange={(hI) => handleCashflowChange(hI.clone() as Cashflow)}
          isValidForm={isValidForm}
          setValidStatus={setValidStatus}
          mode={mode}
        />
        <PaymentSummary value={cashflow} />
      </StepperShell>
    </form>
  );
};
export default CreateRecurringCashFlow;
