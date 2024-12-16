import { add } from 'date-fns';
import { PangeaColors } from 'styles';
import { VictoryLine, VictoryLineProps } from 'victory';
import { MultiChartAnnotationProps } from './ChartAnnotationProps';
import { DataLabel } from './DataLabel';

export const MultiChartAnnotation = (props: MultiChartAnnotationProps) => {
  const {
    lineX,
    bottomLineY,
    topLineY,
    lineWidth,
    offset,
    labelData,
    adjustLabelPosition = false,
    blurTopLine,
  } = props;
  const getLabelPosition = (labelPosition: 'middle' | 'top' | 'bottom') => {
    switch (labelPosition) {
      case 'middle':
        return { labelY: (topLineY + bottomLineY) / 2, labelDY: 0 };
      case 'top':
        return { labelY: topLineY, labelDY: -20 };
      case 'bottom':
        return {
          labelY: bottomLineY,
          labelDY: ((topLineY + Math.abs(bottomLineY)) / 2) * 100 + 20,
        };
    }
  };

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

      {!blurTopLine && (
        <VictoryLine // top line
          data={[
            { x: x0, y: y1 },
            { x: x1, y: y1 },
          ]}
          {...lineProps}
        />
      )}
      <VictoryLine // vertical line
        data={[
          { x: x1, y: y1 },
          { x: x1, y: y0 },
        ]}
        {...lineProps}
      />
      {labelData.map((datum) => {
        return datum.text.split(' ').map((word, index) => {
          return (
            <DataLabel // top text label
              {...props}
              key={index}
              x={x1}
              y={getLabelPosition(datum.labelPosition)?.labelY}
              dx={adjustLabelPosition ? 10 : 5}
              dy={getLabelPosition(datum.labelPosition)?.labelDY + index * 12}
              text={word}
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
          );
        });
      })}
    </g>
  );
};
export default MultiChartAnnotation;
