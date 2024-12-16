import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ResponsiveStyleValue } from '@mui/system';
import type { Property as CSSProperty } from 'csstype';
import Head from 'next/head';

/************************************************************************************
 * Interface for the props of the PangeaPageTitle
 * @see {@link PangeaPageTitle}
 *
 * @interface PageTitleProps
 *************************************************************************************/
interface PageTitleProps {
  /************************************************************************************
   * Determines the string to write to page and set as page title.
   * @member string title
   *************************************************************************************/
  title: string;

  /************************************************************************************
   * Determines the color the text of the element is rendered.
   * @member ResponsiveStyleValue<CSS.Property.Color | CSS.Property.Optional<Color[]>> color
   *************************************************************************************/
  color?: ResponsiveStyleValue<
    Optional<CSSProperty.Color | CSSProperty.Color[]>
  >;

  /************************************************************************************
   * Determines whether the title supplied is blocked from being set as the page title.
   * @see title
   * @member boolean isNotLocationTitle
   *************************************************************************************/
  isNotLocationTitle?: boolean;

  /************************************************************************************
   * Provides a string to use as the explicit Page Title.
   * @see title
   * @member string pageTitleOverride
   *************************************************************************************/
  pageTitleOverride?: string;

  /************************************************************************************
   * Determines the string to write to page and set as page variant.
   * @member string variant
   *************************************************************************************/
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2';
}

export const PangeaPageTitle = ({
  title,
  color,
  variant = 'h1',
  isNotLocationTitle = false,
  pageTitleOverride,
}: PageTitleProps) => {
  const theme = useTheme();
  return (
    <>
      {!isNotLocationTitle && !pageTitleOverride && (
        <Head>
          <title>Pangea Prime - {title}</title>
        </Head>
      )}
      {pageTitleOverride && (
        <Head>
          <title>Pangea Prime - {pageTitleOverride}</title>
        </Head>
      )}
      <Typography
        component='h1'
        noWrap
        variant={variant}
        color={color || theme.palette.secondary.main}
        margin={'16px 0'}
      >
        {title}
      </Typography>
    </>
  );
};
export default PangeaPageTitle;
