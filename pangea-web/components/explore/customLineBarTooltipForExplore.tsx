import { Typography } from '@mui/material';
import { setAlpha } from 'lib';
import { PangeaColors } from 'styles';
import { VictoryPortal } from 'victory';

const CustomLineBarTooltipForExplore = (props: any): Nullable<JSX.Element> => {
  const { x, active, datum } = props;

  if (!active || !datum) return null;

  const yPosition = props.scale.y(datum.rate);
  return (
    <VictoryPortal>
      <g>
        <line //vertical line
          x1={x}
          x2={x}
          y1={0}
          y2={'99%'}
          stroke={PangeaColors.SolidSlateDarker}
          strokeWidth='.5'
          strokeDasharray={'2,2'}
        />
        <line //horizontal line
          x1={30}
          x2={x}
          y1={yPosition}
          y2={yPosition}
          stroke={PangeaColors.SolidSlateDarker}
          strokeWidth='.5'
          strokeDasharray={'2,2'}
        />
        <foreignObject x={x - 30} y={-12} width='70px' height='93px'>
          <div className='graph-tooltip'>
            <div>
              <Typography
                sx={{
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
              >
                {datum?.date}
              </Typography>
            </div>
          </div>
        </foreignObject>
      </g>
    </VictoryPortal>
  );
};
export default CustomLineBarTooltipForExplore;
