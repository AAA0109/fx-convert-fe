import { activeHedgeState } from 'atoms';
import { useCashflow } from 'hooks';
import { Cashflow, Installment } from 'lib';
import { Suspense } from 'react';
import { useRecoilState } from 'recoil';
import { PangeaLoading } from '../shared';
import { CreateInstallmentCashFlow } from './CreateInstallmentCashFlow';
import { CreateOneTimeCashFlow } from './CreateOneTimeCashFlow';
import { CreateRecurringCashFlow } from './CreateRecurringCashFlow';

export const CashflowDetailsStep = ({
  pageToDisplay,
  mode = 'create',
}: {
  pageToDisplay: string;
  mode?: 'create' | 'manage';
}) => {
  const { isLoaded } = useCashflow({
    useRouter: true,
    loadDraftIfAvailable: true,
    force: true,
  });
  const [activeHedge, setHedge] = useRecoilState(activeHedgeState);
  if (!isLoaded) {
    return <PangeaLoading loadingPhrase={'Loading Cash Flow...'} />;
  }

  switch (pageToDisplay) {
    case 'onetime':
      return (
        <Suspense>
          <CreateOneTimeCashFlow
            initialState={activeHedge as Cashflow}
            onChange={setHedge}
            mode={mode}
          />
        </Suspense>
      );
    case 'recurring':
      return (
        <Suspense>
          <CreateRecurringCashFlow
            initialState={activeHedge as Cashflow}
            onChange={setHedge}
            mode={mode}
          />
        </Suspense>
      );
    case 'installments':
      return (
        <Suspense>
          <CreateInstallmentCashFlow
            initialState={activeHedge as Installment}
            onChange={setHedge}
            mode={mode}
          />
        </Suspense>
      );
    default:
      return <></>;
  }
};
export default CashflowDetailsStep;
