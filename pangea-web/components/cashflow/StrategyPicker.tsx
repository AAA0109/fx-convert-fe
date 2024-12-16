import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { selectedHedgeStrategy, userState } from 'atoms';

import STRATEGY_OPTIONS from 'components/shared/StrategyOptions';
import { useFeatureFlags } from 'hooks';
import { CashflowStrategyEnum } from 'lib';
import { useState } from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { PangeaColors } from 'styles';

const ZERO_GRAVITY_FF_NAME = 'zero-gravity';
const AUTOPILOT_FF_NAME = 'autopilot';
const PARACHUTE_FF_NAME = 'parachute';

export const StrategyPicker = ({
  strategySetFunc,
}: {
  strategySetFunc: (val: CashflowStrategyEnum) => void;
}): JSX.Element => {
  const { isFeatureEnabled } = useFeatureFlags();
  const shouldEnableZeroGravity = isFeatureEnabled(ZERO_GRAVITY_FF_NAME);
  const shouldEnableAutoPilot = isFeatureEnabled(AUTOPILOT_FF_NAME);
  const shouldEnableParachute = isFeatureEnabled(PARACHUTE_FF_NAME);
  const OPTIONS: CashflowStrategyEnum[] = (() => {
    const option_list: CashflowStrategyEnum[] = [];
    if (shouldEnableZeroGravity) {
      option_list.push(CashflowStrategyEnum.ZEROGRAVITY);
    }
    if (shouldEnableAutoPilot) {
      option_list.push(CashflowStrategyEnum.AUTOPILOT);
    }
    if (shouldEnableParachute) {
      option_list.push(CashflowStrategyEnum.PARACHUTE);
    }
    return option_list;
  })();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const selectedStrategy = useRecoilValue(selectedHedgeStrategy);
  const open = Boolean(anchorEl);
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    strategy: CashflowStrategyEnum,
  ) => {
    event.preventDefault();
    strategySetFunc(strategy);
    setAnchorEl(null);
  };

  const handleClose = () => setAnchorEl(null);
  const userLoadable = useRecoilValueLoadable(userState);
  const isLoadingUserData = userLoadable.state === 'loading';
  const hasUserData = userLoadable.state === 'hasValue';
  const hasIbkrSettings =
    !isLoadingUserData && hasUserData
      ? userLoadable.getValue()?.company.settings.ibkr.spot
      : false;
  return (
    <div style={{ margin: '16px 0 32px 0!important' }}>
      <List component='nav' aria-label='Strategy options' sx={{ padding: 0 }}>
        <ListItemButton
          id='strategy-button'
          aria-haspopup='listbox'
          aria-controls='strategy-menu'
          aria-label='when selecting strategy'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickListItem}
          sx={{
            padding: '16px',
            border: `1px solid #C4C4C4`,
            borderRadius: '4px',
          }}
        >
          {selectedStrategy ? (
            <>
              <ListItemIcon sx={{ justifyContent: 'flex-start' }}>
                {STRATEGY_OPTIONS[selectedStrategy].icon}
              </ListItemIcon>
              <ListItemText
                sx={{ margin: 0 }}
                primary={
                  <Typography
                    variant='h6'
                    sx={{
                      lineHeight: '24px',
                      color: 'rgba(0,0,0,0.87)',
                      textTransform: 'none',
                    }}
                  >
                    {STRATEGY_OPTIONS[selectedStrategy].label}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant='small'
                    sx={{
                      lineHeight: '16px',
                      fontSize: '12px',
                      color: 'rgba(0,0,0,0.6)',
                      textTransform: 'none',
                    }}
                  >
                    {STRATEGY_OPTIONS[selectedStrategy].description}
                  </Typography>
                }
              />
            </>
          ) : (
            <ListItemText
              primary={
                <Typography variant='inputText' sx={{ color: '#666' }}>
                  Select your hedge
                </Typography>
              }
            />
          )}
          <ListItemIcon sx={{ justifyContent: 'flex-end' }}>
            <ArrowDropDownIcon />
          </ListItemIcon>
        </ListItemButton>
      </List>
      <Menu
        id='strategy-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { width: '514px', backgroundColor: PangeaColors.White },
        }}
        MenuListProps={{
          'aria-labelledby': 'strategy-button',
          role: 'listbox',
          sx: { padding: 0 },
        }}
      >
        {OPTIONS.filter(
          (option) =>
            option == 'auto-pilot' ||
            option == 'parachute' ||
            (hasIbkrSettings && option === 'zero-gravity'),
        ).map((option) => (
          <MenuItem
            divider
            key={option}
            selected={option === selectedStrategy}
            onClick={(event) => handleMenuItemClick(event, option)}
            sx={{ padding: '16px' }}
          >
            <Stack direction='row' spacing={2} alignItems='center'>
              <ListItemIcon sx={{ justifyContent: 'flex-start' }}>
                {STRATEGY_OPTIONS[option].icon}
              </ListItemIcon>
              <Stack>
                <Typography
                  variant='h6'
                  sx={{
                    lineHeight: '24px',
                    color: 'rgba(0,0,0,0.87)',
                    whiteSpace: 'normal',
                    textTransform: 'none',
                  }}
                >
                  {STRATEGY_OPTIONS[option].label}
                </Typography>
                <Typography
                  variant='small'
                  sx={{
                    lineHeight: '16px',
                    fontSize: '12px',
                    color: 'rgba(0,0,0,0.6)',
                    whiteSpace: 'normal',
                    textTransform: 'none',
                  }}
                >
                  {STRATEGY_OPTIONS[option].description}
                </Typography>
              </Stack>
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default StrategyPicker;
