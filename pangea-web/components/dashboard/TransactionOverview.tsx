import AddIcon from '@mui/icons-material/Add';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  timelineOppositeContentClasses,
  TimelineSeparator,
} from '@mui/lab';
import {
  Alert,
  Box,
  BoxProps,
  Divider,
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import { useQueryClient } from '@tanstack/react-query';
import {
  clientApiState,
  isLoggedInState,
  pangeaAlertNotificationMessageState,
  userState,
} from 'atoms';
import BeneficaryForm from 'components/shared/BeneficiaryForms/BeneficiaryForm';
import TruncatedTypography from 'components/shared/TruncatedTypography';
import { RHSAccordion } from 'components/summarypanel';
import { format, parseISO } from 'date-fns';
import {
  useCacheableAsyncData,
  useLoading,
  useWalletAndPaymentHelpers,
} from 'hooks';
import {
  formatCurrency,
  PangeaPayment,
  PangeaPaymentStatusEnum,
  setAlpha,
} from 'lib';
import { isError } from 'lodash';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import {
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import { PangeaColors } from 'styles';
import {
  PangeaButton,
  PangeaPageTitle,
  RedirectSpinner,
  SummaryDataPoint,
  TypographyLoader,
} from '../shared';
import CutoffCountdown from 'components/shared/CutoffCountdown';

const StyledBox = styled(Box)<BoxProps>(() => ({
  borderRadius: '.5rem',
  backgroundColor: '#fafafa',
  border: `1px solid ${PangeaColors.Gray}`,
  padding: '1rem .75rem',
  display: 'flex',
  flexDirection: 'column',
  rowGap: '8px',
}));
const BootstrapInput = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    position: 'relative',
    backgroundColor: 'transparent',
    border: 0,
    padding: '0 30px 0 0 !important',
    height: 'auto!important',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
    },
  },
}));

