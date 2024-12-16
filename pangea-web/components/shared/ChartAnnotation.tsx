import { add } from 'date-fns';
import { PangeaColors } from 'styles';
import { VictoryLine, VictoryLineProps } from 'victory';
import { ChartAnnotationProps } from './ChartAnnotationProps';
import { DataLabel } from './DataLabel';

export const ChartAnnotation = (props: ChartAnnotationProps) => {
  const {
    lineX,
    bottomLineY,
    topLineY,
    lineWidth,
    offset,
    text,
    labelPosition = 'middle',
    adjustLabelPosition = false,
  } = props;
  let labelY: number;
  let labelDY: number;
  switch (labelPosition) {
    case 'middle':
      labelY = (topLineY + bottomLineY) / 2;
      labelDY = 0;
      break;
    case 'top':
      labelY = topLineY;
      labelDY = 10;
      break;
    case 'bottom':
      labelY = bottomLineY;
      labelDY = -10;
      break;
  }

  /*
    x0,y0 is bottom left corner,
    x1,y0 is bottom right corner,
    x0,y1 is top left corner,
    x1,y1 is top right corner,
  */
  const width = offset + lineWidth;
  const x0 = add(lineX, { hours: offset * 24 });
  const x1 = add(lineX, { hours: width * 24 });
  const y0 = bottomLineY;
  const y1 = topLineY;
  const lineProps: VictoryLineProps = {
    ...props,
    scale: { x: 'time', y: 'linear' },
    standalone: false,
    style: {
      data: {
        stroke: PangeaColors.Black,
        strokeWidth: 1.3,
      },
    },
  };
  return (
    <g>
      <VictoryLine // bottom line
        data={[
          { x: x0, y: y0 },
          { x: x1, y: y0 },
        ]}
        {...lineProps}
      />
      <VictoryLine // top line
        data={[
          { x: x0, y: y1 },
          { x: x1, y: y1 },
        ]}
        {...lineProps}
      />
      <VictoryLine // vertical line
        data={[
          { x: x1, y: y1 },
          { x: x1, y: y0 },
        ]}
        {...lineProps}
      />
      <DataLabel // text label
        {...props}
        x={x1}
        y={labelY}
        dx={adjustLabelPosition ? 20 : 5}
        dy={labelDY}
        text={text}
        style={[
          {
            fontFamily: 'SuisseNeue', // does not work without embedding the font in the SVG, base64-encoded
            fontWeight: '400',
            fontSize: '12px',
            lineHeight: '17px',
            textTransform: 'uppercase',
          },
        ]}
      />
    </g>
  );
};
export default ChartAnnotation;
