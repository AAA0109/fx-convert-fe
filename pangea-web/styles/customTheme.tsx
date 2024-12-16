import {
  createTheme,
  PaletteColor,
  PaletteColorOptions,
} from '@mui/material/styles';
import { setAlpha } from 'lib';
import { PangeaColors } from 'styles';

/*
 * Content styles: https://pangea.zeroheight.com/styleguide/s/77410/p/3645d1-type-styles
 */

declare module '@mui/material/styles' {
  interface TypographyVariants {
    pageTitle: React.CSSProperties;
    tagLine: React.CSSProperties;
    pullQuote: React.CSSProperties;
    d2: React.CSSProperties;
    dataLabel: React.CSSProperties;
    dataBody: React.CSSProperties;
    small: React.CSSProperties;
    heroBody: React.CSSProperties;
    inputText: React.CSSProperties;
    tableHeader: React.CSSProperties;
    componentsChip: React.CSSProperties;
    toolTip: React.CSSProperties;
    helperText: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    pageTitle?: React.CSSProperties;
    tagLine?: React.CSSProperties;
    pullQuote?: React.CSSProperties;
    d2?: React.CSSProperties;
    dataLabel?: React.CSSProperties;
    dataBody?: React.CSSProperties;
    small?: React.CSSProperties;
    heroBody?: React.CSSProperties;
    inputText?: React.CSSProperties;
    tableHeader?: React.CSSProperties;
    componentsChip?: React.CSSProperties;
    toolTip?: React.CSSProperties;
    helperText?: React.CSSProperties;
  }

  interface Palette {
    active: PaletteColor;
    pending: PaletteColor;
    pending_margin: PaletteColor;
    pending_payment: PaletteColor;
    pending_approval: PaletteColor;
    inflight: PaletteColor;
    unhealthy: PaletteColor;
    archived: PaletteColor;
    terminated: PaletteColor;
    draft: PaletteColor;
    settling_soon: PaletteColor;
  }

  interface PaletteOptions {
    active: PaletteColorOptions;
    pending: PaletteColorOptions;
    pending_margin: PaletteColorOptions;
    pending_payment: PaletteColorOptions;
    pending_approval: PaletteColorOptions;
    inflight: PaletteColorOptions;
    unhealthy: PaletteColorOptions;
    archived: PaletteColorOptions;
    terminated: PaletteColorOptions;
    draft: PaletteColorOptions;
    settling_soon: PaletteColorOptions;
  }
}
// Extend color prop on components
declare module '@mui/material/Chip' {
  export interface ChipPropsColorOverrides {
    active: true;
    pending: true;
    pending_margin: true;
    pending_payment: true;
    pending_approval: true;
    inflight: true;
    unhealthy: true;
    archived: true;
    terminated: true;
    draft: true;
    settling_soon: true;
  }
}

declare module '@mui/material/Badge' {
  export interface BadgePropsColorOverrides {
    active: true;
    pending: true;
    pending_margin: true;
    pending_payment: true;
    pending_approval: true;
    inflight: true;
    unhealthy: true;
    archived: true;
    terminated: true;
    draft: true;
    settling_soon: true;
  }
}
// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    pageTitle: true;
    tagLine: true;
    pullQuote: true;
    d2: true;
    dataLabel: true;
    dataBody: true;
    small: true;
    heroBody: true;
    inputText: true;
    tableHeader: true;
    componentsChip: true;
    toolTip: true;
    helperText: true;
  }
}

