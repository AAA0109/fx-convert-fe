import { Box, FormHelperText, Stack } from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import { ChangeEvent, useEffect, useState } from 'react';
import { PangeaColors } from 'styles';
import { PangeaInputHidden } from '../shared';
import React from 'react';

interface SetNewPasswordProps {
  apiErrorMessage?: string[];
  onNewPasswordSet: (newPw: string) => void;
  new_password: string;
  old_password: string;
  resetPassword?: boolean;
}
export const SetNewPasswordForm = (props: SetNewPasswordProps) => {
  const { apiErrorMessage, resetPassword } = props;
  const [values, setValues] = useState({
    new_password: props.new_password,
    confirm_password: props.new_password,
  });

  const [formValidation, setFormValidation] = useState({
    new_password: true,
    confirm_password: true,
  });

  useEffect(() => {
    if (props.new_password !== values.new_password) {
      setValues({
        new_password: props.new_password,
        confirm_password: props.new_password,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.new_password]);

  const handleSetPasswords = useEventCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const rules: { [key: string]: (value: string) => boolean } = {
        new_password: (value: string) =>
          value.length > 7 && value != props.old_password,
        confirm_password: (value: string) => value === values.new_password,
      };

      const name = event.target.name;
      const value = event.target.value;
      const newValues = { ...values, [name]: value };
      const validation = {
        ...formValidation,
        [name]: rules[name](event.target.value),
      };
      setValues(newValues);
      setFormValidation(validation);
      if (
        newValues.confirm_password.length > 7 &&
        newValues.new_password.length > 7 &&
        validation.confirm_password &&
        validation.new_password &&
        newValues.confirm_password === newValues.new_password
      ) {
        props.onNewPasswordSet(newValues.new_password);
      }
    },
  );

  return (
    <React.Fragment>
      <Box
        sx={{
          '& .MuiFormHelperText-root': {
            marginTop: '3px',
            color: PangeaColors.SolidSlateMedium,
          },
        }}
      >
        <PangeaInputHidden
          name='new_password'
          label={'Password'}
          value={values.new_password}
          onChange={handleSetPasswords}
          error={!formValidation.new_password}
          autoComplete={'new-password'}
        />
        <FormHelperText sx={{ mx: '14px' }}>
          Minimum of 8 characters
        </FormHelperText>
        {!formValidation.new_password && (
          <FormHelperText sx={{ color: PangeaColors.RiskBerryMedium }}>
            Your new password must be at least 8 characters{' '}
            {resetPassword && <>and not match your old password</>}
          </FormHelperText>
        )}

        {apiErrorMessage?.map((item: string, i: number) => {
          return (
            <FormHelperText
              sx={{ color: PangeaColors.RiskBerryMedium }}
              key={i}
            >
              {item}
            </FormHelperText>
          );
        })}
      </Box>
      <Stack marginTop={3}>
        <PangeaInputHidden
          name='confirm_password'
          label={'Confirm Password'}
          value={values.confirm_password}
          onChange={handleSetPasswords}
          error={!formValidation.confirm_password}
          autoComplete={'new-password'}
        />
        {!formValidation.confirm_password && (
          <FormHelperText sx={{ color: PangeaColors.RiskBerryMedium }}>
            Password must be at least 8 characters and match new password
          </FormHelperText>
        )}
      </Stack>
    </React.Fragment>
  );
};
export default SetNewPasswordForm;
