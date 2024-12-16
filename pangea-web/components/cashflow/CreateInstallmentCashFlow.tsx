import { AccessTimeFilled } from '@mui/icons-material';
import useEventCallback from '@mui/utils/useEventCallback';
import { clientApiState, currenciesState, domesticCurrencyState } from 'atoms';
import { useAuthHelper, useCashflowHelpers, useFeatureFlags } from 'hooks';
import { CashflowEditMode, Installment, convertToDomesticAmount } from 'lib';
import Router from 'next/router';
import { MouseEvent, useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { PangeaColors } from 'styles';
import { pangeaAlertNotificationMessageState } from '../../atoms/globalstate';
import { StepperShell } from '../shared';
import { CreateHedgeCurrencyBlock } from './CreateHedgeCurrencyBlock';
import { CreateHedgeInstallmentsTableBlock } from './CreateHedgeInstallmentsTableBlock';
import { CreateHedgeNameBlock } from './CreateHedgeNameBlock';
import { PaymentSummary } from './PaymentSummary';

export const CreateInstallmentCashFlow = ({
  initialState,
  onChange,
  mode = 'create',
}: {
  initialState?: Installment;
  onChange?: (value: Installment) => void;
  mode?: CashflowEditMode;
}) => {
  const userAuthHelper = useAuthHelper();
  const currencies = useRecoilValue(currenciesState);
  const domesticCurrency = useRecoilValue(domesticCurrencyState);
  const [installment, setInstallment] = useState<Installment>(
    initialState ?? new Installment(),
  );
  const { isHedgeItemValid } = useCashflowHelpers();
  const { isFeatureEnabled } = useFeatureFlags();
  const isStrategyFeatureEnabled = isFeatureEnabled('corpay-forwards-strategy');
  const authHelper = useRecoilValue(clientApiState);
  const [isValidForm, setIsValidForm] = useState(true);
  const handleInstallmentChange = useEventCallback((i: Installment) => {
    setInstallment(i);
    onChange?.(i);
  });
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const continueButtonHandler = async (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    if (!isHedgeItemValid(installment)) {
      return setIsValidForm(false);
    }
    if (!installment) {
      return;
    }
    const i = installment.clone();
    const rate = i.currency ? currencies[i.currency]?.rate : domesticCurrency;
    i.indicative_base_amount = parseFloat(
      convertToDomesticAmount(i.amount, rate),
    );
    i.indicative_cntr_amount = i.amount;
    i.indicative_rate = i.currency
      ? parseFloat(currencies[i.currency]?.rate)
      : 0 ?? 0;
    await i.saveAsync(authHelper).finally(() => {
      setPangeaAlertNotificationMessage({
        text: `Saving "${i.name}" draft...`,
        color: 'info',
        timeout: 3500,
        icon: <AccessTimeFilled />,
      });
    });
    onChange?.(i);
    Router.push(
      (mode == 'create' ? '/cashflow/hedge' : '/manage/review') +
        `?installment_id=${i.installment_id}`,
    );
  };
  const handleSecondaryButtonClick = async (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    if (!installment) {
      return;
    }
    if (!isHedgeItemValid(installment)) {
      return setIsValidForm(false);
    }
    const i = installment.clone();
    i.indicative_cntr_amount = i.amount;
    i.indicative_rate = i.currency
      ? parseFloat(currencies[i.currency]?.rate)
      : 0 ?? 0;
    await i.saveAsync(authHelper);
    onChange?.(i);
    Router.push(`/manage/hedge?installment_id=${i.installment_id}`);
  };
  const hrefBack = useMemo(
    () =>
      mode === 'create'
        ? '/cashflow/details/direction'
        : `/manage/overview?installment_id=${installment?.installment_id}`,
    [installment, mode],
  );
  return (
    <StepperShell
      backButtonHref={hrefBack}
      title={
        mode === 'create'
          ? "Let's fill in the details"
          : 'Update your cash flow details'
      }
      titleDescription={
        mode === 'create'
          ? undefined
          : 'Some details, like currency and past installments, cannot be edited after cash flow creation.'
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
      onClickContinueButton={continueButtonHandler}
      onClickBackButton={() => onChange?.(installment)}
      continueButtonEnabled={userAuthHelper.canTrade}
      secondaryButtonVisible={mode === 'manage'}
      secondaryButtonText={
        isStrategyFeatureEnabled ? 'Choose a Strategy' : 'Choose a Portfolio'
      }
      onClickSecondaryButton={handleSecondaryButtonClick}
    >
      <CreateHedgeNameBlock
        value={installment}
        onChange={(hI) => handleInstallmentChange(hI.clone() as Installment)}
        isValidForm={isValidForm}
      />
      <CreateHedgeCurrencyBlock
        value={installment}
        onChange={(hI) => handleInstallmentChange(hI.clone() as Installment)}
        isValidForm={isValidForm}
        mode={mode}
      />
      <CreateHedgeInstallmentsTableBlock
        value={installment}
        onChange={(hI) => handleInstallmentChange(hI.clone() as Installment)}
        isValidForm={isValidForm}
      />

      <PaymentSummary value={installment} />
    </StepperShell>
  );
};
export default CreateInstallmentCashFlow;
