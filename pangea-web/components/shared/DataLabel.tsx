import { VictoryLabel } from 'victory';

export const DataLabel = (props: any) => {
  const x = props.scale.x(props.x);
  const y = props.scale.y(props.y);
  return <VictoryLabel {...props} x={x} y={y} />;
};
