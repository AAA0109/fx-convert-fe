import {
  Box,
  List,
  ListItem,
  ListItemText,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  hedgeLosspreventionLimitState,
  hedgeLosspreventionTargetState,
  hedgeRiskReductionAmountState,
  hedgeSafeGuardState,
  hedgeSafeGuardTargetState,
} from 'atoms';
import { FeatureFlag } from 'components/shared';
import { useChartData } from 'hooks';
import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import MultiSlider from './MultiSlider';
import { ProtectionSlider } from './ProtectionSlider';
const HARD_LIMITS_FEATURE_FLAG = 'autopilot-hard-limits';
const AUTOPILOT_FEATURE_FLAG = 'autopilot';
type Props = {
  loadingState?: boolean;
  onChange?({
    riskReduction,
    safeGuard,
    safeGuardTarget,
    lossPrevention,
    lossPreventionTarget,
  }: {
    riskReduction: Optional<number>;
    safeGuard: Optional<boolean>;
    safeGuardTarget: Optional<number>;
    lossPrevention: Optional<boolean>;
    lossPreventionTarget: Optional<number>;
  }): void;
};

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor:
          theme.palette.mode === 'dark'
            ? '#177ddc'
            : PangeaColors.SecurityGreenMedium,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255,255,255,.35)'
        : 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
  },
}));

