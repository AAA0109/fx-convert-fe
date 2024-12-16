import { format } from 'date-fns';
import {
  formatExchangeRateMaxFiveDigits,
  setAlpha,
  VolatilityScenario,
} from 'lib';
import { useMemo } from 'react';
import { PangeaColors } from 'styles';
import { VictoryPortal, VictoryTooltip } from 'victory';

export const CustomAreaTooltip = (props: any): Nullable<JSX.Element> => {
  const { x, y, active, datum, volatilityScenario, shouldInvert, leftPadding } =
    props;
  const boundingIndex = useMemo(
    () =>
      volatilityScenario === VolatilityScenario.High
        ? 3
        : volatilityScenario === VolatilityScenario.Medium
        ? 2
        : 1,
    [volatilityScenario],
  );
  if (!active) return null;

  const yUpperRate = !shouldInvert
    ? datum.uppers[boundingIndex] + datum.initial_value
    : 1 / (-datum.uppers[boundingIndex] + datum.initial_value);
  const yLowerRate = !shouldInvert
    ? datum.lowers[boundingIndex] + datum.initial_value
    : 1 / (-datum.lowers[boundingIndex] + datum.initial_value);

  const yUpper = props.scale.y(datum.uppers[boundingIndex]);
  const yLower = props.scale.y(datum.lowers[boundingIndex]);

  return (
    <VictoryPortal>
      <g>
        <line // vertical
          x1={x}
          x2={x}
          y1={10}
          y2={'99%'}
          stroke={PangeaColors.SolidSlateDarker}
          strokeWidth='.5'
          strokeDasharray={'2,2'}
        />
        <line
          x1={leftPadding} // horizontal upper
          x2={'88%'}
          y1={yUpper}
          y2={yUpper}
          stroke={PangeaColors.SolidSlateDarker}
          strokeWidth='.5'
          strokeDasharray={'2,2'}
        />
        <line // horizontal lower
          x1={leftPadding}
          x2={'88%'}
          y1={yLower}
          y2={yLower}
          stroke={PangeaColors.SolidSlateDarker}
          strokeWidth='.5'
          strokeDasharray={'2,2'}
        />
        <circle
          cx={x}
          cy={yUpper}
          r={4}
          fill='rgba(220, 109, 75, 1)'
          stroke='rgba(246, 247, 239, 1)'
          strokeWidth='1.83px'
        />
        <circle
          cx={x}
          cy={yLower}
          r={4}
          fill='rgba(220, 109, 75, 1)'
          stroke='rgba(246, 247, 239, 1)'
          strokeWidth='1.83px'
        />
        <VictoryTooltip // Date
          {...props}
          x={x - 2}
          y={0}
          text={({ datum }: { datum?: any }) =>
            format(datum.date, 'MMM dd, yyyy')
          }
          flyoutStyle={{
            fill: `none`,
            stroke: 'none',
            borderRadius: 'none',
            textAlign: 'left',
          }}
          pointerLength={0}
          style={{
            fontSize: '8px',
            textTransform: 'uppercase',
            fontFamily: 'SuisseIntl',
            fontStyle: 'normal',
            lineHeight: '8px',
            fontWeight: '400',
            fontFeatureSettings: 'pnum',
            paddingLeft: '3px',
            color: setAlpha(PangeaColors.Black, 0.87),
          }}
        />
        <VictoryTooltip //High
          {...props}
          text={({ datum }: { datum?: any }) => {
            if (datum._y != 0) {
              return `High\n${formatExchangeRateMaxFiveDigits(
                yUpperRate,
                true,
              )}`;
            } else return '';
          }}
          pointerLength={0}
          flyoutStyle={{
            fill: `none`,
            stroke: 'none',
            borderRadius: 'none',
            textAlign: 'left',
          }}
          style={{
            fontSize: '8px',
            textAnchor: 'start',
            fontFamily: 'SuisseIntl',
            fontStyle: 'normal',
            fontWeight: '400',
            textTransform: 'uppercase',
          }}
          x={417}
          y={y < 122.5 ? yUpper + 17 : yUpper - 14}
        />
        <VictoryTooltip //Current
          {...props}
          text={({ datum }: { datum?: any }) => {
            if (datum._y == 0) {
              return `Current\n${formatExchangeRateMaxFiveDigits(
                yUpperRate,
                true,
              )}`;
            } else return '';
          }}
          pointerLength={0}
          flyoutStyle={{
            fill: `none`,
            stroke: 'none',
            borderRadius: 'none',
            textAlign: 'left',
          }}
          style={{
            fontSize: '8px',
            textAnchor: 'start',
            fontFamily: 'SuisseIntl',
            fontStyle: 'normal',
            fontWeight: '400',
            textTransform: 'uppercase',
          }}
          x={417}
          y={isNaN(y) ? 0 : y + 15}
        />
        <VictoryTooltip //Low
          {...props}
          text={({ datum }: { datum?: any }) => {
            if (datum._y != 0) {
              return `Low\n${formatExchangeRateMaxFiveDigits(
                yLowerRate,
                true,
              )}`;
            } else return '';
          }}
          pointerLength={0}
          flyoutStyle={{
            fill: `none`,
            stroke: 'none',
            borderRadius: 'none',
            textAlign: 'left',
          }}
          style={{
            fontSize: '8px',
            textAnchor: 'start',
            fontFamily: 'SuisseIntl',
            fontStyle: 'normal',
            fontWeight: '400',
            textTransform: 'uppercase',
          }}
          x={417}
          y={y < 122.5 ? yLower + 17 : yLower - 14}
        />
      </g>
    </VictoryPortal>
  );
};
export default CustomAreaTooltip;
