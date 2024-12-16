import Skeleton, { SkeletonProps } from '@mui/material/Skeleton';
import Typography, { TypographyProps } from '@mui/material/Typography';
import React from 'react';

type TypographyLoaderProps = TypographyProps & {
  isLoading: boolean; // Prop to determine if the content is loading or not
  skeletonProps?: SkeletonProps; // Optional prop to set a custom width for the Skeleton
};

export const TypographyLoader: React.FC<TypographyLoaderProps> = ({
  isLoading,
  skeletonProps = {},
  children,
  ...typographyProps
}) => {
  return (
    <>
      {isLoading ? (
        <Skeleton
          width='100%'
          data-testid='typography-skeleton'
          {...skeletonProps}
        >
          <Typography {...typographyProps}>&nbsp;</Typography>
        </Skeleton>
      ) : (
        <Typography {...typographyProps}>{children}</Typography>
      )}
    </>
  );
};

export default TypographyLoader;
