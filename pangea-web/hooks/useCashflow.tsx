import { isLoggedInState } from 'atoms';
import { NumberOrUndefined } from 'lib';
import { isUndefined } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useCashflowHelpers, useFeatureFlags } from '.';
import useNewRelicLogger from './useLogger';

interface QueryCashflowIds {
  cashflow_id?: number;
  draft_id?: number;
  installment_id?: number;
}
interface UseCashflowProps {
  id?: QueryCashflowIds;
  useRouter?: boolean;
  force?: boolean;
  loadDraftIfAvailable?: boolean;
}
export const useCashflow = (props: UseCashflowProps) => {
  if (!props.id && !props.useRouter) {
    throw 'useCashflow must have either id or useRouter';
  }
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const router = useRouter();
  const [loadingAttempted, setLoadingAttempted] = useState(false);
  const { cashflow_id, draft_id, installment_id } = router.query;
  const newRelicLogger = useNewRelicLogger();
  const routerIds: Optional<QueryCashflowIds> = useMemo(
    () =>
      isUndefined(cashflow_id) &&
      isUndefined(draft_id) &&
      isUndefined(installment_id)
        ? undefined
        : {
            cashflow_id: NumberOrUndefined(cashflow_id),
            draft_id: NumberOrUndefined(draft_id),
            installment_id: NumberOrUndefined(installment_id),
          },
    [cashflow_id, draft_id, installment_id],
  );

  // Prefer the ids that are passed in directly
  const id = useMemo(
    () => (isUndefined(props.id) ? routerIds : props.id),
    [props.id, routerIds],
  );
  const hedgeId = !isUndefined(id)
    ? Number(id.cashflow_id ?? id.installment_id ?? id.draft_id ?? 0)
    : 0;
  const [loadedHedgeId, setLoadedHedgeId] = useState(0);
  const {
    loadFromExistingCashflowToStateAsync,
    loadFromExistingDraftToStateAsync,
    loadFromExistingInstallmentToStateAsync,
  } = useCashflowHelpers();
  const { isFeatureEnabled } = useFeatureFlags();
  const shouldDisableRedirect = isFeatureEnabled('disable-error-redirects');
  useEffect(() => {
    (async () => {
      if (!id || !isLoggedIn) {
        setLoadingAttempted(true);
        return;
      }
      let hedgeItemLoaded = false;
      if (id.cashflow_id) {
        hedgeItemLoaded = await loadFromExistingCashflowToStateAsync(
          Number(id.cashflow_id),
          props.force,
          props.loadDraftIfAvailable,
        );
      } else if (id.installment_id) {
        hedgeItemLoaded = await loadFromExistingInstallmentToStateAsync(
          Number(id.installment_id),
          props.force,
          props.loadDraftIfAvailable,
        );
      } else if (id.draft_id) {
        hedgeItemLoaded = await loadFromExistingDraftToStateAsync(
          Number(id.draft_id),
        );
      }
      if (!hedgeItemLoaded) {
        if (shouldDisableRedirect) {
          newRelicLogger({
            customName: 'useCashflow',
            message: 'hedgeItem Not Loaded',
          });
          return;
        } else {
          router.push('/404');
        }
      }
      setLoadingAttempted(true);
      setLoadedHedgeId(hedgeId);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hedgeId,
    setLoadedHedgeId,
    loadFromExistingCashflowToStateAsync,
    loadFromExistingDraftToStateAsync,
    loadFromExistingInstallmentToStateAsync,
    isLoggedIn,
    setLoadingAttempted,
    props.loadDraftIfAvailable,
    props.force,
    router,
  ]);
  return {
    isLoaded: loadingAttempted && loadedHedgeId === hedgeId,
    qs:
      router.isReady && router.asPath.indexOf('?') > 0
        ? router.asPath.substring(router.asPath.indexOf('?') + 1)
        : '',
  };
};
