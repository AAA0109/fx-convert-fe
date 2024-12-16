import { PangeaColors } from 'styles';
import { VictoryPortal, VictoryTooltip } from 'victory';

export const CustomLineBarTooltip = (props: any): Nullable<JSX.Element> => {
  const { x, active, datum } = props;
  if (!active) return null;

  return (
    <VictoryPortal>
      <g>
        <line
          x1={x}
          x2={x}
          y1={'5%'}
          y2={'95%'}
          stroke='#000'
          strokeWidth='.5'
        />
        <VictoryTooltip
          active={active}
          datum={datum}
          text={({ datum }: { datum?: any }) => {
            if (datum.date) {
              return `${new Date(datum.date).toLocaleDateString()}`;
            }
            if (datum._x) {
              return `${new Date(datum._x).toLocaleDateString()}`;
            } else return '';
          }}
          pointerLength={0}
          flyoutStyle={{
            fill: `${PangeaColors.StoryWhiteMedium}`,
            stroke: 'none',
            borderRadius: 'none',
          }}
          style={{
            fontSize: '12px',
            textAnchor: 'start',
            fontFamily: 'SuisseNeue',
            fontStyle: 'normal',
            fontWeight: '400',
            textTransform: 'uppercase',
            padding: 2,
          }}
          x={x}
          y={20}
          dx={30}
        />
      </g>
    </VictoryPortal>
  );
};
export default CustomLineBarTooltip;
