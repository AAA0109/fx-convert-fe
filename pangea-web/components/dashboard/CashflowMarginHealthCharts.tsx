import { Box, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { marginAndCreditHealthState } from 'atoms';
import { formatCurrency } from 'lib';
import { useRecoilValueLoadable } from 'recoil';
import { PangeaColors } from 'styles';

export const CashflowMarginHealthCharts = () => {
  const creditAndMarginDataLoadable = useRecoilValueLoadable(
    marginAndCreditHealthState,
  );
  const creditAndMarginData =
    creditAndMarginDataLoadable.state === 'hasValue'
      ? creditAndMarginDataLoadable.contents
      : null;

  return (
    <Grid container columnSpacing={4} marginY={5}>
      <Grid item xs={12} md={6}>
        <Typography variant='h4' component='h1' marginBottom={2}>
          Credit Utilization
        </Typography>
        <Box
          sx={{
            py: 2,
            px: 3,
            borderRadius: 1,
            border: `1px solid ${PangeaColors.Gray}`,
          }}
        >
          <Stack
            direction='row'
            justifyContent='flex-start'
            alignItems='flex-start'
            gap='32px'
            width='100%'
          >
            <Stack>
              <Typography variant='dataLabel'>Position Limit</Typography>
              <Typography variant='h5'>
                {creditAndMarginData ? (
                  formatCurrency(
                    creditAndMarginData.creditLimit,
                    'USD',
                    true,
                    0,
                    0,
                    Math.abs(creditAndMarginData.creditLimit) > 999999,
                  )
                ) : (
                  <Skeleton variant='rectangular' width={80} height={32} />
                )}
              </Typography>
            </Stack>
            <Stack>
              <Typography variant='dataLabel'>Market Positions</Typography>
              <Typography variant='h5'>
                {creditAndMarginData ? (
                  formatCurrency(
                    creditAndMarginData.inMarketValue,
                    'USD',
                    true,
                    0,
                    0,
                    Math.abs(creditAndMarginData.inMarketValue) > 999999,
                  )
                ) : (
                  <Skeleton variant='rectangular' width={80} height={32} />
                )}
              </Typography>
            </Stack>
            <Stack>
              <Typography variant='dataLabel'>Utilization</Typography>
              <Typography variant='h5'>
                {creditAndMarginData ? (
                  Number(creditAndMarginData.utilization).toFixed(2) + '%'
                ) : (
                  <Skeleton variant='rectangular' width={80} height={32} />
                )}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction='row' marginTop={2}>
            {creditAndMarginData ? (
              <>
                <Box
                  height={27}
                  width={`${
                    creditAndMarginData
                      ? Math.floor(creditAndMarginData.utilization)
                      : 0
                  }%`}
                  sx={{
                    display: 'inline-block',
                    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 4px, ${
                      creditAndMarginData
                        ? creditAndMarginData.creditHealthColor
                        : ''
                    } 4px, ${
                      creditAndMarginData
                        ? creditAndMarginData.creditHealthColor
                        : ''
                    } 15px)`,
                    backgroundColor: PangeaColors.StoryWhiteMedium,
                  }}
                ></Box>
                <Box
                  height={27}
                  width={`${
                    creditAndMarginData
                      ? 100 - Math.floor(creditAndMarginData.utilization)
                      : 0
                  }%`}
                  sx={{
                    display: 'inline-block',
                    backgroundColor: PangeaColors.Gray,
                  }}
                ></Box>
              </>
            ) : (
              <Skeleton variant='rectangular' width='100%' height={32} />
            )}
          </Stack>
          <Stack direction='row' justifyContent='space-between' marginTop={1}>
            <Typography variant='small'>
              {creditAndMarginData ? '$0' : ''}
            </Typography>
            <Typography variant='small'>
              {creditAndMarginData
                ? formatCurrency(
                    creditAndMarginData.creditLimit,
                    'USD',
                    true,
                    0,
                    0,
                    creditAndMarginData.creditLimit > 999999,
                  )
                : null}
            </Typography>
          </Stack>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant='h4' component='h1' marginBottom={2}>
          Margin Health
        </Typography>

        <Box
          sx={{
            py: 2,
            px: 3,
            borderRadius: 1,
            border: `1px solid ${PangeaColors.Gray}`,
          }}
        >
          <Stack
            direction='row'
            justifyContent='flex-start'
            alignItems='flex-start'
            gap='32px'
            width='100%'
          >
            <Stack>
              <Typography variant='dataLabel'>Margin Call Risk</Typography>
              <Typography variant='h5'>
                {creditAndMarginData ? (
                  creditAndMarginData.marginCallRisk
                ) : (
                  <Skeleton variant='rectangular' width={80} height={32} />
                )}
              </Typography>
            </Stack>
            <Stack>
              <Typography variant='dataLabel'>
                Mark to Market P&amp;L
              </Typography>
              <Typography variant='h5'>
                {creditAndMarginData ? (
                  formatCurrency(
                    creditAndMarginData.markToMarketPnl,
                    'USD',
                    true,
                    0,
                    0,
                    Math.abs(creditAndMarginData.markToMarketPnl) > 999999,
                  )
                ) : (
                  <Skeleton variant='rectangular' width={80} height={32} />
                )}
              </Typography>
            </Stack>
            <Stack>
              <Typography variant='dataLabel'>Margin Call At</Typography>
              <Typography variant='h5'>
                {creditAndMarginData ? (
                  formatCurrency(
                    creditAndMarginData.marginCallAt,
                    'USD',
                    true,
                    0,
                    2,
                    Math.abs(creditAndMarginData.marginCallAt) > 999999,
                  )
                ) : (
                  <Skeleton variant='rectangular' width={80} height={32} />
                )}
              </Typography>
            </Stack>
          </Stack>
          {creditAndMarginData ? (
            <Stack
              direction='row'
              marginTop={2}
              sx={{
                width: '100%',
                height: '27px',
                position: 'relative',
                backgroundColor: PangeaColors.Gray,
              }}
            >
              <Box
                height={27}
                sx={{
                  display: 'inline-block',
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 4px, ${
                    creditAndMarginData
                      ? creditAndMarginData.marginCallRiskColor
                      : ''
                  } 4px, ${
                    creditAndMarginData
                      ? creditAndMarginData.marginCallRiskColor
                      : ''
                  } 15px)`,
                  backgroundColor: PangeaColors.StoryWhiteMedium,
                  borderRight: `2px solid ${PangeaColors.SolidSlateDarker}`,
                  position: 'absolute',
                  transform: `${
                    creditAndMarginData.markToMarketPnl > 0
                      ? 'rotate(180deg)'
                      : 'unset'
                  }`,
                  right: `${
                    creditAndMarginData.markToMarketPnl > 0
                      ? calculateChartRight(
                          creditAndMarginData.markToMarketPnl,
                          creditAndMarginData.marginCallAt,
                        ) + '%'
                      : '30%'
                  }`,
                  left: `${
                    creditAndMarginData.markToMarketPnl > 0
                      ? '68% '
                      : calculateChartLeft(
                          creditAndMarginData.markToMarketPnl,
                          creditAndMarginData.marginCallAt,
                        ) + '%'
                  }`,
                }}
              ></Box>
            </Stack>
          ) : (
            <Skeleton
              variant='rectangular'
              width='100%'
              height={32}
              sx={{ marginTop: '1rem' }}
            />
          )}
          <Stack direction='row' marginTop={1} position='relative'>
            <Typography variant='small'>
              {creditAndMarginData
                ? formatCurrency(
                    creditAndMarginData.marginCallAt,
                    'USD',
                    true,
                    0,
                    2,
                    Math.abs(creditAndMarginData.marginCallAt) > 999999,
                  )
                : null}
            </Typography>
            <Typography
              variant='small'
              textAlign='right'
              sx={{ position: 'absolute', right: '30%' }}
            >
              {creditAndMarginData ? '$0' : ''}
            </Typography>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
};

function calculateChartLeft(pnl: number, marginCallAt: number): number {
  if (pnl < marginCallAt) {
    return 0;
  }
  return 70 * (1 - (pnl - 0) / (marginCallAt - 0));
}

function calculateChartRight(pnl: number, marginCallAt: number): number {
  if (pnl > 0.3 * Math.abs(marginCallAt)) {
    return 0;
  }
  return 30 * (1 - pnl / (0.3 * Math.abs(marginCallAt)));
}

export default CashflowMarginHealthCharts;
