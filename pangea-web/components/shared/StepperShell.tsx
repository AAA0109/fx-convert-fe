import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { Grid, Stack, SxProps, Theme, Typography } from '@mui/material';
import { ResponsiveStyleValue } from '@mui/system';
import { Property } from 'csstype';
import { MouseEventHandler, PropsWithChildren, ReactNode } from 'react';
import { PangeaColors } from 'styles';
import { PangeaButton, PangeaButtonProps } from './PangeaButton';

interface StepperShellProps {
  title: string;
  titleDescription?: string;
  children: ReactNode;
  sx?: Optional<SxProps<Theme>>;
  navigationSxProps?: Optional<SxProps<Theme>>;
  bgColor?: string;
  spacing?: number;
  //Continue button props
  continueButtonText?: string;
  continueButtonHref?: string;
  continueButtonEnabled?: boolean;
  continueButtonProps?: PangeaButtonProps;
  onClickContinueButton?: MouseEventHandler<HTMLButtonElement>;
  continueButtonVisible?: boolean;

  //Back button props
  backButtonText?: string;
  backButtonHref?: string;
  backButtonVisible?: boolean;
  backButtonProps?: PangeaButtonProps;
  onClickBackButton?: MouseEventHandler<HTMLButtonElement>;

  //Secondary button props
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  secondaryButtonProps?: PangeaButtonProps;
  secondaryButtonVisible?: boolean;
  onClickSecondaryButton?: MouseEventHandler<HTMLButtonElement>;

  secondaryComponents?: ReactNode;
  headerInfoComponents?: ReactNode;
  justifyFooterContent?: ResponsiveStyleValue<
    string[] | Property.JustifyContent | undefined
  >;

  // layout props
  leftContent?: ReactNode;
  rightContent?: ReactNode;
}

export const StepperShell: React.FC<PropsWithChildren & StepperShellProps> = ({
  title,
  titleDescription,
  children,
  continueButtonText = 'Continue',
  onClickBackButton,
  onClickContinueButton,
  backButtonVisible = true,
  continueButtonHref,
  backButtonProps,
  backButtonText = 'Back',
  backButtonHref,
  sx,
  continueButtonEnabled = false,
  continueButtonVisible = true,
  bgColor = PangeaColors.White,
  continueButtonProps,
  secondaryButtonText,
  secondaryButtonHref,
  secondaryButtonProps,
  onClickSecondaryButton,
  secondaryButtonVisible = false,
  spacing = 3,
  secondaryComponents = null,
  headerInfoComponents = null,
  justifyFooterContent = 'space-between',
  leftContent = null,
  rightContent = null,
  navigationSxProps = {},
  ...props
}) => {
  //This ensures that if there is no back button, the continue button stays on the right.
  const direction = backButtonVisible ? 'row' : 'row-reverse';
  const navigationContent = (
    <Stack
      py={1}
      direction={direction}
      justifyContent={justifyFooterContent}
      columnGap={4}
      mt={4}
      sx={{
        width: '100%',
        maxWidth: '39.35rem',
        ...navigationSxProps,
      }}
    >
      {backButtonVisible ? (
        <PangeaButton
          sx={{ minWidth: '84px' }}
          onClick={onClickBackButton}
          variant='outlined'
          startIcon={<ArrowBack />}
          size='large'
          href={backButtonHref}
          {...backButtonProps}
        >
          {backButtonText}
        </PangeaButton>
      ) : null}
      <Stack direction='row' spacing={2}>
        {secondaryComponents}
        {secondaryButtonVisible ? (
          <PangeaButton
            sx={{ minWidth: '84px' }}
            onClick={onClickSecondaryButton}
            variant='outlined'
            size='large'
            href={secondaryButtonHref}
            {...secondaryButtonProps}
          >
            {secondaryButtonText}
          </PangeaButton>
        ) : null}
        {continueButtonVisible && (
          <PangeaButton
            size='large'
            sx={{ marginLeft: 'auto', minWidth: '145px' }}
            onClick={onClickContinueButton}
            href={continueButtonHref}
            endIcon={<ArrowForward />}
            disabled={!continueButtonEnabled}
            variant='contained'
            {...continueButtonProps}
          >
            {continueButtonText}
          </PangeaButton>
        )}
      </Stack>
    </Stack>
  );
  const stepperContent = (
    <Stack
      borderRadius={'4px'}
      border={`1px solid ${PangeaColors.Gray}`}
      bgcolor={bgColor}
      spacing={spacing}
      p={3}
      sx={{ ...sx }}
      {...props}
    >
      <Stack direction='row' justifyContent='space-between'>
        <Stack spacing={1}>
          <Typography
            sx={{ fontFamily: 'SuisseIntlCond', fontSize: 24, fontWeight: 500 }}
            variant='heroBody'
            py={1}
          >
            {title}
          </Typography>
          {titleDescription && (
            <Typography
              variant='body2'
              color='textSecondary'
              fontWeight={400}
              fontSize={16}
              lineHeight='24px'
              sx={{ maxWidth: 600 }}
            >
              {titleDescription}
            </Typography>
          )}
        </Stack>
        {headerInfoComponents}
      </Stack>
      {children}
      {!leftContent && !rightContent && navigationContent}
    </Stack>
  );

  if (leftContent || rightContent) {
    return (
      <Grid
        container
        columnSpacing={5}
        sx={{ maxWidth: 'calc(100% - 130px)', ml: 0 }}
      >
        <Grid item xs={8} rowSpacing={4}>
          {stepperContent}
          {leftContent}
          {navigationContent}
        </Grid>
        <Grid item xs={4}>
          {rightContent}
        </Grid>
      </Grid>
    );
  }

  return <>{stepperContent}</>;
};
export default StepperShell;
