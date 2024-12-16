import { AccountBalance } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  clientApiState,
  linkWithdrawalAccountState,
  pangeaAlertNotificationMessageState,
  selectableCurrenciesState,
  userState,
} from 'atoms';
import { IconBorder } from 'components/icons';
import { PangeaButton, PangeaErrorFormHelperText } from 'components/shared';
import { useLoading } from 'hooks';
import { isError } from 'lodash';
import router from 'next/router';
import { ChangeEventHandler, useEffect } from 'react';
import {
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import { PangeaColors } from 'styles/colors';
const StyledTextField = styled(TextField)(() => ({
  '& .MuiFormHelperText-root.Mui-error': {
    color: PangeaColors.BlackSemiTransparent99,
  },
}));
export const LinkAccount = (): JSX.Element => {
  const [withdrawalAccount, setWithdrawalAccount] = useRecoilState(
    linkWithdrawalAccountState,
  );
  const currencies = useRecoilValueLoadable(
    selectableCurrenciesState,
  ).getValue();
  const user = useRecoilValue(userState);
  const { loadingState, loadingPromise } = useLoading();
  const authHelper = useRecoilValue(clientApiState);
  const {
    instruction_name,
    financial_institution_client_acct_id,
    currency,
    financial_institution: { name, identifier },
  } = withdrawalAccount;
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );

  const handleBaseDataChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    const { value, name } = event.target;
    setWithdrawalAccount((oldValue) => {
      return { ...oldValue, [name]: value };
    });
  };

  const handleFinancialDataChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    const { value, name } = event.target;
    setWithdrawalAccount((oldValue) => {
      const oldFinancialInstitutionValue = oldValue.financial_institution;
      return {
        ...oldValue,
        financial_institution: {
          ...oldFinancialInstitutionValue,
          [name]: value,
        },
      };
    });
  };

  const handleCurrencyChange = useEventCallback((event: SelectChangeEvent) => {
    const { value, name } = event.target;
    setWithdrawalAccount((oldValue) => {
      return { ...oldValue, [name]: value };
    });
  });

  const handleFinishAccountLink = async () => {
    const updateLinkWithdrawalAccount = async () => {
      try {
        const api = authHelper.getAuthenticatedApiHelper();
        const res = await api.linkWithdrawalAccountAsync(withdrawalAccount);
        if (res && !isError(res)) {
          setPangeaAlertNotificationMessage({
            text: 'Withdrawal account linked successfully!',
            severity: 'success',
          });
          router.push('/activation/finishing-up/schedule-a-meeting');
        } else {
          setPangeaAlertNotificationMessage({
            text: res.message,
            severity: 'error',
          });
        }
      } catch {
        setPangeaAlertNotificationMessage({
          text: 'Could not link withdrawal account at this time. Please try again later.',
          severity: 'error',
        });
      }
    };
    await loadingPromise(updateLinkWithdrawalAccount());
  };

  useEffect(() => {
    setWithdrawalAccount((currentValue) => {
      return {
        ...currentValue,
        broker_account_id: user?.company.broker_accounts[0].id ?? 0,
      };
    });
  }, [setWithdrawalAccount, user]);
  return (
    <Box
      border={`1px solid ${PangeaColors.Gray}`}
      borderRadius='4px'
      sx={{ backgroundColor: PangeaColors.White }}
      justifyContent='center'
      mt={0}
      px={3}
      py={4}
      width='480px'
      textAlign='center'
    >
      <IconBorder>
        <AccountBalance
          sx={{ color: PangeaColors.SolidSlateMedium }}
          fontSize='large'
        />
      </IconBorder>
      <Typography component='h1' variant='h4' my={4}>
        Account for withdrawals
      </Typography>
      <Typography
        mb={3}
        variant='body1'
        color={PangeaColors.BlackSemiTransparent60}
      >
        Link the bank account that will receive any withdrawal wires from your
        Pangea margin account.
      </Typography>
      <Stack spacing={3}>
        <Box>
          <TextField
            fullWidth
            required
            id='name'
            label='Institution Name'
            name='name'
            variant='filled'
            error={name === ''}
            value={name}
            onChange={handleFinancialDataChange}
            autoComplete={'name'}
          />
          <PangeaErrorFormHelperText
            text={'Please provide an institution name'}
            visible={name === ''}
          />
        </Box>
        <Box>
          <StyledTextField
            fullWidth
            required
            id='institution-identifier'
            label='Institution Identifier'
            name='identifier'
            variant='filled'
            error={identifier === ''}
            value={identifier}
            onChange={handleFinancialDataChange}
            autoComplete={'identifier'}
            helperText='Routing Number, BIC, IBAN, etc…'
          />
          <PangeaErrorFormHelperText
            text={'Please provide your institution identifier'}
            visible={identifier === ''}
          />
        </Box>
        <Box>
          <TextField
            fullWidth
            required
            id='account-number'
            label='Account Number'
            name='financial_institution_client_acct_id'
            variant='filled'
            error={financial_institution_client_acct_id === ''}
            value={financial_institution_client_acct_id}
            onChange={handleBaseDataChange}
            autoComplete={'account'}
          />
          <PangeaErrorFormHelperText
            text={'Please provide an account number'}
            visible={financial_institution_client_acct_id === ''}
          />
        </Box>
        <Box>
          <StyledTextField
            fullWidth
            required
            id='account-nickname'
            label='Account Nickname'
            name='instruction_name'
            variant='filled'
            error={instruction_name === ''}
            value={instruction_name}
            onChange={handleBaseDataChange}
            autoComplete={'nickname'}
            helperText='Note this is only for your internal reference.'
          />
          <PangeaErrorFormHelperText
            text={'Please provide an account nickname'}
            visible={instruction_name === ''}
          />
        </Box>
        <Box>
          <FormControl fullWidth>
            <InputLabel error={!currency} id='account-currency'>
              Currency *
            </InputLabel>
            <Select
              required
              labelId='currency'
              id='currency'
              value={currency}
              onChange={handleCurrencyChange}
              label='Currency'
              name={'currency'}
              sx={{
                textAlign: 'left',
              }}
              error={!currency}
            >
              {[...currencies]
                .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
                .map((currency) => (
                  <MenuItem
                    key={`currency${currency.name}`}
                    value={`${currency.mnemonic}`}
                  >
                    {currency.name} ({currency.mnemonic})
                  </MenuItem>
                ))}
            </Select>
            <FormHelperText>
              Currency of the funds being sent to Interactive Brokers.
            </FormHelperText>
          </FormControl>
        </Box>
      </Stack>
      <Stack direction={'row'} justifyContent='center' spacing={2} mt={3}>
        <Button
          variant='outlined'
          sx={{
            flexGrow: 1,
          }}
          onClick={() => {
            router.push('/activation/finishing-up/fee-payment-method');
          }}
          size='large'
        >
          Go Back
        </Button>
        <PangeaButton
          loading={loadingState.isLoading}
          variant='contained'
          size='large'
          sx={{
            flexGrow: 1,
          }}
          onClick={handleFinishAccountLink}
          disabled={!(instruction_name && currency)}
        >
          Continue
        </PangeaButton>
      </Stack>
    </Box>
  );
};

export default LinkAccount;