export const TransactionOverview = ({
  data,
  onApproverChange,
}: {
  data: PangeaPayment;
  onApproverChange?: () => void;
}) => {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const router = useRouter();
  const userInfo = useRecoilValueLoadable(userState).getValue();
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const {
    delivery_date,
    cashflows,
    amount,
    lock_side,
    buy_currency,
    sell_currency,
    cntr_amount,
    payment_status,
    origin_account_id,
    destination_account_id,
    purpose_of_payment,
    assigned_approvers,
  } = data;

  const isCanceledOrFailed = [
    PangeaPaymentStatusEnum.Canceled,
    PangeaPaymentStatusEnum.Failed,
  ].includes(payment_status);
  const isBookedDeliveredOrInTransit = [
    PangeaPaymentStatusEnum.Booked,
    PangeaPaymentStatusEnum.InTransit,
    PangeaPaymentStatusEnum.Delivered,
    PangeaPaymentStatusEnum.Working,
    PangeaPaymentStatusEnum.Settled,
  ].includes(payment_status);
  const isPendingApproval = [
    PangeaPaymentStatusEnum.PendAuth,
    PangeaPaymentStatusEnum.PendingApproval,
  ].includes(payment_status);
  const [openAddBeneficiaryDialog, setOpenAddBeneficiaryDialog] =
    useState(false);
  const [originAccount, setOriginAccount] = useState('');
  const [destinationAccount, setDestinationAccount] = useState('');
  const [purposeOfPayment, setPurposeOfPayment] = useState('');
  const queryClient = useQueryClient();
  const api = useRecoilValue(clientApiState);
  const apiHelper = api.getAuthenticatedApiHelper();
  const {
    loadingState: updateTransactionState,
    loadingPromise: updateTransactionPromise,
  } = useLoading();

  const { data: initialStateData, isLoading: isLoadingInitialState } =
    useCacheableAsyncData(`initial-data-${data.id ?? ''}`, async () => {
      if (
        data.id &&
        lock_side &&
        buy_currency &&
        sell_currency &&
        (delivery_date || cashflows[0].pay_date)
      ) {
        const res = await apiHelper.getMarketSpotRate({
          buy_currency: buy_currency,
          sell_currency: sell_currency,
          value_date:
            delivery_date ??
            format(parseISO(cashflows[0].pay_date), 'yyyy-MM-dd'),
        });
        return res;
      }
      return undefined;
    });
  const {
    allWallets,
    settlementAccounts,
    isLoadingPurposes,
    isLoadingSettlementWallets,
    isLoadingBeneficiaryAccounts,
    allPurposes,
    beneficiaryAccounts,
  } = useWalletAndPaymentHelpers();

  const updatePayment = useCallback(
    async (field: keyof PangeaPayment, value: string, callback: () => void) => {
      const payload: PangeaPayment = {
        ...data,
        [field]: value,
      };

      const response = await apiHelper.updatePaymentByIdAsync(
        data.id,
        payload as PangeaPayment,
      );

      if (isError(response)) {
        setPangeaAlertNotificationMessage({
          severity: 'error',
          text: 'Failed to update payment. Please try again.',
        });
        return;
      }
      queryClient.invalidateQueries({
        queryKey: [`transaction-${router.query.id}`],
      });
      setPangeaAlertNotificationMessage({
        severity: 'success',
        text: 'Updated payment successfully.',
      });
      callback();
    },
    [
      apiHelper,
      data,
      queryClient,
      router.query.id,
      setPangeaAlertNotificationMessage,
    ],
  );
  const handleOriginAccountChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      updateTransactionPromise(
        updatePayment('origin_account_id', event.target.value, () => {
          setOriginAccount((prev) =>
            updateTransactionState.hasError ? prev : event.target.value,
          );
        }),
      );
    },
    [updatePayment, updateTransactionPromise, updateTransactionState.hasError],
  );
  const handleDestinationAccountChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      updateTransactionPromise(
        updatePayment('destination_account_id', event.target.value, () => {
          setDestinationAccount((prev) =>
            updateTransactionState.hasError ? prev : event.target.value,
          );
        }),
      );
    },
    [updatePayment, updateTransactionPromise, updateTransactionState.hasError],
  );
  const handlePurposeOfPaymentChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      updateTransactionPromise(
        updatePayment('purpose_of_payment', event.target.value, () => {
          setPurposeOfPayment((prev) =>
            updateTransactionState.hasError ? prev : event.target.value,
          );
        }),
      );
    },
    [updatePayment, updateTransactionPromise, updateTransactionState.hasError],
  );

  const handleApprovePayment = useCallback(() => {
    const submitApproval = async () => {
      const response = await apiHelper.approvePaymentAsync({
        payment_id: data.id,
      });

      if (isError(response)) {
        setPangeaAlertNotificationMessage({
          severity: 'error',
          text: 'Failed to approve payment. Please try again.',
        });
        return;
      }
      onApproverChange?.();
    };
    updateTransactionPromise(submitApproval());
  }, [
    apiHelper,
    data.id,
    setPangeaAlertNotificationMessage,
    updateTransactionPromise,
    onApproverChange,
  ]);

  if (!isLoggedIn) {
    return <RedirectSpinner />;
  }
  function displayConversion(data: {
    rate: any;
    lock_side?: string;
    buy_currency?: string;
    sell_currency?: string;
  }): string {
    const { rate, lock_side, buy_currency, sell_currency } = data;
    if (lock_side === buy_currency) {
      return `1 ${buy_currency} = ${rate} ${sell_currency}`;
    } else if (lock_side === sell_currency) {
      return `1 ${sell_currency} = ${rate} ${buy_currency}`;
    }
    return '-';
  }
  const transactionTime = cashflows[0]?.ticket?.transaction_time;
  const transactionDate = transactionTime
    ? format(parseISO(transactionTime), 'dd MMM yyy')
    : cashflows[0]?.created
    ? format(new Date(cashflows[0].created), 'dd MMM yyy')
    : 'N/A';

  const isCurrentUserApprover =
    userInfo?.id && assigned_approvers?.some(({ id }) => id === userInfo.id);

  return (
    <Stack spacing={2}>
      <PangeaPageTitle
        title={cashflows[0]?.name ?? '-'}
        variant='h4'
        pageTitleOverride='Your Cashflow'
        color={PangeaColors.BlackSemiTransparent87}
      />
      {(() => {
        if (payment_status === PangeaPaymentStatusEnum.AwaitingFunds) {
          return (
            <Alert color='warning' icon={false} sx={{ padding: '24px 14px' }}>
              <Stack direction='row' justifyContent='space-between'>
                <Typography variant='body1'>Awaiting Instruction</Typography>
                <ErrorOutlineIcon color='warning' />
              </Stack>

              <Typography variant='body2' sx={{ margin: '4px 0 8px 0' }}>
                This payment was not funded due to insufficient funds at the
                time of execution or instructions were not yet provided. To
                complete this payment, please resolve below:
              </Typography>
              <Typography variant='body2' sx={{ marginBottom: '8px' }}>
                1. If funds are now available you can redraft now:
                <br />
                Redraft
              </Typography>
              <Typography variant='body2' sx={{ marginBottom: '8px' }}>
                2. Wire funds to the designated origin account:
                <br />
                Instructions
              </Typography>
              <Typography variant='body2'>
                3. Provide settlement instructions below.
              </Typography>
            </Alert>
          );
        } else if (
          [
            PangeaPaymentStatusEnum.PendAuth,
            PangeaPaymentStatusEnum.PendingApproval,
          ].includes(payment_status) &&
          isCurrentUserApprover
        ) {
          return (
            <Stack
              direction='row'
              gap='12px'
              sx={{
                border: '1px solid #000000',
                borderRadius: '8px',
                padding: '16px',
                minWidth: '300px',
                borderColor: PangeaColors.CautionYellowMedium,
                backgroundColor: setAlpha(
                  PangeaColors.CautionYellowMedium,
                  0.1,
                ),
              }}
            >
              <WarningAmberIcon
                sx={{ color: PangeaColors.CautionYellowMedium }}
              />
              <Stack gap='4px'>
                <Typography variant='h6' color={PangeaColors.Black}>
                  Approval Required
                </Typography>
                <Typography
                  color={PangeaColors.Black}
                  fontFamily='SuisseIntl'
                  fontSize={'14px'}
                >
                  Please approve promptly to avoid delays in execution and
                  delivery. If not approved within{' '}
                  {initialStateData && !isError(initialStateData) ? (
                    <CutoffCountdown
                      showOnlyTimer
                      cutoffDate={initialStateData.cutoff_time}
                    />
                  ) : (
                    <Skeleton width={50} sx={{ display: 'inline-block' }} />
                  )}
                  , delays may occur.
                </Typography>
                <PangeaButton
                  sx={{ width: 150, mt: 2 }}
                  onClick={handleApprovePayment}
                  loading={updateTransactionState.isLoading}
                >
                  Approve Payment
                </PangeaButton>
              </Stack>
            </Stack>
          );
        }
      })()}
      <RHSAccordion
        title='Payment Details'
        defaultExpanded
        showDivider={false}
        showHeaderDivider={false}
      >
        <StyledBox sx={{ opacity: isCanceledOrFailed ? '0.5' : '1' }}>
          <Timeline
            sx={{
              [`& .${timelineOppositeContentClasses.root}`]: {
                flex: 0.3,
                textAlign: 'left',
                paddingLeft: 0,
              },
            }}
          >
            <TimelineItem
              sx={{ '& .MuiTimelineConnector-root': { height: 57 } }}
            >
              <TimelineOppositeContent>
                <Typography variant='dataLabel'>{transactionDate}</Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot
                  sx={{ backgroundColor: PangeaColors.WarmOrangeMedium }}
                />
                <TimelineConnector
                  sx={{ backgroundColor: PangeaColors.Gray }}
                />
              </TimelineSeparator>
              <TimelineContent>
                <Stack>
                  <Typography variant='dataBody'>
                    Selling {sell_currency}
                  </Typography>
                  <Typography variant='h5'>
                    {lock_side === sell_currency
                      ? formatCurrency(amount ?? '', sell_currency, true, 2, 4)
                      : lock_side === buy_currency
                      ? formatCurrency(
                          cntr_amount ?? '',
                          sell_currency,
                          true,
                          2,
                          4,
                        )
                      : '-'}{' '}
                    {sell_currency}
                  </Typography>
                </Stack>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineOppositeContent>
                <Typography variant='dataLabel'>&nbsp;</Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot
                  sx={{
                    backgroundColor: PangeaColors.EarthBlueMedium,
                    padding: '2px',
                  }}
                />
                <TimelineConnector
                  sx={{ backgroundColor: PangeaColors.Gray }}
                />
              </TimelineSeparator>
              <TimelineContent>
                <Stack>
                  {!cashflows[0]?.ticket?.all_in_rate ? (
                    <>
                      <TypographyLoader
                        variant='body1'
                        data-testid='spotRateLabelValue'
                        isLoading={isLoadingInitialState && !initialStateData}
                        skeletonProps={{
                          width: '30%',
                        }}
                      >
                        {initialStateData && !isError(initialStateData)
                          ? displayConversion({
                              rate: initialStateData.rate,
                              lock_side:
                                initialStateData.side.toLowerCase() == 'buy'
                                  ? buy_currency
                                  : sell_currency,
                              buy_currency,
                              sell_currency,
                            })
                          : ''}{' '}
                        *
                      </TypographyLoader>
                      <Typography
                        variant='small'
                        fontSize={'0.75rem'}
                        color={PangeaColors.BlackSemiTransparent50}
                        whiteSpace='nowrap'
                      >
                        * this rate is indicative
                      </Typography>
                    </>
                  ) : (
                    <Typography
                      variant='body1'
                      data-testid='spotRateLabelValue'
                      sx={{
                        color: 'black',
                      }}
                    >
                      {displayConversion({
                        rate: formatCurrency(
                          cashflows[0].ticket.all_in_rate,
                          sell_currency,
                          true,
                          2,
                          4,
                        ),
                        lock_side,
                        buy_currency,
                        sell_currency,
                      })}
                      {!isBookedDeliveredOrInTransit && !isCanceledOrFailed
                        ? ' *'
                        : ''}
                    </Typography>
                  )}
                  {isBookedDeliveredOrInTransit ? (
                    <Typography fontSize='.75rem'>
                      This rate has been booked
                    </Typography>
                  ) : null}
                </Stack>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineOppositeContent>
                <Typography variant='dataLabel'>
                  {delivery_date
                    ? format(parseISO(delivery_date), 'dd MMM yyy')
                    : 'N/A'}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot
                  sx={{ backgroundColor: PangeaColors.SecurityGreenMedium }}
                />
              </TimelineSeparator>
              <TimelineContent>
                <Stack>
                  <Typography variant='dataBody'>
                    Buying {buy_currency}
                  </Typography>
                  <Typography
                    variant='h5'
                    data-testid='settlementAmountLabelValue'
                    sx={{
                      marginBottom: 2,
                      color: 'black',
                    }}
                  >
                    {lock_side === buy_currency
                      ? formatCurrency(amount ?? '', buy_currency, true, 2, 4)
                      : lock_side === sell_currency
                      ? formatCurrency(
                          cntr_amount ?? '',
                          buy_currency,
                          true,
                          2,
                          4,
                        )
                      : '-'}{' '}
                    {buy_currency}
                  </Typography>
                </Stack>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </StyledBox>
        {!isCanceledOrFailed ? (
          <Stack rowGap={1} direction='column'>
            <Stack
              direction='row'
              alignItems={'center'}
              justifyContent='space-between'
            >
              <Typography variant='dataLabel'>Origin Account</Typography>
              <Select
                labelId='origin-account-label'
                id='origin-account'
                value={originAccount ? originAccount : origin_account_id ?? ''}
                displayEmpty
                disabled={
                  isLoadingSettlementWallets ||
                  updateTransactionState.isLoading ||
                  isBookedDeliveredOrInTransit ||
                  isPendingApproval
                }
                placeholder='Select'
                onChange={handleOriginAccountChange}
                MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
                input={<BootstrapInput />}
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <Typography
                        variant='dataBody'
                        color={PangeaColors.EarthBlueMedium}
                      >
                        Select
                      </Typography>
                    );
                  }
                  const wallet = allWallets.find(
                    ({ wallet_id }) => wallet_id === selected,
                  );
                  if (wallet) {
                    const { name } = wallet;
                    return (
                      <TruncatedTypography
                        sx={{
                          maxWidth: 300,
                          fontFamily: 'SuisseIntlCond',
                          fontWeight: 500,
                          fontSize: '1rem',
                        }}
                      >
                        {name}
                      </TruncatedTypography>
                    );
                  }
                  const account = settlementAccounts.find(
                    ({ wallet_id }) => wallet_id === selected,
                  );
                  if (account) {
                    const { name } = account;
                    return (
                      <TruncatedTypography
                        sx={{
                          maxWidth: 300,
                          fontFamily: 'SuisseIntlCond',
                          fontWeight: 500,
                          fontSize: '1rem',
                        }}
                      >
                        {name}
                      </TruncatedTypography>
                    );
                  }
                  return (
                    <TruncatedTypography
                      sx={{
                        maxWidth: 300,
                        fontFamily: 'SuisseIntlCond',
                        fontWeight: 500,
                        fontSize: '1rem',
                      }}
                    >
                      {selected}
                    </TruncatedTypography>
                  );
                }}
              >
                <ListSubheader
                  sx={{
                    backgroundColor: PangeaColors.SolidSlateDarker,
                    color: PangeaColors.LightPrimaryContrast,
                  }}
                  color='inherit'
                >
                  Wallets
                </ListSubheader>
                {allWallets
                  ?.filter(({ currency }) => sell_currency === currency)
                  .map((wallet) => {
                    const { wallet_id, name } = wallet;
                    return (
                      <MenuItem key={wallet_id} value={wallet_id}>
                        {name}
                      </MenuItem>
                    );
                  })}
                <ListSubheader
                  sx={{
                    backgroundColor: PangeaColors.SolidSlateDarker,
                    color: PangeaColors.LightPrimaryContrast,
                  }}
                  color='inherit'
                >
                  Bank Accounts
                </ListSubheader>
                {settlementAccounts
                  ?.filter(({ currency }) => sell_currency === currency)
                  .map((account) => {
                    const { wallet_id, name } = account;
                    return (
                      <MenuItem key={wallet_id} value={wallet_id}>
                        {name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </Stack>
            <Divider
              variant='fullWidth'
              orientation='horizontal'
              sx={{
                borderColor: PangeaColors.Gray,
              }}
            />
            <Stack
              direction='row'
              alignItems={'center'}
              justifyContent='space-between'
            >
              <Typography variant='dataLabel'>Destination Account</Typography>

              <Select
                labelId='transfer-to-label'
                id='transfer-to'
                value={
                  destinationAccount
                    ? destinationAccount
                    : destination_account_id ?? ''
                }
                required
                onChange={handleDestinationAccountChange}
                MenuProps={{
                  PaperProps: { sx: { maxHeight: 300, maxWidth: '100%' } },
                }}
                displayEmpty
                disabled={
                  isLoadingBeneficiaryAccounts ||
                  updateTransactionState.isLoading ||
                  isBookedDeliveredOrInTransit ||
                  isPendingApproval
                }
                input={<BootstrapInput />}
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <Typography
                        variant='dataBody'
                        color={PangeaColors.EarthBlueMedium}
                      >
                        Select
                      </Typography>
                    );
                  }
                  const beneficiary = beneficiaryAccounts.find(
                    ({ beneficiary_id }) => beneficiary_id === selected,
                  );
                  if (beneficiary) {
                    const {
                      beneficiary_name,
                      destination_currency,
                      bank_name,
                    } = beneficiary;
                    return (
                      <TruncatedTypography
                        sx={{
                          maxWidth: 300,
                          fontFamily: 'SuisseIntlCond',
                          fontWeight: 500,
                          fontSize: '1rem',
                        }}
                      >{`${beneficiary_name} - ${destination_currency} - ${bank_name}`}</TruncatedTypography>
                    );
                  }
                  const wallet = allWallets.find(
                    ({ wallet_id }) => wallet_id === selected,
                  );
                  if (wallet) {
                    const { name } = wallet;
                    return (
                      <TruncatedTypography
                        sx={{
                          maxWidth: 300,
                          fontFamily: 'SuisseIntlCond',
                          fontWeight: 500,
                          fontSize: '1rem',
                        }}
                      >
                        {name}
                      </TruncatedTypography>
                    );
                  }
                  return (
                    <TruncatedTypography
                      sx={{
                        maxWidth: 300,
                        fontFamily: 'SuisseIntlCond',
                        fontWeight: 500,
                        fontSize: '1rem',
                      }}
                    >
                      {selected}
                    </TruncatedTypography>
                  );
                }}
              >
                <ListSubheader
                  sx={{
                    backgroundColor: PangeaColors.SolidSlateDarker,
                    color: PangeaColors.LightPrimaryContrast,
                  }}
                  color='inherit'
                >
                  Beneficiaries
                </ListSubheader>
                {beneficiaryAccounts
                  ?.filter(
                    ({ destination_currency }) =>
                      buy_currency === destination_currency,
                  )
                  .map((beneficiary) => {
                    const {
                      beneficiary_id,
                      beneficiary_name,
                      destination_currency,
                      bank_name,
                    } = beneficiary;
                    return (
                      <MenuItem key={beneficiary_id} value={beneficiary_id}>
                        {`${beneficiary_name} - ${destination_currency} - ${bank_name}`}
                      </MenuItem>
                    );
                  })}
                <MenuItem
                  value=''
                  key='add_new_beneficiary'
                  onClick={() => setOpenAddBeneficiaryDialog(true)}
                >
                  <AddIcon /> Add new beneficiary
                </MenuItem>
                <ListSubheader
                  sx={{
                    backgroundColor: PangeaColors.SolidSlateDarker,
                    color: PangeaColors.LightPrimaryContrast,
                  }}
                  color='inherit'
                >
                  Wallets
                </ListSubheader>
                {allWallets
                  ?.filter(({ currency }) => buy_currency === currency)
                  .map((wallet) => {
                    const { wallet_id, name } = wallet;
                    return (
                      <MenuItem key={wallet_id} value={wallet_id}>
                        {name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </Stack>
            <Divider
              variant='fullWidth'
              orientation='horizontal'
              sx={{
                borderColor: PangeaColors.Gray,
              }}
            />
            <Stack
              direction='row'
              alignItems={'center'}
              justifyContent='space-between'
            >
              <Typography variant='dataLabel'>
                Purpose of Payment (Optional)
              </Typography>
              <Select
                labelId='purpose-label'
                id='purpose-of-payment'
                value={
                  purposeOfPayment
                    ? purposeOfPayment
                    : (purpose_of_payment as unknown as string) ?? undefined
                }
                required
                label='Purpose of Payment'
                onChange={handlePurposeOfPaymentChange}
                disabled={
                  isLoadingPurposes ||
                  updateTransactionState.isLoading ||
                  isBookedDeliveredOrInTransit ||
                  isPendingApproval
                }
                displayEmpty
                input={<BootstrapInput />}
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <Typography
                        variant='dataBody'
                        color={PangeaColors.EarthBlueMedium}
                        sx={{ textTransform: 'none' }}
                      >
                        Select purpose
                      </Typography>
                    );
                  }
                  return (
                    <TruncatedTypography
                      sx={{
                        maxWidth: 300,
                        fontFamily: 'SuisseIntlCond',
                        fontWeight: 500,
                        fontSize: '1rem',
                      }}
                    >
                      {allPurposes.find(({ id }) => id == selected)?.text ??
                        selected}
                    </TruncatedTypography>
                  );
                }}
              >
                {allPurposes.map((purpose) => {
                  const { text, id } = purpose;
                  return (
                    <MenuItem key={id} value={id}>
                      {text}
                    </MenuItem>
                  );
                })}
              </Select>
            </Stack>
          </Stack>
        ) : null}
      </RHSAccordion>

      {!isCanceledOrFailed ? (
        <StyledBox>
          <Stack spacing={0}>
            <SummaryDataPoint
              label={`Transaction Amount ${
                isBookedDeliveredOrInTransit ? '' : '*'
              }`}
              value={
                lock_side === buy_currency
                  ? formatCurrency(amount ?? '-', buy_currency, true, 2, 4)
                  : lock_side === sell_currency
                  ? formatCurrency(cntr_amount ?? '-', buy_currency, true, 2, 4)
                  : '-'
              }
            />
            <SummaryDataPoint
              label='Delivery Fee'
              value={`${
                cashflows[0]?.ticket?.delivery_fee !== null
                  ? formatCurrency(
                      cashflows[0]?.ticket?.delivery_fee ?? 0,
                      'USD',
                      false,
                      2,
                      2,
                    )
                  : buy_currency === sell_currency
                  ? formatCurrency(20, 'USD', false, 0, 0)
                  : 'WAIVED'
              }`}
            />
            <SummaryDataPoint
              label={`Total Cost ${isBookedDeliveredOrInTransit ? '' : '*'}`}
              value={
                lock_side === buy_currency
                  ? formatCurrency(
                      cntr_amount ?? '-',
                      sell_currency,
                      true,
                      2,
                      4,
                    )
                  : lock_side == sell_currency
                  ? formatCurrency(amount ?? '-', sell_currency, true, 2, 4)
                  : '-'
              }
            />
          </Stack>
        </StyledBox>
      ) : null}
      {!isBookedDeliveredOrInTransit && !isCanceledOrFailed ? (
        <Typography fontSize='.75rem'>
          * This is not a quote. This is the latest market rate available for
          reference only.
        </Typography>
      ) : null}

      <BeneficaryForm
        open={openAddBeneficiaryDialog}
        setOpen={setOpenAddBeneficiaryDialog}
      />
    </Stack>
  );
};
export default TransactionOverview;
