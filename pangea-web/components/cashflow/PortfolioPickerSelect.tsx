import AddIcon from '@mui/icons-material/Add';
import {
  FormControl,
  InputLabel,
  ListItemIcon,
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { allAccountsState } from 'atoms';
import { useFeatureFlags } from 'hooks';
import { accountSorter } from 'lib';
import { capitalize, isUndefined } from 'lodash';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import { AccountMenuItem } from './AccountMenuItem';

export const PortfolioPickerSelect = (props: {
  accountId: Optional<number>;
  onChange: (accountSelected: number) => void;
  onCreateNewPortfolio?: () => void;
}) => {
  const accounts = useRecoilValue(allAccountsState);
  const handleSelectedAccount = (event: SelectChangeEvent<number>) => {
    props.onChange?.(Number(event.target.value));
  };
  const handleCreateNewPortfolio = () => {
    props.onCreateNewPortfolio?.();
  };
  const { isFeatureEnabled } = useFeatureFlags();
  const shouldShowCorpayForwards = isFeatureEnabled('corpay-forwards-strategy');

  return (
    <FormControl fullWidth>
      <InputLabel id='portfolio-label' variant='outlined'>
        Portfolio
      </InputLabel>
      <Select
        placeholder='Portfolio'
        labelId='portfolio-label'
        label='Portfolio'
        id='portfolio'
        variant='outlined'
        value={
          !isUndefined(props.accountId) && props.accountId > 0
            ? props.accountId
            : ''
        }
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 400,
              '& .MuiMenuItem-root': {
                backgroundColor: shouldShowCorpayForwards
                  ? PangeaColors.White
                  : 'none',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(237, 182, 165, 0.3);',
                },
              },
            },
          },
        }}
        onChange={handleSelectedAccount}
        renderValue={(accountId) => {
          const account = accounts.find((a) => a.id == accountId);
          if (!account) {
            return 'Custom';
          }
          return (
            {
              low: 'Low Protection',
              moderate: 'Moderate Protection',
              high: 'High Protection',
            }[account.name] ?? capitalize(account.name)
          );
        }}
      >
        {[...accounts]
          .sort(accountSorter)
          .filter((a) => a.is_active && a.type == 'Live')
          .flatMap((a, i, l) => {
            const menuItems = [];
            if (shouldShowCorpayForwards && i == 0) {
              menuItems.push(
                <ListSubheader
                  key='9999999'
                  sx={{
                    width: '484px',
                    borderBottom:
                      '1px solid ' + PangeaColors.BlackSemiTransparent25,
                    backgroundColor: PangeaColors.SolidSlateMedium,
                    color: PangeaColors.StoryWhiteLighter,
                  }}
                >
                  <Typography
                    variant='caption'
                    sx={{ position: 'relative', top: '4px' }}
                  >
                    Zero-Gravity Portfolios:
                  </Typography>
                </ListSubheader>,
              );
            }
            if (i == 3) {
              menuItems.push(
                <ListSubheader
                  key='999999'
                  sx={{
                    width: '484px',
                    borderBottom:
                      '1px solid ' + PangeaColors.BlackSemiTransparent25,
                    backgroundColor: PangeaColors.SolidSlateMedium,
                    color: PangeaColors.StoryWhiteLighter,
                  }}
                >
                  <Typography
                    variant='caption'
                    sx={{ position: 'relative', top: '4px' }}
                  >
                    Custom Portfolios:
                  </Typography>
                </ListSubheader>,
              );
              if (shouldShowCorpayForwards) {
                menuItems.push(
                  <MenuItem
                    key='create-custom-portfolio'
                    value={undefined}
                    onClick={handleCreateNewPortfolio}
                    sx={{
                      padding: '16px 20px',
                      borderBottom:
                        '1px solid ' + PangeaColors.BlackSemiTransparent25,
                    }}
                  >
                    <ListItemIcon>
                      <AddIcon />
                    </ListItemIcon>
                    <Typography variant='inputText'>
                      Create New Portfolio
                    </Typography>
                  </MenuItem>,
                );
              }
            }
            menuItems.push(
              <AccountMenuItem
                value={a.id}
                key={a.id}
                islast={i == l.length - 1}
                account={a}
              />,
            );
            return menuItems;
          })}
      </Select>
    </FormControl>
  );
};
export default PortfolioPickerSelect;
