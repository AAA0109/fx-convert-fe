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
import { hedgeMaxLossThresholdState, hedgeSafeGuardState } from 'atoms';
import { useChartData } from 'hooks';
import { useRecoilState, useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import MultiSlider from './MultiSlider';
type Props = {
  loadingState?: boolean;
  onChange?(riskReduction: Optional<number>, safeguard?: boolean): void;
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

export const ParachuteDetails = ({
  onChange,
  loadingState = false,
}: Props): JSX.Element => {
  const [safeGuard, setSafeGuard] = useRecoilState(hedgeSafeGuardState);
  const maxLoss = useRecoilValue(hedgeMaxLossThresholdState);
  const { riskChartData: chartData } = useChartData({
    riskReduction: undefined,
    selectedAccountId: undefined,
    maxLoss: undefined,
  });

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
        <Stack borderBottom={1} borderColor={PangeaColors.Gray}>
          <ListItemText
            primary={
              <Typography
                sx={{
                  fontSize: '16px',
                  lineHeight: '24px',
                  color: 'rgba(0,0,0,0.87)',
                }}
              >
                Max Loss Threshold
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
                Customize the maximum loss for this hedge. Pangea hedges against
                significant price drops and limits your losses by slowing
                descent into negative price territory as you near your
                threshold.
              </Typography>
            }
          />
          <Box sx={{ width: '70%', paddingLeft: '8px', paddingY: '20px' }}>
            {chartData && (
              <MultiSlider
                minimum={Number(
                  chartData[chartData.length - 1]?.lowers['3'] * (2 / 3),
                )}
                maximum={-0.005}
                value={maxLoss ?? -0.005}
                handleChangeFunc={(newAmt) => {
                  onChange?.(newAmt, safeGuard);
                }}
                disabled={loadingState}
                sign={'negative'}
              />
            )}
          </Box>
        </Stack>
        <Stack direction='row' alignItems='center' paddingTop={1}>
          <ListItemText
            primary={
              <Typography
                sx={{
                  fontSize: '16px',
                  lineHeight: '24px',
                  color: 'rgba(0,0,0,0.87)',
                }}
              >
                Safeguard AI
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
                Our AI fine-tunes Parachute to safeguard gains, but can limit
                peak gains. When off, gains are uncapped, but remain vulnerable
                to volatility.
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
                onChange?.(maxLoss, !safeGuard);
              }}
              checked={safeGuard}
              inputProps={{
                'aria-labelledby': 'switch-list-label-risk-reduction',
              }}
              color='success'
            />
            <Typography variant='caption'>On</Typography>
          </Stack>
        </Stack>
      </ListItem>
    </List>
  );
};
export default ParachuteDetails;
