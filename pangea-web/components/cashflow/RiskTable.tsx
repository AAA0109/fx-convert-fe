import {
  Chip,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { domesticCurrencyState, graphHoverDataState } from 'atoms';
import { useChartData } from 'hooks';
import { formatCurrency } from 'lib';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
type Props = {
  accountId?: number;
  riskReduction?: number;
};
function SkeletonLoader() {
  return (
    <Skeleton
      variant='rounded'
      height={18}
      width={100}
      sx={{ display: 'inline-block' }}
    />
  );
}
export const RiskTable = ({ accountId, riskReduction }: Props) => {
  const hoverData = useRecoilValue(graphHoverDataState);

  const { riskChartData } = useChartData({
    riskReduction: accountId,
    selectedAccountId: riskReduction,
    maxLoss: undefined,
  });
  const domesticCurrency = useRecoilValue(domesticCurrencyState);
  if (!riskChartData) {
    return <></>;
  }
  const chartData = (num: number) => {
    return riskChartData[riskChartData.length - 1]?.uppers[num];
  };

  return (
    <TableContainer>
      <Table aria-label='table of volatility risk' size='small'>
        <TableHead>
          <TableRow>
            <TableCell>Probability</TableCell>
            <TableCell>Volatility</TableCell>
            <TableCell align='right'>Gain (+) or Loss (-)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>&le; 32%</TableCell>
            <TableCell>
              {isNaN(chartData(1) * 100) ? (
                <SkeletonLoader />
              ) : (
                <Chip
                  sx={{
                    borderRadius: '8px',
                    color: 'black',
                    backgroundColor: PangeaColors.SecurityGreenLight,
                  }}
                  label={`${(chartData(1) * 100).toFixed(1)}% or less`}
                />
              )}
            </TableCell>
            <TableCell align='right'>
              {isNaN(chartData(1) * (hoverData?.initialValue ?? 0)) ? (
                <SkeletonLoader />
              ) : (
                <>
                  {formatCurrency(
                    chartData(1) * (hoverData?.initialValue ?? 0),
                    domesticCurrency,
                    true,
                    0,
                    0,
                    true,
                  )}{' '}
                  or less
                </>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>&le; 5%</TableCell>
            <TableCell>
              {isNaN(chartData(2) * 100) ? (
                <SkeletonLoader />
              ) : (
                <Chip
                  sx={{
                    borderRadius: '8px',
                    color: 'black',
                    backgroundColor: PangeaColors.CautionYellowLight,
                  }}
                  label={`${(chartData(2) * 100).toFixed(1)}% or less`}
                />
              )}
            </TableCell>
            <TableCell align='right'>
              {isNaN(chartData(2) * (hoverData?.initialValue ?? 0)) ? (
                <SkeletonLoader />
              ) : (
                <>
                  {formatCurrency(
                    chartData(2) * (hoverData?.initialValue ?? 0),
                    domesticCurrency,
                    true,
                    0,
                    0,
                    true,
                  )}{' '}
                  or less
                </>
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>&le; 1%</TableCell>
            <TableCell>
              {isNaN(chartData(3) * 100) ? (
                <SkeletonLoader />
              ) : (
                <Chip
                  sx={{
                    borderRadius: '8px',
                    color: 'black',
                    backgroundColor: PangeaColors.RiskBerryLight,
                  }}
                  label={`${(chartData(3) * 100).toFixed(1)}% or more`}
                />
              )}
            </TableCell>
            <TableCell align='right'>
              {isNaN(chartData(3) * (hoverData?.initialValue ?? 0)) ? (
                <SkeletonLoader />
              ) : (
                <>
                  {formatCurrency(
                    chartData(3) * (hoverData?.initialValue ?? 0),
                    domesticCurrency,
                    true,
                    0,
                    0,
                    true,
                  )}{' '}
                  or more
                </>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default RiskTable;
