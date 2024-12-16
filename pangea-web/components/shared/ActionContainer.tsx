import { Stack, StackProps, Typography } from '@mui/material';

interface ActionContainerProps extends StackProps {
  children?: React.ReactNode;
  title?: string;
  tableChild?: boolean;
}

export const ActionContainer = (props: ActionContainerProps) => {
  const { children, title, sx, tableChild } = props;

  return (
    <>
      {tableChild ? (
        <>
          {title && <Typography variant='h5'>{title}</Typography>}
          {children}
        </>
      ) : (
        <Stack spacing={3} sx={sx}>
          {title && <Typography variant='h5'>{title}</Typography>}
          {children}
        </Stack>
      )}
    </>
  );
};
export default ActionContainer;
