import { MenuItem, MenuItemProps, Skeleton, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { allAccountsState } from 'atoms';
import { PangeaAccount } from 'lib';
import { useRecoilValueLoadable } from 'recoil';
import { PangeaColors } from 'styles';
import { CostProtectionStack } from './CostProtectionStack';
import { defaultProtectionLevelSettings } from './PortfolioPicker';

export const AccountMenuItem = ({
  account,
  islast,
  ...others
}: {
  account: PangeaAccount;
  islast: boolean;
} & MenuItemProps) => {
  const hedgeSettingsLoadable = useRecoilValueLoadable(allAccountsState);
  if (hedgeSettingsLoadable.state == 'loading') {
    return <Skeleton variant='text' />;
  }
  const hedgeSettings = hedgeSettingsLoadable.getValue();

  let accountProps = defaultProtectionLevelSettings[account.name];
  if (!accountProps) {
    accountProps = {
      name: account.name,
      cost: 0,
      protection: 0,
      description:
        '' +
        (hedgeSettings.find((a) => a.id == account.id)?.hedge_settings.custom
          ?.vol_target_reduction ?? 0) *
          100 +
        ' coverage',
    };
  }
  return (
    <MenuItem
      {...others}
      value={account.id}
      sx={{
        width: '484px',
        borderBottom: islast
          ? 'unset'
          : '1px solid ' + PangeaColors.BlackSemiTransparent25,
      }}
    >
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        width='100%'
      >
        <Stack direction='column' width={'60%'}>
          <Typography variant='inputText'>{accountProps.name}</Typography>
          <Typography variant='body2'>{accountProps.description}</Typography>
        </Stack>
        <Stack direction='column' width={'30%'}>
          <CostProtectionStack {...accountProps} />
        </Stack>
      </Stack>
    </MenuItem>
  );
};
export default AccountMenuItem;
