import CheckCircle from '@mui/icons-material/CheckCircle';
import { Box, Stack, SxProps, Typography } from '@mui/material';
import {
  activeHedgeState,
  allAccountsState,
  autoPilotFeesDetailsState,
  bulkUploadItemsState,
  clientApiState,
  currenciesState,
  currentAutopilotHedgeItem,
  currentForwardHedgeItem,
  currentParachuteHedgeItem,
  dialogDontShowState,
  dialogUnsavedChangesControlState,
  domesticCurrencyState,
  graphHoverDataState,
  hedgeLosspreventionLimitState,
  hedgeLosspreventionTargetState,
  hedgeMaxLossThresholdState,
  hedgeRiskReductionAmountState,
  hedgeSafeGuardState,
  hedgeSafeGuardTargetState,
  marginFeeDataLoadingState,
  pangeaAlertNotificationMessageState,
  savedPortfolioDetailsState,
  selectedAccountIdState,
  selectedAccountState,
  selectedHedgeStrategy,
  shouldShowFeesState,
} from 'atoms';
import PangeaSimpleDialog from 'components/modals/PangeaSimpleDialog';
import {
  useCashflow,
  useCashflowHelpers,
  useFeatureFlags,
  useLoading,
} from 'hooks';
import useChartData from 'hooks/useChartData';
import {
  AnyHedgeItem,
  Cashflow,
  CashflowEditMode,
  CashflowStrategyEnum,
  Installment,
  PangeaAutopilotData,
  PangeaAutopilotDataRequest,
  PangeaInstructDealRequestDeliveryMethodEnum,
  PangeaDraftFxForward,
  PangeaParachuteDataRequest,
  convertToDomesticAmount,
} from 'lib';
import { isError, isNumber, isUndefined } from 'lodash';
import { useRouter } from 'next/router';
import { Suspense, useEffect, useMemo, useState } from 'react';
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import { PangeaColors } from 'styles';
import { v4 } from 'uuid';
import {
  FeatureFlag,
  PangeaLoading,
  StepperShell,
  TypographyLoader,
} from '../shared';
import { AutoPilotDetails } from './AutoPilotDetails';
import { CurrencyChartYourHedge } from './CurrencyChartYourHedge';
import { CurrencyChartYourRisk } from './CurrencyChartYourRisk';
import DialogUnsavedChangesControl from './DialogUnsavedChangesControl';
import { DialogYourHedgeRiskControls } from './DialogYourHedgeRiskControls';
import ParachuteDetails from './ParachuteDetails';
import { PortfolioPicker } from './PortfolioPicker';
import { RiskTable } from './RiskTable';
import { StrategyPicker } from './StrategyPicker';
import { ZeroGravityDetails } from './ZeroGravityDetails';
const CORPAY_FW_FF_NAME = 'corpay-forwards-strategy';
const skeletonStyles: SxProps = {
  display: 'inline-block',
  height: '25px',
  lineHeight: '25px',
};
export const ChooseAPortfolioLeft = ({
  mode = 'create',
}: {
  mode?: CashflowEditMode;
}) => {
  const router = useRouter();
  const { loadingState: loadingForwardState } = useLoading();
  const { isLoaded } = useCashflow({
    useRouter: true,
    loadDraftIfAvailable: true,
  });

  const { loadingPromise, loadingState } = useLoading();
  const dontShowDialog = useRecoilValue(
    dialogDontShowState('your-hedge-risk-controls'),
  );
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const bulkHedgeItems = useRecoilValue(bulkUploadItemsState);

  const accountsState = useRecoilValue(allAccountsState);
  const currencies = useRecoilValue(currenciesState);
  const domesticCurrency = useRecoilValue(domesticCurrencyState);
  const resetSelectedHedgeStrategy = useResetRecoilState(selectedHedgeStrategy);
  const { saveBulkUploadHedgeItemsAsync, deleteDraftAsync } =
    useCashflowHelpers();
  const setAccountId = useSetRecoilState(selectedAccountIdState);
  const setShouldShowFeesState = useSetRecoilState(shouldShowFeesState);
  const [selectedHedgeItem, setSelectedHedgeItem] = useRecoilState(
    currentForwardHedgeItem,
  );
  const [parachuteHedgeItem, setParachuteHedgeItem] = useRecoilState(
    currentParachuteHedgeItem,
  );
  const [autopilotHedgeItem, setAutopilotHedgeItem] = useRecoilState(
    currentAutopilotHedgeItem,
  );
  const setActiveHedgeItem = useSetRecoilState(activeHedgeState);
  const setAutoPilotFees = useSetRecoilState(autoPilotFeesDetailsState);

  const [selectedStrategy, setSelectedStrategy] = useRecoilState(
    selectedHedgeStrategy,
  );
  const authHelper = useRecoilValue(clientApiState);
  const [selectedAccountId, setSelectedAccountId] = useState<Optional<number>>(
    bulkHedgeItems.length > 0 ? bulkHedgeItems[0].accountId : undefined,
  );
  const [riskReductionState, setRiskReductionState] = useRecoilState(
    hedgeRiskReductionAmountState,
  );
  const [maxLossState, setMaxLossState] = useRecoilState(
    hedgeMaxLossThresholdState,
  );
  const safeGuard = useRecoilValue(hedgeSafeGuardState);
  const [lossPrevention, setLossPrevention] = useRecoilState(
    hedgeLosspreventionLimitState,
  );
  const [safeGuardTaget, setSafeGuardTaget] = useRecoilState(
    hedgeSafeGuardTargetState,
  );
  const [lossPreventionTaget, setLossPreventionTaget] = useRecoilState(
    hedgeLosspreventionTargetState,
  );
  const {
    riskChartData,
    hedgeChartData,
    isRiskChartLoading,
    isHedgeChartLoading,
  } = useChartData({
    riskReduction: riskReductionState,
    selectedAccountId,
    maxLoss: maxLossState,
  });
  useEffect(() => {
    setSelectedAccountId(
      bulkHedgeItems.length > 0 ? bulkHedgeItems[0].accountId : undefined,
    );
  }, [setSelectedAccountId, bulkHedgeItems]);
  const isMarginFeeDataLoading = useRecoilValue(marginFeeDataLoadingState);
  const resetCurrentForwardHedgeItem = useResetRecoilState(
    currentForwardHedgeItem,
  );

  const resetCurrentAutopilotHedgeItem = useResetRecoilState(
    currentAutopilotHedgeItem,
  );
  const resetCurrentParachuteHedgeItem = useResetRecoilState(
    currentParachuteHedgeItem,
  );
  const [selectedAccount, setSelectedAccount] =
    useRecoilState(selectedAccountState);
  const setSavedPortfolioDetailsState = useSetRecoilState(
    savedPortfolioDetailsState,
  );
  const { isFeatureEnabled } = useFeatureFlags();
  const shouldShowStrategySelector = isFeatureEnabled(CORPAY_FW_FF_NAME);
  const [open, setOpen] = useRecoilState(dialogUnsavedChangesControlState);
  const [notSaved, setNotSaved] = useState(true);
  const [attemptLeave, setAttemptLeave] = useState(false);
  const getItemsToSave = (): AnyHedgeItem[] => {
    if (!selectedAccountId) {
      return [];
    }
    const itemsToSave: AnyHedgeItem[] = bulkHedgeItems.map((hI) => {
      const h = hI.clone();
      h.accountId = selectedAccountId;
      return h;
    });
    return itemsToSave;
  };
  const handleSaveDraft = async () => {
    setNotSaved(false);
    setOpen(false);
    resetSelectedHedgeStrategy();
    resetCurrentForwardHedgeItem();
    resetCurrentAutopilotHedgeItem();
    resetCurrentParachuteHedgeItem();
    if (getItemsToSave().length > 0) {
      await saveBulkUploadHedgeItemsAsync(getItemsToSave()).then(() => {
        setPangeaAlertNotificationMessage({
          text: `Cashflow "${bulkHedgeItems[0].name}" draft saved!`,
          color: 'info',
          timeout: 3500,
          icon: <CheckCircle />,
        });
        router.push('/dashboard');
      });
    } else {
      router.push('/dashboard');
    }
  };
  const handleDeleteDraft = async () => {
    setNotSaved(false);
    setOpen(false);
    resetSelectedHedgeStrategy();
    resetCurrentForwardHedgeItem();
    resetCurrentAutopilotHedgeItem();
    resetCurrentParachuteHedgeItem();
    const hedgeItem = bulkHedgeItems[0] as any;
    const draftsToDelete: Cashflow[] = [];
    if (hedgeItem.type === 'installments') {
      const installment = await Installment.fromInstallmentIdAsync(
        hedgeItem?.id,
        authHelper,
      );
      installment &&
        installment.cashflows.forEach((c) => draftsToDelete.push(c));
    } else {
      const d = await Cashflow.fromDraftIdAsync(hedgeItem.id, authHelper);
      d && draftsToDelete.push(d);
    }
    await Promise.all(
      draftsToDelete.map(async (cashflow: Cashflow) => {
        if (cashflow.isFromDraftObject()) {
          await deleteDraftAsync(cashflow);
        } else if (cashflow.childDraft) {
          await deleteDraftAsync(Cashflow.fromDraftObject(cashflow.childDraft));
        }
      }),
    );
    if (hedgeItem.type == 'installments') {
      await authHelper
        .getAuthenticatedApiHelper()
        .deleteInstallmentAsync(hedgeItem.id);
    }
    setPangeaAlertNotificationMessage({
      text: `Cashflow "${bulkHedgeItems[0].name}" draft deleted!`,
      color: 'info',
      timeout: 3500,
      icon: <CheckCircle />,
    });
    router.push('/dashboard');
  };
  const handleClose = (
    _event: any,
    reason: 'backdropClick' | 'escapeKeyDown',
  ) => {
    if (reason) setOpen(false);
  };

  useEffect(() => {
    const beforeRouteHandler = (url: string) => {
      if (
        router.pathname !== url &&
        !url.includes('/cashflow') &&
        !url.includes('/manage/review')
      ) {
        setOpen(true);
        setAttemptLeave(true);
        router.events.emit('routeChangeError');
        // tslint:disable-next-line: no-string-throw
        throw `Route change to "${url}" was aborted (this error can be safely ignored). See https://github.com/zeit/next.js/issues/2476.`;
      }
    };
    if (notSaved) {
      router.events.on('routeChangeStart', beforeRouteHandler);
    } else {
      router.events.off('routeChangeStart', beforeRouteHandler);
    }
    return () => {
      router.events.off('routeChangeStart', beforeRouteHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notSaved]);
  const handleAccountInfoChanged = async (
    accountId: Optional<number>,
    riskAmt: Optional<number>,
  ) => {
    if (accountId !== selectedAccountId) {
      setSelectedAccountId(accountId);
      setAccountId(accountId);

      // If it's a new account, check if it's already in draft mode,
      // if not, create draft to trigger a call to margin_and_fees.
      // This usually happens when the user navigates
      // straight to Edit Risk Details from the cashflow grid/dashboard
      const cashflow = bulkHedgeItems[0] as Cashflow;
      if (cashflow && cashflow.id === -1) {
        const c = (bulkHedgeItems[0] as Cashflow).clone();
        const rate = c.currency
          ? currencies[c.currency]?.rate
          : domesticCurrency;
        c.indicative_base_amount = parseFloat(
          convertToDomesticAmount(c.amount, rate),
        );
        c.indicative_cntr_amount = c.amount;
        c.indicative_rate = c.currency
          ? parseFloat(currencies[c.currency]?.rate)
          : 0 ?? 0;
        await c.saveAsync(authHelper);
        setActiveHedgeItem?.(c);
      }
    }
    if (riskAmt !== riskReductionState) setRiskReductionState(riskAmt);
  };
  const ensureShouldShowFees = () => {
    setShouldShowFeesState(
      (!isUndefined(selectedAccountId) && selectedAccountId > 0) ||
        (!isUndefined(riskReductionState) && isNumber(riskReductionState)),
    );
  };
  const handleAutoPilotDetailsChanged = async (data: {
    riskReduction: Optional<number>;
    safeGuard: Optional<boolean>;
    safeGuardTarget: Optional<number>;
    lossPrevention: Optional<boolean>;
    lossPreventionTarget: Optional<number>;
  }) => {
    const {
      riskReduction,
      safeGuard,
      safeGuardTarget,
      lossPrevention,
      lossPreventionTarget,
    } = data;
    const isInstallment = bulkHedgeItems[0].type === 'installments';
    const cashflow = isInstallment
      ? (bulkHedgeItems[0] as Installment)
      : (bulkHedgeItems[0] as Cashflow);

    setSavedPortfolioDetailsState({
      amount: cashflow?.amount,
      date: isInstallment
        ? (cashflow as Installment)?.startDate
        : (cashflow as Cashflow)?.date,
      type: cashflow?.type,
      direction: cashflow.direction,
    });
    const processFwdHedgeItem = async (cf: AnyHedgeItem) => {
      const api = authHelper.getAuthenticatedApiHelper();
      const id =
        cf.type === 'installments'
          ? ((cf as Installment).installment_id as number)
          : (cf as unknown as Cashflow).id;
      let accountId = selectedAccountId;
      let hedgeItemId = selectedHedgeItem?.id;
      const autopilotHedgeItemId =
        selectedAccount?.autopilot_data?.id ??
        autopilotHedgeItem?.id ??
        accountsState.find(
          (a: { id: Optional<number> }) => a.id == selectedAccountId,
        )?.autopilot_data?.id ??
        0;
      if (accountId && accountId > 0) {
        if (autopilotHedgeItemId) {
          const autopilotPayload: PangeaAutopilotData = {
            upper_limit: safeGuard ? safeGuardTarget : 0,
            lower_limit: lossPrevention ? lossPreventionTarget : 0,
            id: autopilotHedgeItem?.id ?? 0,
            account: accountId,
          };

          const updateAutopilotItemResponse =
            await api.hedgeAutopilotUpdateAsync(
              accountId,
              autopilotHedgeItemId,
              autopilotPayload,
            );
          if (isError(updateAutopilotItemResponse)) {
            setPangeaAlertNotificationMessage({
              severity: 'error',
              text: 'Error updating Autopilot hedge item',
            });
            return;
          }
          setAutopilotHedgeItem(updateAutopilotItemResponse);
        } else {
          const autopilotPayload: PangeaAutopilotDataRequest = {
            upper_limit: safeGuard ? safeGuardTarget : 0,
            lower_limit: lossPrevention ? lossPreventionTarget : 0,
          };

          const newAutopilotItemResponse = await api.hedgeAutopilotCreateAsync(
            accountId,
            autopilotPayload,
          );
          if (isError(newAutopilotItemResponse)) {
            setPangeaAlertNotificationMessage({
              severity: 'error',
              text: 'Error creating Autopilot hedge item',
            });
            return;
          }
          setAutopilotHedgeItem(newAutopilotItemResponse);
        }
      } else {
        // Create a new account first
        const normalizedAccountName = `Custom-${v4()}`;
        const newAccountResponse = await api.createAccountAsync(
          normalizedAccountName,
          riskReduction ?? 0,
        );

        if (isError(newAccountResponse)) {
          setPangeaAlertNotificationMessage({
            text: `Failed creating new account '${normalizedAccountName}' with risk reduction ${(
              (riskReductionState ?? 0) * 100
            ).toFixed(0)}%`,
            severity: 'error',
          });
          return;
        }

        setAccountId(newAccountResponse.id);
        setSelectedAccountId(newAccountResponse.id);
        setSelectedAccount(newAccountResponse);
        accountId = newAccountResponse.id;
      }

      const c = cf.clone();
      const rate = c.currency ? currencies[c.currency]?.rate : domesticCurrency;
      c.indicative_base_amount = parseFloat(
        convertToDomesticAmount(c.amount, rate),
      );
      c.indicative_cntr_amount = c.amount;
      c.indicative_rate = c.currency
        ? parseFloat(currencies[c.currency]?.rate)
        : 0 ?? 0;
      c.accountId = accountId ?? 0;
      await c.saveAsync(authHelper);
      setActiveHedgeItem?.(c);

      if (!hedgeItemId) {
        // Create a new fowrards hedge item
        const payload: PangeaDraftFxForward = {
          risk_reduction: riskReduction ?? 0,
          status: '',
          fxpair: '',
          estimated_fx_forward_price: 0,
          destination_account_type:
            PangeaInstructDealRequestDeliveryMethodEnum.W, // TODO: SHOULD BE OPTIONAL
        };
        if (isInstallment) {
          payload.installment = id;
        } else {
          payload.draft_cashflow = id;
        }
        const newFwHedgeItemResponse = await api.corPayHedgeForwardCreateAsync(
          payload,
        );
        if (isError(newFwHedgeItemResponse)) {
          setPangeaAlertNotificationMessage({
            severity: 'error',
            text: 'Error creating forward hedge item',
          });
          return;
        }
        setSelectedHedgeItem(newFwHedgeItemResponse);
        hedgeItemId = newFwHedgeItemResponse.id;
      } else {
        // Do an update to the hedgeitem with the new riskAmount
        const updateFwHedgeItemResponse =
          await api.corPayHedgeForwardupdateAsync(hedgeItemId, {
            risk_reduction: riskReduction ?? 0,
            ...(cf.type === 'installments' ? { installment: id } : {}),
            status: '',
            fxpair: '',
            estimated_fx_forward_price: 0,
            destination_account_type:
              PangeaInstructDealRequestDeliveryMethodEnum.W, // TODO: SHOULD BE OPTIONAL
          });
        if (isError(updateFwHedgeItemResponse)) {
          setPangeaAlertNotificationMessage({
            severity: 'error',
            text: 'Error updating forward hedge item',
          });
          return;
        }

        setSelectedHedgeItem(updateFwHedgeItemResponse);
      }

      const whatIfFees = await api.autopilotForwardFeesAsync({
        id: hedgeItemId ?? 0,
        strategy: 'autopilot',
      });
      if (!isError(whatIfFees)) {
        setAutoPilotFees(whatIfFees);
      }

      setRiskReductionState(riskReduction);
    };
    if (!Number.isNaN(riskReduction)) {
      loadingPromise(processFwdHedgeItem(cashflow));
    }
  };
  const handleParachuteDetailsChanged = async (
    maxLoss: Optional<number>,
    safeguard: Optional<boolean>,
  ) => {
    const isInstallment = bulkHedgeItems[0].type === 'installments';
    const cashflow = isInstallment
      ? (bulkHedgeItems[0] as Installment)
      : (bulkHedgeItems[0] as Cashflow);
    setSavedPortfolioDetailsState({
      amount: cashflow?.amount,
      date: isInstallment
        ? (cashflow as Installment)?.startDate
        : (cashflow as Cashflow)?.date,
      type: cashflow?.type,
      direction: cashflow.direction,
    });
    const processFwdHedgeItem = async (cf: AnyHedgeItem) => {
      const api = authHelper.getAuthenticatedApiHelper();
      const id =
        cf.type === 'installments'
          ? ((cf as Installment).installment_id as number)
          : (cf as unknown as Cashflow).id;
      let accountId = selectedAccountId;
      let hedgeItemId = selectedHedgeItem?.id;
      const parachuteHedgeItemId =
        selectedAccount?.parachute_data?.id ??
        parachuteHedgeItem?.id ??
        accountsState.find(
          (a: { id: Optional<number> }) => a.id == selectedAccountId,
        )?.parachute_data?.id ??
        0;
      if (accountId && accountId > 0) {
        //&& selectedAccount does not have autopilot
        if (parachuteHedgeItemId) {
          const updateParachuteHedgeItemResponse =
            await api.hadgeParachuteUpdateAsync(
              accountId,
              parachuteHedgeItemId,
              {
                lower_limit: maxLoss ?? 0,
                safeguard,
                account: accountId,
                id: parachuteHedgeItemId,
              },
            );
          if (isError(updateParachuteHedgeItemResponse)) {
            setPangeaAlertNotificationMessage({
              severity: 'error',
              text: 'Error updating forward hedge item',
            });
            return;
          }
          setParachuteHedgeItem({ ...updateParachuteHedgeItemResponse });
        } else {
          const parachutePayload: PangeaParachuteDataRequest = {
            lower_limit: maxLoss ?? 0,
            safeguard: safeGuard,
          };

          const newParachuteHedgeItemResponse =
            await api.hadgeParachuteCreateAsync(accountId, parachutePayload);
          if (isError(newParachuteHedgeItemResponse)) {
            setPangeaAlertNotificationMessage({
              severity: 'error',
              text: 'Error creating parachute data',
            });
            return;
          }
          setParachuteHedgeItem({ id: newParachuteHedgeItemResponse.id });
        }
      } else {
        // Create a new account first
        const normalizedAccountName = `Custom-${v4()}`;
        const newAccountResponse = await api.createAccountAsync(
          normalizedAccountName,
          0,
        );

        if (isError(newAccountResponse)) {
          setPangeaAlertNotificationMessage({
            text: `Failed creating new account '${normalizedAccountName}' with risk reduction ${(
              (riskReductionState ?? 0) * 100
            ).toFixed(0)}%`,
            severity: 'error',
          });
          return;
        }

        setAccountId(newAccountResponse.id);
        setSelectedAccountId(newAccountResponse.id);
        setSelectedAccount(newAccountResponse);
        accountId = newAccountResponse.id as number;
        const parachutePayload: PangeaParachuteDataRequest = {
          lower_limit: maxLoss ?? 0,
          safeguard: safeGuard,
        };

        const newParachuteHedgeItemResponse =
          await api.hadgeParachuteCreateAsync(accountId, parachutePayload);
        if (isError(newParachuteHedgeItemResponse)) {
          setPangeaAlertNotificationMessage({
            severity: 'error',
            text: 'Error creating parachute data 2',
          });
          return;
        }
        setParachuteHedgeItem({ id: newParachuteHedgeItemResponse.id });
      }
      const c = cf.clone();
      const rate = c.currency ? currencies[c.currency]?.rate : domesticCurrency;
      c.indicative_base_amount = parseFloat(
        convertToDomesticAmount(c.amount, rate),
      );
      c.indicative_cntr_amount = c.amount;
      c.indicative_rate = c.currency
        ? parseFloat(currencies[c.currency]?.rate)
        : 0 ?? 0;
      c.accountId = accountId ?? 0;
      await c.saveAsync(authHelper);
      setActiveHedgeItem?.(c);

      if (!hedgeItemId) {
        // Create a new fowrards hedge item
        const payload: PangeaDraftFxForward = {
          risk_reduction: 0,
          status: '',
          fxpair: '',
          estimated_fx_forward_price: 0,
          destination_account_type:
            PangeaInstructDealRequestDeliveryMethodEnum.W, // TODO: SHOULD BE OPTIONAL
        };
        if (isInstallment) {
          payload.installment = id;
        } else {
          payload.draft_cashflow = id;
        }
        const newFwHedgeItemResponse = await api.corPayHedgeForwardCreateAsync(
          payload,
        );
        if (isError(newFwHedgeItemResponse)) {
          setPangeaAlertNotificationMessage({
            severity: 'error',
            text: 'Error creating forward hedge item',
          });
          return;
        }
        setSelectedHedgeItem(newFwHedgeItemResponse);
        hedgeItemId = newFwHedgeItemResponse.id;
      } else {
        const updateFwHedgeItemResponse =
          await api.corPayHedgeForwardupdateAsync(hedgeItemId, {
            risk_reduction: 0,
            ...(cf.type === 'installments' ? { installment: id } : {}),
            status: '',
            fxpair: '',
            estimated_fx_forward_price: 0,
            destination_account_type:
              PangeaInstructDealRequestDeliveryMethodEnum.W, // TODO: SHOULD BE OPTIONAL
          });
        if (isError(updateFwHedgeItemResponse)) {
          setPangeaAlertNotificationMessage({
            severity: 'error',
            text: 'Error updating forward hedge item',
          });
          return;
        }

        setSelectedHedgeItem(updateFwHedgeItemResponse);
      }
      const whatIfFees = await api.autopilotForwardFeesAsync({
        id: hedgeItemId ?? 0,
        strategy: 'parachute',
      });
      if (!isError(whatIfFees)) {
        setAutoPilotFees(whatIfFees);
      }
      setMaxLossState(maxLoss);
    };
    if (!Number.isNaN(maxLoss)) {
      loadingPromise(processFwdHedgeItem(cashflow));
    }
  };
  const handleContinueClicked = async () => {
    if (!selectedAccountId) {
      return;
    }

    const itemsToSave = getItemsToSave();
    const isInstallment = itemsToSave[0].type === 'installments';
    const cashflow = isInstallment
      ? (itemsToSave[0] as Installment)
      : (itemsToSave[0] as Cashflow);
    setSavedPortfolioDetailsState({
      amount: cashflow.amount,
      date: isInstallment
        ? (cashflow as Installment)?.startDate
        : (cashflow as Cashflow)?.date,
      type: cashflow.type,
      direction: cashflow.direction,
    });
    await saveBulkUploadHedgeItemsAsync(itemsToSave);
    setSelectedAccount(
      accountsState.find((a: { id: number }) => a.id == selectedAccountId) ??
        null,
    );
    router.push(
      `/${mode == 'create' ? 'cashflow' : 'manage'}/review${
        mode == 'manage' && itemsToSave.length == 1
          ? cashflow.type == 'installments'
            ? `?installment_id=${cashflow.installment_id}`
            : `?cashflow_id=${(cashflow as Cashflow)?.cashflow_id}`
          : window.location.search
      }`,
    );
    setNotSaved(false);
  };
  const graphHoverData = useRecoilValue(graphHoverDataState);
  useEffect(ensureShouldShowFees, [
    riskReductionState,
    selectedAccountId,
    bulkHedgeItems,
    setShouldShowFeesState,
  ]);
  // useEffect(() => {
  //   const loadHedgeItem = async (
  //     forward_id: number,
  //     shouldResetState: boolean,
  //   ) => {
  //     const api = authHelper.getAuthenticatedApiHelper();
  //     const hedgeItemResponse = await api.getHedgeForwardByIdAsync(forward_id);
  //     if (!isError(hedgeItemResponse)) {
  //       setSelectedHedgeItem(hedgeItemResponse);
  //       if (!shouldResetState) {
  //         setRiskReductionState(hedgeItemResponse.risk_reduction);
  //       }
  //     }
  //   };
  //   //This is to check if the amount and date details in savedPortfolioDetailsState has changed
  //   const isInstallment = bulkHedgeItems[0]?.type === 'installments';
  //   const cashflow = isInstallment
  //     ? (bulkHedgeItems[0] as Installment)
  //     : (bulkHedgeItems[0] as Cashflow);
  //   const id =
  //     cashflow?.type === 'installments'
  //       ? ((cashflow as Installment).installment_id as number)
  //       : (cashflow as unknown as Cashflow)?.id;
  //   const draft_fx_forward_id =
  //     cashflow?.type === 'installments'
  //       ? ((cashflow as Installment).cashflows[0].draft_fx_forward_id as number)
  //       : (cashflow as unknown as Cashflow)?.draft_fx_forward_id;
  //   const shouldResetState =
  //     portfolioDetailsState?.amount !== cashflow?.amount ||
  //     portfolioDetailsState?.date?.getTime() !==
  //       (isInstallment
  //         ? (cashflow as Installment)?.startDate
  //         : (cashflow as Cashflow)?.date
  //       )?.getTime() ||
  //     portfolioDetailsState?.type !== cashflow?.type ||
  //     portfolioDetailsState?.direction !== cashflow?.direction;

  //   if (shouldResetState) {
  //     setRiskReductionState(undefined);
  //     setSelectedStrategy(undefined);
  //     setMaxLossState(undefined);
  //   }

  //   if (draft_fx_forward_id) {
  //     loadHedgeItem(draft_fx_forward_id, shouldResetState);
  //   } else if (selectedHedgeItem && id !== selectedHedgeItem?.draft_cashflow) {
  //     resetCurrentForwardHedgeItem();
  //     if (cashflow?.accountId > 0) {
  //       handleAutoPilotDetailsChanged({
  //         riskReduction: riskReductionState ?? 0,
  //         safeGuard,
  //         safeGuardTarget: safeGuardTaget,
  //         lossPrevention,
  //         lossPreventionTarget: lossPreventionTaget,
  //       });
  //     }
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  useEffect(() => {
    const newAccount =
      accountsState.find(
        (a: { id: number }) =>
          a.id == (bulkHedgeItems.length > 0 ? bulkHedgeItems[0].accountId : 0),
      ) ??
      selectedAccount ??
      null;
    if (newAccount && !selectedAccount) {
      if (newAccount.parachute_data) {
        setMaxLossState(newAccount.parachute_data.lower_limit);
      }
      if (newAccount.autopilot_data) {
        setLossPrevention(
          Math.abs(newAccount.autopilot_data.lower_limit ?? 0) > 0,
        );
        setSafeGuardTaget(newAccount.autopilot_data.upper_limit);
        setLossPreventionTaget(newAccount.autopilot_data.lower_limit);
      }
      setSelectedAccount(newAccount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bulkHedgeItems]);
  // useEffect(() => {
  //   // This is here to allow refreshing the review page without losing the selected strategy
  //   const loadHedgeItem = async () => {
  //     if (selectedAccountId && selectedHedgeItem?.id) {
  //       const api = authHelper.getAuthenticatedApiHelper();
  //       const hedgeItemResponse = await api.getHedgeForwardByIdAsync(
  //         selectedHedgeItem.id,
  //       );
  //       if (isError(hedgeItemResponse)) {
  //         if (mode === 'manage') {
  //           setSelectedStrategy(CashflowStrategyEnum.ZEROGRAVITY);
  //         }
  //       } else {
  //         setSelectedHedgeItem(hedgeItemResponse);
  //         if (mode === 'manage') {
  //           setSelectedStrategy(CashflowStrategyEnum.AUTOPILOT);
  //           setRiskReductionState(hedgeItemResponse.risk_reduction);
  //         }
  //       }
  //     }
  //   };
  //   loadHedgeItem();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedAccountId]);

  //If there are no items or if all of them have delivery dates before today, kick them back to details.
  if (
    isLoaded &&
    (bulkHedgeItems.length == 0 ||
      bulkHedgeItems.reduce(
        (isDateBeforeToday, hI) => isDateBeforeToday && hI.endDate < new Date(),
        true,
      ))
  ) {
    if (bulkHedgeItems.length > 1) {
      router.push(`/cashflow/details/advanced`);
    } else if (bulkHedgeItems.length == 0) {
      router.push(`/cashflow/`);
    } else {
      router.push(`/cashflow/details/${bulkHedgeItems[0].type}`);
    }
  }
  const isLoading =
    isRiskChartLoading || isHedgeChartLoading || loadingForwardState.isLoading;
  const volatility = graphHoverData?.upside
    ? (100 * graphHoverData.upside).toFixed(1)
    : 'N/A';

  const chartTitle = useMemo(() => {
    return selectedStrategy === CashflowStrategyEnum.PARACHUTE ? (
      <Typography variant='h6' mt={4}>
        Losses will slow with a limit of{' '}
        {((maxLossState ?? 0.01) * 100).toFixed(2)}%.{' '}
        {safeGuard
          ? 'Gains are dynamically safeguarded.'
          : 'Potentials gains are uncapped.'}
      </Typography>
    ) : safeGuard && lossPrevention && riskReductionState !== undefined ? (
      <TypographyLoader
        isLoading={isLoading}
        variant='h6'
        mt={4}
        skeletonProps={{
          sx: skeletonStyles,
        }}
      >
        Volatility has been eliminated on{' '}
        {(riskReductionState * 100).toFixed(2)}%of your cash flow,{' '}
        {(100 - riskReductionState * 100).toFixed(2)}% remains unhedged. With
        Loss Prevention Limit and Safeguard Target enabled, losses and gains on
        total cash flow value will now remain between{' '}
        {((lossPreventionTaget ?? 0) * 100).toFixed(2)}% and +
        {((safeGuardTaget ?? 0) * 100).toFixed(2)}%.
      </TypographyLoader>
    ) : safeGuard && riskReductionState !== undefined ? (
      <TypographyLoader
        isLoading={isLoading}
        variant='h6'
        mt={4}
        skeletonProps={{
          sx: skeletonStyles,
        }}
      >
        Volatility has been eliminated on{' '}
        {(riskReductionState * 100).toFixed(2)}
        %of your cash flow, {(100 - riskReductionState * 100).toFixed(2)}%
        remains unhedged. Losses are predicted to not exceed -{volatility}%.
        With Safeguard Target enabled, gains will be secured if your total cash
        flow value hits {((safeGuardTaget ?? 0) * 100).toFixed(2)}%
      </TypographyLoader>
    ) : lossPrevention && riskReductionState !== undefined ? (
      <TypographyLoader
        isLoading={isLoading}
        variant='h6'
        mt={4}
        skeletonProps={{
          sx: skeletonStyles,
        }}
      >
        Volatility has been eliminated on{' '}
        {(riskReductionState * 100).toFixed(2)}%of your cash flow,{' '}
        {(100 - riskReductionState * 100).toFixed(2)}% remains unhedged. With
        Loss Prevention Limit enabled, losses are limited to{' '}
        {((lossPreventionTaget ?? 0) * 100).toFixed(2)}%. Gains are predicted to
        not exceed +{volatility}%.
      </TypographyLoader>
    ) : riskReductionState !== undefined && riskReductionState < 1 ? (
      <TypographyLoader
        isLoading={isLoading}
        variant='h6'
        mt={4}
        skeletonProps={{
          sx: skeletonStyles,
        }}
      >
        Volatility has been eliminated on{' '}
        {(riskReductionState * 100).toFixed(2)}% of your cash flow,{' '}
        {(100 - riskReductionState * 100).toFixed(2)}% remains unhedged. Losses
        and gains on total cash flow value are now predicted to remain between -
        {volatility}% and +{volatility}%.
      </TypographyLoader>
    ) : riskReductionState !== undefined && riskReductionState >= 1 ? (
      <Typography variant='h6' mt={4}>
        This Cash Flow(s) volatility is now reduced to 0% in this timeframe.
      </Typography>
    ) : (
      <TypographyLoader
        isLoading={isLoading}
        skeletonProps={{
          sx: skeletonStyles,
        }}
      >
        This Cash Flow(s) could experience up to {volatility + '%'} volatility
        or more in this timeframe.
      </TypographyLoader>
    );
  }, [
    isLoading,
    lossPrevention,
    lossPreventionTaget,
    maxLossState,
    riskReductionState,
    safeGuard,
    safeGuardTaget,
    selectedStrategy,
    volatility,
  ]);
  const chartDescription =
    'Mousing over the volatility projection below can you help you decide how much protection you may need.';
  const qs =
    (bulkHedgeItems?.length ?? 0) == 1
      ? bulkHedgeItems[0].type === 'installments'
        ? `installment_id=${bulkHedgeItems[0].installment_id}`
        : (bulkHedgeItems[0] as Cashflow).id !== -1
        ? `draft_id=${(bulkHedgeItems[0] as Cashflow).id}`
        : ''
      : '';
  const backButtonUrl =
    mode == 'create'
      ? !bulkHedgeItems || bulkHedgeItems.length == 0
        ? '/cashflow'
        : bulkHedgeItems.length > 1
        ? '/cashflow/details/advanced'
        : `/cashflow/details/${bulkHedgeItems[0].type}?${qs}`
      : `/manage/details/${bulkHedgeItems[0]?.type}?${qs}`;
  const RiskChartDataTable = useMemo(() => {
    return (
      <RiskTable
        accountId={selectedAccountId}
        riskReduction={riskReductionState}
      />
    );
  }, [riskReductionState, selectedAccountId]);
  return (
    <StepperShell
      title={
        shouldShowStrategySelector
          ? 'Select your strategy'
          : 'Add cash flows to a portfolio'
      }
      continueButtonText={
        selectedStrategy === CashflowStrategyEnum.AUTOPILOT
          ? 'Hedge Summary'
          : 'Add to Portfolio'
      }
      onClickContinueButton={handleContinueClicked}
      continueButtonEnabled={
        !!selectedAccountId &&
        selectedAccountId > 0 &&
        (selectedStrategy === CashflowStrategyEnum.ZEROGRAVITY ||
        !shouldShowStrategySelector
          ? !isMarginFeeDataLoading
          : Boolean(selectedHedgeItem))
      }
      backButtonHref={backButtonUrl}
    >
      <Typography
        color={PangeaColors.BlackSemiTransparent60}
        variant='body2'
        sx={{ marginTop: '0!important' }}
      >
        {shouldShowStrategySelector
          ? 'Add cash flows to a portfolio or leverage forwards for this hedge.'
          : 'Portfolios with higher coverage provide more protection from volatility.'}
      </Typography>
      <Suspense fallback={<PangeaLoading />}>
        <FeatureFlag
          name={CORPAY_FW_FF_NAME}
          fallback={
            <PortfolioPicker
              onChange={handleAccountInfoChanged}
              accountId={selectedAccountId}
            />
          }
        >
          <StrategyPicker
            strategySetFunc={(val) => {
              setSelectedStrategy(val);
              if (
                val === CashflowStrategyEnum.AUTOPILOT &&
                Number.isNaN(riskReductionState)
              ) {
                setRiskReductionState(0);
              } else if (
                val === CashflowStrategyEnum.PARACHUTE &&
                Number.isNaN(maxLossState)
              ) {
                setMaxLossState(-0.005);
              }
            }}
          />
          {selectedStrategy && (
            <>
              {selectedStrategy === CashflowStrategyEnum.ZEROGRAVITY ? (
                <ZeroGravityDetails
                  onChange={handleAccountInfoChanged}
                  accountId={selectedAccountId}
                />
              ) : selectedStrategy === CashflowStrategyEnum.PARACHUTE ? (
                <ParachuteDetails
                  onChange={handleParachuteDetailsChanged}
                  loadingState={loadingState.isLoading}
                />
              ) : (
                <AutoPilotDetails
                  onChange={handleAutoPilotDetailsChanged}
                  loadingState={loadingState.isLoading}
                />
              )}
            </>
          )}
        </FeatureFlag>
      </Suspense>
      {chartTitle}
      <Typography color={PangeaColors.BlackSemiTransparent60} variant='body2'>
        {chartDescription}
      </Typography>
      <Box sx={{ minHeight: '19rem' }}>
        {isLoading ? (
          <Stack sx={{ height: '340px' }}>
            <PangeaLoading
              loadingPhrase='Charting risk cone ...'
              centerPhrase
            />
          </Stack>
        ) : riskChartData &&
          (isUndefined(selectedAccountId) || selectedAccountId == -1) &&
          (isUndefined(riskReductionState) || !isNumber(riskReductionState)) &&
          (isUndefined(maxLossState) || !isNumber(maxLossState)) ? (
          <CurrencyChartYourRisk />
        ) : hedgeChartData && Object.keys(hedgeChartData).length > 0 ? (
          <CurrencyChartYourHedge
            accountId={selectedAccountId ?? undefined}
            riskReduction={riskReductionState}
            maxLoss={maxLossState}
          />
        ) : null}

        {dontShowDialog ? null : <DialogYourHedgeRiskControls />}
        {attemptLeave ? (
          <>
            <PangeaSimpleDialog
              title={
                bulkHedgeItems[0].accountId > 0
                  ? 'Unsaved changes'
                  : 'Unsaved Draft'
              }
              width='368px'
              openModal={open}
              noButton={true}
              noCloseButton={true}
              minHeight='200px'
              onClose={() => {
                setOpen(false);
              }}
            >
              <DialogUnsavedChangesControl
                isNewDraft={bulkHedgeItems[0].accountId < 0}
                handleSaveDraft={handleSaveDraft}
                handleClose={handleClose}
                handleDeleteDraft={handleDeleteDraft}
              />
            </PangeaSimpleDialog>
          </>
        ) : null}
      </Box>
      <Suspense fallback={<PangeaLoading />}>
        {/* <RiskTable
          accountId={selectedAccountId}
          riskReduction={riskReductionState}
        /> */}
        {RiskChartDataTable}
      </Suspense>
    </StepperShell>
  );
};
export default ChooseAPortfolioLeft;
