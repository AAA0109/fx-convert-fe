import { Tooltip, Typography, TypographyProps } from '@mui/material';
import { useState, useEffect, useRef } from 'react';

interface TruncatedTypographyProps extends TypographyProps {
  enableTooltip?: boolean;
}

const TruncatedTypography: React.FC<TruncatedTypographyProps> = ({
  enableTooltip = true,
  children,
  ...props
}) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      const isOverflowing = element.offsetWidth < element.scrollWidth;
      setIsTruncated(isOverflowing);
    }
  }, [children]);

  const content = (
    <Typography ref={ref} noWrap {...props}>
      {children}
    </Typography>
  );

  if (enableTooltip && isTruncated) {
    return (
      <Tooltip title={typeof children === 'string' ? children : ''}>
        {content}
      </Tooltip>
    );
  }

  return content;
};

export default TruncatedTypography;
