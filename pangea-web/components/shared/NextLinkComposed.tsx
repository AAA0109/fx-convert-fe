/* From https://github.com/mui/material-ui/blob/next/examples/nextjs-with-typescript/src/Link.tsx */
import { Typography } from '@mui/material';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import * as React from 'react';

interface NextLinkComposedProps
  extends Omit<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      'href' | 'onClick' | 'onMouseEnter' | 'onTouchStart'
    >,
    Omit<NextLinkProps, 'href' | 'as'> {
  to: NextLinkProps['href'];
  linkAs?: NextLinkProps['as'];
}

export const NextLinkComposed = React.forwardRef<
  HTMLAnchorElement,
  NextLinkComposedProps
>(function NextLinkComposed(props, ref) {
  const { to, linkAs, replace, scroll, shallow, prefetch, locale, ...other } =
    props;
  return (
    <NextLink
      href={to}
      prefetch={prefetch}
      as={linkAs}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref
      locale={locale}
      legacyBehavior
    >
      <Typography ref={ref} onClick={props.onClick} {...other} />
    </NextLink>
  );
});
export default NextLinkComposed;
