// import {
//   RadioButtonChecked,
//   RadioButtonUnchecked,
//   WarningAmberRounded,
// } from '@mui/icons-material';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import {
//   Alert,
//   AlertTitle,
//   Box,
//   Checkbox,
//   IconButton,
//   MenuItem,
//   MenuList,
//   Stack,
//   Typography,
// } from '@mui/material';
// import { clientApiState } from 'atoms';
// import { PangeaLoading } from 'components/shared';
// import { useCacheableAsyncData, useWalletAndPaymentHelpers } from 'hooks';
// import useTimingOptions from 'hooks/useTimingOptions';
// import { isError } from 'lodash';
// import { useMemo } from 'react';
// import { useRecoilValue } from 'recoil';
// import { PangeaColors } from 'styles';
// import ExecutionGraph from './ExecutionGraph';

// eslint-disable-next-line no-empty-pattern
export const ExecutionDetails = ({}: {
  mode: 'transfer' | 'payment' | 'withdraw' | 'deposit';
}): JSX.Element => {
  return <></>;
  // const {
  //   executionTiming,
  //   setExecutionTiming,
  //   corPayQuotePaymentResponse: spotRateData,
  // } = useWalletAndPaymentHelpers();

  // const api = useRecoilValue(clientApiState);
  // const apiHelper = api.getAuthenticatedApiHelper();

  // const isSameCurrency = useMemo(() => {
  //   return spotRateData?.payment.currency === spotRateData?.settlement.currency;
  // }, [spotRateData]);

  // const {
  //   data: timingOptions,
  //   isLoading,
  //   isRefetching,
  //   isError: isAsyncError,
  //   isLoadingError,
  //   refetchData: handleRefresh,
  // } = useCacheableAsyncData('executionTimingOptions', async () => {
  //   return await apiHelper.getAllExecutionTimingOptionsAsync({
  //     from_currency: spotRateData?.settlement.currency ?? 'USD',
  //     to_currency: spotRateData?.payment.currency ?? 'USD',
  //     instrument_type: PangeaInstrumentTypeEnum.Spot,
  //     broker_id: 2,
  //     amount: spotRateData?.payment.amount ?? 0,
  //   });
  // });

  // const [hasAllOptions, hasOnlyNow, hasNowAndToday, hasNowAndTomorrow] =
  //   useTimingOptions(timingOptions);

  // const messageMap: Record<string, { message: string; color: string }> =
  //   useMemo(
  //     () => ({
  //       now: {
  //         message: 'Execute immediately with rate established in next step.',
  //         color: hasOnlyNow
  //           ? PangeaColors.CautionYellowDark
  //           : hasNowAndToday
  //           ? PangeaColors.SolidSlateLight
  //           : PangeaColors.SolidSlateLight,
  //       },
  //       today: {
  //         message: "Strategically executes before today's bank cutoff.",
  //         color: hasAllOptions
  //           ? PangeaColors.CautionYellowDark
  //           : hasNowAndToday
  //           ? PangeaColors.SecurityGreenDark
  //           : PangeaColors.SolidSlateLight,
  //       },
  //       tomorrow: {
  //         message: "Strategically executes before tomorrow's bank cutoff.",
  //         color:
  //           hasAllOptions || hasNowAndTomorrow
  //             ? PangeaColors.SecurityGreenDark
  //             : PangeaColors.SolidSlateLight,
  //       },
  //     }),
  //     [hasAllOptions, hasNowAndToday, hasNowAndTomorrow, hasOnlyNow],
  //   );

  // if (isLoading || isRefetching) {
  //   return (
  //     <Stack minHeight={500}>
  //       <PangeaLoading loadingPhrase='Loading timing options...' centerPhrase />
  //     </Stack>
  //   );
  // }
  // if (
  //   isError(timingOptions) ||
  //   isAsyncError ||
  //   isLoadingError ||
  //   !timingOptions
  // ) {
  //   return (
  //     <Box
  //       minHeight={500}
  //       display='flex'
  //       justifyContent='center'
  //       alignItems='center'
  //     >
  //       <Alert severity='error'>
  //         <AlertTitle>Error</AlertTitle>
  //         Something went wrong. Please try again.
  //         <IconButton
  //           aria-label='Refresh'
  //           color='inherit'
  //           size='small'
  //           onClick={() => handleRefresh()}
  //         >
  //           <RefreshIcon />
  //         </IconButton>
  //       </Alert>
  //     </Box>
  //   );
  // }

  // return (
  //   <Stack spacing={3}>
  //     <Stack
  //       borderBottom={2}
  //       borderColor={PangeaColors.SolidSlateMediumSemiTransparent08}
  //       paddingBottom={2}
  //       spacing={1}
  //     >
  //       {isSameCurrency ? (
  //         <Typography>
  //           Same currency transactions are executed as soon as possible.
  //           Delivery date is dependent on bank cutoff and delivery times.
  //         </Typography>
  //       ) : (
  //         <>
  //           <Typography
  //             typography={'body'}
  //             color={PangeaColors.SecurityGreenDark}
  //             data-testid='execution-details-title'
  //           >
  //             Strategic Execution
  //           </Typography>
  //           <Typography
  //             typography={'body2'}
  //             color={PangeaColors.BlackSemiTransparent99}
  //           >
  //             Pangea&apos;s AI analyzes liquidity & volatility to automatically
  //             execute payments at the most cost efficient time.
  //           </Typography>
  //           <Box
  //             bgcolor={PangeaColors.StoryWhiteMedium}
  //             paddingY={3}
  //             paddingX={2}
  //           >
  //             <Typography typography={'h6'} style={{ lineHeight: '24px' }}>
  //               Pangea’s AI has determined the optimal time(s) to execute this
  //               payment. Our AI may execute this sooner if market conditions
  //               change.
  //             </Typography>
  //             <Stack paddingTop={8} paddingX={2}>
  //               <ExecutionGraph data={timingOptions.execution_time_timeline} />
  //             </Stack>
  //           </Box>
  //         </>
  //       )}
  //     </Stack>

  //     <Stack spacing={2}>
  //       <Typography>Select your execution timing:</Typography>
  //       <Stack spacing={2}>
  //         <MenuList
  //           sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}
  //           data-testid='timing-options-list'
  //         >
  //           {timingOptions.execution_time_options.map(
  //             ({
  //               id,
  //               estimated_saving_bps,
  //               label,
  //               delivery_date,
  //               wait_condition,
  //             }) => {
  //               return (
  //                 <MenuItem
  //                   onClick={() => {
  //                     setExecutionTiming({
  //                       id,
  //                       estimated_saving_bps: estimated_saving_bps,
  //                       delivery_date,
  //                       wait_condition,
  //                     });
  //                   }}
  //                   key={id}
  //                   sx={{ width: '100%', p: 0, borderRadius: 2 }}
  //                 >
  //                   <Stack
  //                     direction='row'
  //                     justifyContent={'space-between'}
  //                     alignItems={'start'}
  //                     spacing={1}
  //                     p={2}
  //                     borderRadius={2}
  //                     border={2}
  //                     borderColor={
  //                       PangeaColors.SolidSlateMediumSemiTransparent08
  //                     }
  //                     sx={{ cursor: 'pointer', width: '100%' }}
  //                     bgcolor={
  //                       executionTiming?.id === id
  //                         ? PangeaColors.SolidSlateMediumSemiTransparent08
  //                         : ''
  //                     }
  //                   >
  //                     <Stack>
  //                       <Typography
  //                         typography={'body'}
  //                         color={PangeaColors.BlackSemiTransparent87}
  //                       >
  //                         {label}
  //                       </Typography>
  //                       <Typography
  //                         color={PangeaColors.SolidSlateLight}
  //                         typography={'body2'}
  //                       >
  //                         {messageMap[id]?.message ?? ''}
  //                       </Typography>
  //                       <Typography
  //                         color={PangeaColors.SolidSlateLight}
  //                         typography={'body2'}
  //                       >
  //                         Delivery date:{' '}
  //                         {new Date(delivery_date).toLocaleDateString()}
  //                       </Typography>
  //                       <Typography
  //                         typography={'body2'}
  //                         color={messageMap[id]?.color}
  //                       >
  //                         Estimated savings:{' '}
  //                         {estimated_saving_bps !== null
  //                           ? `${estimated_saving_bps} bps`
  //                           : '-'}
  //                       </Typography>
  //                     </Stack>
  //                     <Checkbox
  //                       checked={executionTiming?.id === id}
  //                       icon={<RadioButtonUnchecked />}
  //                       checkedIcon={<RadioButtonChecked />}
  //                     />
  //                   </Stack>
  //                 </MenuItem>
  //               );
  //             },
  //           )}
  //         </MenuList>
  //       </Stack>
  //       {mode === 'transfer' && (
  //         <Stack direction={'row'} spacing={1}>
  //           <WarningAmberRounded
  //             style={{ color: PangeaColors.WarmOrangeMedium }}
  //           />
  //           <Typography
  //             color={PangeaColors.BlackSemiTransparent87}
  //             typography={'small'}
  //             style={{ fontSize: '12px' }}
  //           >
  //             Note: If this transfer is being used to support a payment, please
  //             use the “Send a Payment” flow to validate that funds will be
  //             available in time for your payment.
  //           </Typography>
  //         </Stack>
  //       )}
  //       <Typography typography={'small'} color={PangeaColors.SolidSlateLight}>
  //         Strategic Execution achieves an average savings of 50% off interbank
  //         spreads.
  //       </Typography>
  //     </Stack>
  //   </Stack>
  // );
};

export default ExecutionDetails;