export const customTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 0,
      md: 0,
      lg: 0,
      xl: 1,
    },
  },
  palette: {
    primary: {
      main: PangeaColors.SolidSlateMedium,
      dark: PangeaColors.SolidSlateDarker,
      light: PangeaColors.SolidSlateLighter,
    },
    secondary: {
      main: PangeaColors.WarmOrangeMedium,
      light: PangeaColors.WarmOrangeLight,
      dark: PangeaColors.WarmOrangeDark,
    },
    error: {
      light: PangeaColors.RiskBerryLighter,
      main: PangeaColors.RiskBerryMedium,
      dark: PangeaColors.RiskBerryDarker,
    },
    warning: {
      light: PangeaColors.CautionYellowLighter,
      main: PangeaColors.CautionYellowMedium,
      dark: PangeaColors.CautionYellowDarker,
    },
    info: {
      light: PangeaColors.EarthBlueLight,
      main: PangeaColors.EarthBlueMedium,
      dark: PangeaColors.EarthBlueDark,
    },
    success: {
      light: PangeaColors.SecurityGreenLighter,
      main: PangeaColors.SecurityGreenMedium,
      dark: PangeaColors.SecurityGreenDarker,
    },
    background: {
      paper: PangeaColors.StoryWhiteMedium,
    },
    grey: {
      400: PangeaColors.SolidSlateMedium,
    },
    active: {
      main: PangeaColors.SecurityGreenMedium,
      contrastText: PangeaColors.White,
    },
    pending: {
      main: PangeaColors.CautionYellowMedium,
      contrastText: PangeaColors.White,
    },
    pending_margin: {
      main: PangeaColors.CautionYellowMedium,
      contrastText: PangeaColors.White,
    },
    pending_payment: {
      main: PangeaColors.CautionYellowMedium,
      contrastText: PangeaColors.White,
    },
    pending_approval: {
      main: PangeaColors.RiskBerryMedium,
      contrastText: PangeaColors.White,
    },
    draft: {
      main: PangeaColors.EarthBlueMedium,
      contrastText: PangeaColors.White,
    },
    inflight: {
      main: PangeaColors.ConnectedVioletMedium,
      contrastText: PangeaColors.White,
    },
    archived: {
      main: PangeaColors.SolidSlateMedium,
      contrastText: PangeaColors.White,
    },
    terminated: {
      main: PangeaColors.SolidSlateMedium,
      contrastText: PangeaColors.White,
    },
    unhealthy: {
      main: PangeaColors.RiskBerryMedium,
      contrastText: PangeaColors.White,
    },
    settling_soon: {
      main: PangeaColors.VisionCyanMedium,
      contrastText: PangeaColors.White,
    },
  },
  typography: {
    fontFamily: 'SuisseIntl',
    fontSize: 12,
    h1: {
      fontFamily: 'SuisseIntlCond',
      fontWeight: 500,
      fontSize: '4rem',
      lineHeight: 1,
      textTransform: 'uppercase',
    },
    h2: {
      fontFamily: 'SuisseIntlCond',
      fontWeight: 500,
      fontSize: '3.5rem',
      lineHeight: '72px',
    },
    h3: {
      fontFamily: 'SuisseIntlCond',
      fontWeight: 500,
      fontSize: '2.5rem',
      lineHeight: 1,
      textTransform: 'uppercase',
    },
    h4: {
      fontFamily: 'SuisseIntlCond',
      fontWeight: 500,
      fontSize: '2rem',
      lineHeight: 1,
      textTransform: 'uppercase',
    },
    h5: {
      fontFamily: 'SuisseIntlCond',
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 4 / 3,
      textTransform: 'uppercase',
    },
    h6: {
      fontFamily: 'SuisseIntlCond',
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1,
      textTransform: 'uppercase',
    },
    pageTitle: {
      fontFamily: 'SuisseIntl',
      fontWeight: 700,
      fontSize: '4rem',
      lineHeight: 1.125,
    },
    helperText: {
      fontFamily: 'SuisseNeue',
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: '1.25rem',
      letterSpacing: '0.4px',
    },
    tagLine: {
      fontFamily: 'SuisseSign',
      fontWeight: 100,
      fontSize: '3rem',
      lineHeight: 1,
    },
    pullQuote: {
      fontFamily: 'SuisseIntl',
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.3,
    },
    d2: {
      fontFamily: 'SuisseIntl',
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.3,
      letterSpacing: -1,
    },
    dataLabel: {
      fontFamily: 'SuisseIntl',
      fontWeight: 500,
      fontSize: '12px',
      lineHeight: 2,
      letterSpacing: '0.17px',
      textTransform: 'uppercase',
      color: PangeaColors.BlackSemiTransparent60,
    },
    dataBody: {
      fontFamily: 'SuisseIntl',
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: 2,
      letterSpacing: '0.17px',
      color: PangeaColors.BlackSemiTransparent87,
    },
    heroBody: {
      fontFamily: 'SuisseNeue',
      fontWeight: 400,
      fontSize: '1.5rem',
      lineHeight: 1,
    },
    body1: {
      fontFamily: 'SuisseNeue',
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: '1.5rem',
    },
    body2: {
      fontFamily: 'SuisseNeue',
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: '1.125rem',
    },
    caption: {
      fontFamily: 'SuisseNeue',
      fontWeight: 500,
      fontSize: '0.8125rem',
      lineHeight: 1.3,
      textTransform: 'uppercase',
    },
    small: {
      fontFamily: 'SuisseNeue',
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1,
    },
    inputText: {
      fontFamily: 'SuisseIntlCond',
      fontWeight: 500,
      fontSize: '1rem',
    },
    tableHeader: {
      fontFamily: 'SuisseIntl',
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    button: {
      fontFamily: 'SuisseIntlCond',
      fontStyle: 'normal',
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: '26px',
      letterSpacing: '0.46px',
      textTransform: 'uppercase',
    },
    componentsChip: {
      fontFamily: 'SuisseIntl',
      fontWeight: 400,
      fontSize: '13px',
      lineHeight: '18px',
      letterSpacing: '0.16px',
    },
    toolTip: {
      fontFamily: 'SuisseIntl',
      fontWeight: 400,
      fontSize: '12px',
      lineHeight: '14px',
      // letterSpacing: '0.16px',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: PangeaColors.White,
          //height: '64px',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          padding: 0,
          backgroundColor: PangeaColors.StoryWhiteMedium,

          ':before': {
            backgroundColor: 'unset',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        outlined: {
          color: PangeaColors.PrimaryMain,
        },
        outlinedInfo: {
          borderColor: PangeaColors.EarthBlueMedium,
          '& .MuiAlert-icon': {
            color: PangeaColors.EarthBlueMedium,
          },
          '& .MuiAlert-action': {
            color: PangeaColors.SolidSlateLight,
          },
        },
        filledInfo: {
          backgroundColor: PangeaColors.SolidSlateMedium,
          color: PangeaColors.White,
        },
        filled: {
          color: PangeaColors.White,
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          verticalAlign: 'middle',
          padding: 0,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: 'SuisseIntl',
          fontWeight: 400,
          fontSize: '13px',
          lineHeight: '18px',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: 'SuisseIntlCond',
          fontSize: '1rem',
          color: PangeaColors.BlackSemiTransparent87,
          lineHeight: '1.5rem',
          fontWeight: 400,
          letterSpacing: '0.15px',
          textTransform: 'capitalize',
          '&.Mui-selected': {
            backgroundColor: setAlpha(PangeaColors.WarmOrangeLighter, 0.3),
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: 'SuisseIntlCond',
          fontSize: '1.0rem',
          color: setAlpha(PangeaColors.Black, 0.87),
          lineHeight: '1.5em',
          fontWeight: 600,
          '&:hover': {
            backgroundColor: setAlpha(PangeaColors.PrimaryMain, 0.12),
          },
          '&.Mui-selected': {
            color: PangeaColors.SecondaryMain,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        body: {
          fontFamily: 'SuisseIntl',
          fontSize: '14px',
          fontWeight: 400,
          fontStyle: 'normal',
          lineHeight: '24px',
          color: PangeaColors.BlackSemiTransparent87,
        },
        head: {
          fontFamily: 'SuisseIntl',
          fontWeight: 500,
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundColor: setAlpha(PangeaColors.StoryWhiteLighter, 1),
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        variant: 'filled',
      },
      styleOverrides: {
        select: {
          root: {
            fontFamily: 'SuisseIntlCond',
            fontWeight: 500,
            fontSize: '1.0rem',
            lineHeight: '1.5rem',
            letterSpacing: 0.15,
            textTransform: 'capitalize',
          },
          paddingBottom: '6px',
          height: '24px',
        },
        filled: {
          textTransform: 'capitalize',
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        input: {
          height: '24px',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          textTransform: 'none',
          borderBottomColor: setAlpha(PangeaColors.SolidSlateLight, 1),
        },
        root: {
          color: setAlpha(PangeaColors.Black, 0.87),
          fontFamily: 'SuisseIntlCond',
          fontWeight: 500,
          fontSize: '1.0rem',
          lineHeight: '1.5rem',
          letterSpacing: 0.15,
          textTransform: 'capitalize',
          '&.Mui-focused:after': {
            borderBottomColor: PangeaColors.PrimaryMain,
          },
          '&.Mui-error': {
            color: PangeaColors.RiskBerryMedium,
            borderColor: PangeaColors.RiskBerryMedium,
          },
          '&.Mui-disabled': {
            color: PangeaColors.SolidSlateLighter,
            borderColor: PangeaColors.SolidSlateLighter,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'filled',
      },
    },
    MuiInputLabel: {
      defaultProps: {
        variant: 'filled',
      },
      styleOverrides: {
        root: {
          fontFamily: 'SuisseIntlCond',
          fontWeight: 400,
          fontSize: '1rem',
          lineHeight: '1.5rem',
          letterSpacing: '.15px',
          textTransform: 'none',
          '&.Mui-focused': {
            // fontSize: '3rem',
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: setAlpha(PangeaColors.Black, 0.6),
          fontFamily: 'SuisseNeue',
          fontWeight: 400,
          fontSize: '12px',
          lineHeight: '1.0rem',
          textTransform: 'none',
          marginLeft: '0',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          border: '1px solid black',
          borderBottomWidth: '0',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'SuisseIntlCond',
        },
        containedPrimary: {
          color: PangeaColors.LightPrimaryContrast,
        },
        sizeLarge: {
          fontSize: '16px',
          fontWeight: 500,
          lineHeight: '26px',
          letterSpacing: '0.46px',
        },
        sizeMedium: {
          fontSize: '14px',
          fontWeight: 500,
          lineHeight: '24px',
          letterSpacing: '0.4px',
          textTransform: 'uppercase',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: PangeaColors.StoryWhiteMedium,
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            color: PangeaColors.SolidSlateLighter,
          },
        },
      },
    },
  },
});

export const customThemeData = {
  columnWidths: {
    desktop: 1152,
  },
};