export const AutoPilotDetails = ({
  onChange,
  loadingState = false,
}: Props): JSX.Element => {
  const [checked, setChecked] = useState<Array<string>>([]);
  const riskReduction = useRecoilValue(hedgeRiskReductionAmountState);
  const [safeGuard, setSafeGuard] = useRecoilState(hedgeSafeGuardState);
  const [safeGuardTaget, setSafeGuardTarget] = useRecoilState(
    hedgeSafeGuardTargetState,
  );
  const [lossPrevention, setLossPrevention] = useRecoilState(
    hedgeLosspreventionLimitState,
  );
  const [lossPreventionTaget, setLossPreventionTaget] = useRecoilState(
    hedgeLosspreventionTargetState,
  );

  const { riskChartData: chartData } = useChartData({
    riskReduction: undefined,
    selectedAccountId: undefined,
    maxLoss: undefined,
  });
  const handleRiskReductionChange = (newAmt: number) => {
    if (newAmt == 1) {
      onChange?.({
        riskReduction: newAmt,
        safeGuard: false,
        safeGuardTarget: 0.005,
        lossPrevention: false,
        lossPreventionTarget: -0.005,
      });
      setSafeGuardTarget(0.005);
      setLossPreventionTaget(-0.005);
      setSafeGuard(false);
      setLossPrevention(false);
    } else {
      onChange?.({
        riskReduction: newAmt,
        safeGuard,
        safeGuardTarget: safeGuardTaget,
        lossPrevention,
        lossPreventionTarget: lossPreventionTaget,
      });
    }
  };
  const isRiskReductionEnabled = checked.indexOf('risk-reduction') !== -1;
  // const isHardLimitsEnabled = checked.indexOf('hard-limits') !== -1;
  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  return (
    <List
      sx={{
        marginTop: '32px!important',
        border: `1px solid ${PangeaColors.Gray}`,
        borderRadius: '4px',
        padding: 0,
      }}
    >
      <ListItem
        divider
        alignItems='flex-start'
        sx={{
          padding: '16px',
          flexDirection: 'column',
        }}
      >
        <Stack
          borderBottom={1}
          borderColor={PangeaColors.Gray}
          paddingBottom={1}
        >
          <Stack direction='row' alignItems='center'>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: 'rgba(0,0,0,0.87)',
                  }}
                >
                  Risk Reduction
                </Typography>
              }
              secondary={
                <Typography
                  variant='body2'
                  sx={{
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: 'rgba(0,0,0,0.6)',
                  }}
                >
                  Select the percentage of your cash flow you&apos;d like to
                  hedge now.
                </Typography>
              }
            />
            <FeatureFlag
              name={[HARD_LIMITS_FEATURE_FLAG, AUTOPILOT_FEATURE_FLAG]}
            >
              <Stack
                direction='row'
                spacing={1}
                alignItems='center'
                sx={{ marginLeft: '24px' }}
              >
                <Typography variant='caption'>Off</Typography>
                <AntSwitch
                  edge='end'
                  onChange={handleToggle('risk-reduction')}
                  checked={isRiskReductionEnabled}
                  inputProps={{
                    'aria-labelledby': 'switch-list-label-risk-reduction',
                  }}
                  color='success'
                />
                <Typography variant='caption'>On</Typography>
              </Stack>
            </FeatureFlag>
          </Stack>
          <FeatureFlag
            name={[HARD_LIMITS_FEATURE_FLAG, AUTOPILOT_FEATURE_FLAG]}
            fallback={
              <Box sx={{ width: '35%', paddingLeft: '8px' }}>
                <ProtectionSlider
                  value={riskReduction ?? 0}
                  onRiskChange={handleRiskReductionChange}
                  disabled={loadingState}
                />
              </Box>
            }
          >
            {isRiskReductionEnabled && (
              <Box sx={{ width: '50%', paddingLeft: '8px' }}>
                <ProtectionSlider
                  value={riskReduction ?? 0}
                  onRiskChange={handleRiskReductionChange}
                  disabled={loadingState}
                />
              </Box>
            )}
          </FeatureFlag>
        </Stack>
        <FeatureFlag name={[HARD_LIMITS_FEATURE_FLAG, AUTOPILOT_FEATURE_FLAG]}>
          <Stack
            borderBottom={1}
            borderColor={PangeaColors.Gray}
            paddingBottom={1}
          >
            <Stack direction='row' alignItems='center'>
              <ListItemText
                primary={
                  <Typography
                    sx={{
                      fontSize: '16px',
                      lineHeight: '24px',
                      color: 'rgba(0,0,0,0.87)',
                    }}
                  >
                    Safeguard Target
                  </Typography>
                }
                secondary={
                  <Typography
                    variant='body2'
                    sx={{
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: 'rgba(0,0,0,0.6)',
                    }}
                  >
                    Protect gains should the total value of the cash flow reach
                    the target. When off, unhedged gains are uncapped, but
                    remain subject to volatility.
                  </Typography>
                }
              />
              <Stack
                direction='row'
                spacing={1}
                alignItems='center'
                sx={{ marginLeft: '24px' }}
              >
                <Typography variant='caption'>Off</Typography>
                <AntSwitch
                  edge='end'
                  onChange={() => {
                    setSafeGuard(!safeGuard);
                    onChange?.({
                      riskReduction,
                      safeGuard: !safeGuard,
                      safeGuardTarget: safeGuardTaget,
                      lossPrevention,
                      lossPreventionTarget: lossPreventionTaget,
                    });
                  }}
                  disabled={riskReduction === 1}
                  checked={safeGuard}
                  inputProps={{
                    'aria-labelledby': 'switch-list-label-risk-reduction',
                  }}
                  color='success'
                />
                <Typography variant='caption'>On</Typography>
              </Stack>
            </Stack>
            {safeGuard && (
              <Stack>
                <Box
                  sx={{ width: '70%', paddingLeft: '8px', paddingY: '20px' }}
                >
                  {chartData && (
                    <MultiSlider
                      sign='positive'
                      minimum={0.005}
                      maximum={Number(
                        (
                          chartData[chartData.length - 1]?.uppers['2'] ?? 0
                        ).toFixed(3),
                      )}
                      value={safeGuardTaget ?? 0}
                      handleChangeFunc={(val) => {
                        setSafeGuardTarget(val);
                        onChange?.({
                          riskReduction,
                          safeGuard,
                          safeGuardTarget: val,
                          lossPrevention,
                          lossPreventionTarget: lossPreventionTaget,
                        });
                      }}
                      disabled={loadingState}
                    />
                  )}
                </Box>
              </Stack>
            )}
          </Stack>
          <Stack paddingBottom={1}>
            <Stack direction='row' alignItems='center'>
              <ListItemText
                primary={
                  <Typography
                    sx={{
                      fontSize: '16px',
                      lineHeight: '24px',
                      color: 'rgba(0,0,0,0.87)',
                    }}
                  >
                    Loss Prevention Limit
                  </Typography>
                }
                secondary={
                  <Typography
                    variant='body2'
                    sx={{
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: 'rgba(0,0,0,0.6)',
                    }}
                  >
                    Safeguards against further losses should the total value of
                    the cash flow reach the loss limit.
                  </Typography>
                }
              />
              <Stack
                direction='row'
                spacing={1}
                alignItems='center'
                sx={{ marginLeft: '24px' }}
              >
                <Typography variant='caption'>Off</Typography>
                <AntSwitch
                  edge='end'
                  onChange={() => {
                    setLossPrevention(!lossPrevention);
                    onChange?.({
                      riskReduction,
                      safeGuard,
                      safeGuardTarget: safeGuardTaget,
                      lossPrevention: !lossPrevention,
                      lossPreventionTarget: lossPreventionTaget,
                    });
                  }}
                  disabled={riskReduction === 1}
                  checked={lossPrevention}
                  inputProps={{
                    'aria-labelledby': 'switch-list-label-risk-reduction',
                  }}
                  color='success'
                />
                <Typography variant='caption'>On</Typography>
              </Stack>
            </Stack>
            {lossPrevention && (
              <Stack>
                <Box
                  sx={{ width: '70%', paddingLeft: '8px', paddingY: '20px' }}
                >
                  {chartData && (
                    <MultiSlider
                      sign='negative'
                      minimum={Number(
                        chartData[chartData.length - 1]?.lowers['2'] ?? 0,
                      )}
                      maximum={-0.005}
                      value={lossPreventionTaget ?? 0}
                      handleChangeFunc={(val) => {
                        setLossPreventionTaget(val);
                        onChange?.({
                          riskReduction,
                          safeGuard,
                          safeGuardTarget: safeGuardTaget,
                          lossPrevention,
                          lossPreventionTarget: val,
                        });
                      }}
                      disabled={loadingState}
                    />
                  )}
                </Box>
              </Stack>
            )}
          </Stack>
        </FeatureFlag>
      </ListItem>
      {/* <FeatureFlag name={[HARD_LIMITS_FEATURE_FLAG, AUTOPILOT_FEATURE_FLAG]}>
        <ListItem
          alignItems='flex-start'
          sx={{
            padding: '16px',
            flexDirection: 'column',
          }}
        >
          <Stack direction='row' alignItems='center'>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: 'rgba(0,0,0,0.87)',
                  }}
                >
                  Hard Limits
                </Typography>
              }
              secondary={
                <Typography
                  variant='body2'
                  sx={{
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: 'rgba(0,0,0,0.6)',
                  }}
                >
                  Customize the upper and lower value you desire to cap losses
                  or gains on the entire cash flow.
                </Typography>
              }
            />
            <Stack
              direction='row'
              spacing={1}
              alignItems='center'
              sx={{ marginLeft: '24px' }}
            >
              <Typography variant='caption'>Off</Typography>
              <AntSwitch
                edge='end'
                onChange={handleToggle('hard-limits')}
                checked={isHardLimitsEnabled}
                inputProps={{
                  'aria-labelledby': 'switch-list-label-hard-limits',
                }}
              />
              <Typography variant='caption'>On</Typography>
            </Stack>
          </Stack>

          {isHardLimitsEnabled && (
            <Stack direction='row' mt={2}>
              <FormControl>
                <InputLabel size='small' variant='outlined' shrink>
                  Upper cap
                </InputLabel>
                <OutlinedInput
                  type='number'
                  label='Upper Cap'
                  aria-label='Upper Cap'
                  inputProps={{
                    sx: {
                      textAlign: 'center',
                      maxWidth: '95px',
                      padding: '12px',
                    },
                  }}
                  startAdornment={
                    <TrendingUpIcon
                      sx={{
                        borderTop: `2px solid ${PangeaColors.SecurityGreenMedium}`,
                        borderBottom: `2px dashed ${PangeaColors.Black}`,
                      }}
                    />
                  }
                />
              </FormControl>
              <FormControl
                sx={{
                  marginLeft: '16px',
                }}
              >
                <InputLabel size='small' variant='outlined' shrink>
                  Lower cap
                </InputLabel>
                <OutlinedInput
                  type='number'
                  label='Lower Cap'
                  aria-label='Lower Cap'
                  inputProps={{
                    sx: {
                      textAlign: 'center',
                      maxWidth: '95px',
                      padding: '12px',
                    },
                  }}
                  startAdornment={
                    <TrendingDownIcon
                      sx={{
                        borderBottom: `2px solid ${PangeaColors.RiskBerryMedium}`,
                        borderTop: `2px dashed ${PangeaColors.Black}`,
                      }}
                    />
                  }
                />
              </FormControl>
            </Stack>
          )}
        </ListItem>
      </FeatureFlag> */}
    </List>
  );
};
export default AutoPilotDetails;
