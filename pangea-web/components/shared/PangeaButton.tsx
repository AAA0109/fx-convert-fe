import { LoadingButton } from '@mui/lab';
import { Button, ButtonProps, LinkProps } from '@mui/material';
import Link from 'next/link';
import { forwardRef, ReactNode, useMemo } from 'react';

/**
 * PangeaButtonProps provide the minimal set of props for the PangeaButton
 */
export interface PangeaButtonProps extends ButtonProps {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  loading?: boolean;
  loadingIndicator?: ReactNode;
}

/**
 * @param buttonProps - custom component props from the PangeaButtonProps interface
 * @returns PangeaButton component with sane set of defaults, or custom value overrides
 */
export const PangeaButton = (buttonProps: PangeaButtonProps) => {
  const {
    variant = 'contained',
    size = 'medium',
    disabled = false,
    color = 'primary',
    onClick,
    startIcon,
    endIcon,
    children = [''],
    sx,
    href,
    loading,
    loadingIndicator,
  } = buttonProps;
  const WrappedLink = useMemo(
    () =>
      forwardRef<HTMLAnchorElement, LinkProps>(function WrappedLinkRef(
        linkProps,
        ref,
      ) {
        // Intentionally throwing away props here.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { children, startIcon, endIcon, href, ...myButtonProps } =
          buttonProps;
        return (
          <Link
            href={!disabled ? linkProps.href ?? '#' : '#'}
            style={{ textDecoration: 'none' }}
            ref={ref as any}
          >
            <Button
              color={color}
              size={size}
              variant={variant}
              {...myButtonProps}
              type='button'
              disabled={disabled}
            >
              {linkProps.children}
            </Button>
          </Link>
        );
      }),
    [buttonProps, color, disabled, size, variant],
  );
  return (
    <LoadingButton
      loading={loading}
      loadingIndicator={loadingIndicator}
      {...buttonProps}
      variant={variant}
      size={size}
      disabled={disabled ?? false}
      color={color}
      onClick={onClick}
      type={onClick ? 'button' : 'submit'}
      startIcon={startIcon}
      endIcon={endIcon}
      LinkComponent={WrappedLink}
      href={!disabled ? href : undefined}
      sx={{ minWidth: '184px', textDecoration: 'none', ...sx }}
    >
      {children}
    </LoadingButton>
  );
};
export default PangeaButton;
