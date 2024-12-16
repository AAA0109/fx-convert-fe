import Home from '@mui/icons-material/Home';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  accountViewSelectState,
  allAccountsState,
  dashboardPerformanceDataState,
} from 'atoms';
import { accountSorter } from 'lib';
import { capitalize } from 'lodash';
import Image from 'next/image';
import { useRecoilState, useRecoilValue } from 'recoil';

export const AccountViewSelect = () => {
  const [account, setAccount] = useRecoilState(accountViewSelectState);
  const allAccounts = useRecoilValue(allAccountsState);
  const dashboardPerfData = useRecoilValue(dashboardPerformanceDataState);
  const handleChange = useEventCallback((event: SelectChangeEvent) => {
    setAccount(Number(event.target.value));
  });

  return (
    <FormControl
      variant='outlined'
      size='small'
      sx={{ minWidth: 172, maxWidth: 344 }}
    >
      <InputLabel id='accountView-select-label' variant='outlined'>
        View
      </InputLabel>
      <Select
        labelId='accountView-select-label'
        id='accountView-select'
        variant='outlined'
        size='small'
        value={account.toString()}
        label='View'
        onChange={handleChange}
      >
        <MenuItem value={-1}>
          <Stack display='flex' alignItems='center' direction='row'>
            <Home />
            <Typography
              variant='inherit'
              component='span'
              display='inline-block'
              sx={{ display: 'inline-block', paddingLeft: '8px' }}
            >
              Summary
            </Typography>
          </Stack>
        </MenuItem>
        {allAccounts
          .filter((a) => a.is_active && a.type == 'Live')
          .sort(accountSorter)
          .map((a) => {
            let hasData = false;
            try {
              hasData =
                (dashboardPerfData[a.id]?.cashflows.findIndex(
                  (c) => c.amount > 0,
                ) ?? -1) > -1;
            } catch (e) {
              console.error({ e, a, dashboardPerfData });
            }
            return (
              <MenuItem value={a.id} key={a.id} disabled={!hasData}>
                <Stack direction={'row'}>
                  <Image
                    src={`/images/type-${
                      ['low', 'moderate', 'high'].indexOf(a.name) > -1
                        ? a.name
                        : 'custom'
                    }.svg`}
                    width={24}
                    height={24}
                    alt='icon'
                  />
                  <Typography
                    variant='inherit'
                    component='span'
                    sx={{ display: 'inline-block', paddingLeft: '8px' }}
                  >
                    {capitalize(a.name)}
                  </Typography>
                </Stack>
              </MenuItem>
            );
          })}
      </Select>
    </FormControl>
  );
};
export default AccountViewSelect;
