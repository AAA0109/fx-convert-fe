import { VictoryLineProps } from 'victory';

export interface ChartAnnotationProps extends VictoryLineProps {
  lineX: Date;
  bottomLineY: number;
  topLineY: number;
  lineWidth: number;
  offset: number;
  text: string;
  labelPosition?: 'middle' | 'top' | 'bottom';
  adjustLabelPosition?: boolean;
}

export interface MultiChartAnnotationProps extends VictoryLineProps {
  lineX: Date;
  bottomLineY: number;
  topLineY: number;
  lineWidth: number;
  offset: number;
  labelData: { text: string; labelPosition: 'middle' | 'top' | 'bottom' }[];
  adjustLabelPosition?: boolean;
  blurTopLine?: boolean;
}
