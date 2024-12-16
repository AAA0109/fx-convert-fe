import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  IconButton,
  Popover,
  Portal,
  Stack,
  Switch,
  SwitchProps,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import { FlagSetting } from 'lib';
import { useMemo, useState } from 'react';
import { PangeaColors } from 'styles';
import { useFeatureFlags, useToggleFeatureFlags } from './hooks';

type FeatureFlagInfoProps = {
  feature: FlagSetting;
};

const FeatureFlagInfo = ({ feature }: FeatureFlagInfoProps) => {
  const { createdAt, description } = feature;
  const date = createdAt && new Date(createdAt);
  const formattedDate = date ? format(date, 'MM/dd/yyyy') : '-';

  return (
    <Stack spacing={2} direction='column'>
      <span>
        <em>Created</em>: {formattedDate}
      </span>
      <span>
        <em>Description</em>: {description}
      </span>
    </Stack>
  );
};

const StyledIconButton = styled(IconButton)(() => ({
  position: 'fixed',
  top: '50%',
  transform: 'translateY(-100%)',
  left: '-1px',
  boxShadow: '0 0 10px rgba(0,0,0,0.2)',
  transition: 'all 300ms ease-in-out',
  lineHeight: 0,
  borderRadius: '4px',
  borderTopLeftRadius: '0px',
  borderBottomLeftRadius: '0px',
  padding: '8px 0',
  width: '56px',
  height: '56px',
  background: PangeaColors.White,
  border: `1px solid #ccc`,
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName='.Mui-focusVisible' disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

const FeatureFlagDevTool: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { flags } = useFeatureFlags();
  const toggleFeatureFlags = useToggleFeatureFlags();
  const flagList = useMemo(() => Object.entries(flags), [flags]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'feature-flag-trigger' : undefined;

  return (
    <Portal>
      <Stack style={{ position: 'relative', zIndex: 99999 }}>
        <StyledIconButton
          aria-describedby={id}
          aria-label='feature flags devtool trigger'
          onClick={handleClick}
        >
          <FlagOutlinedIcon />
        </StyledIconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
          tabIndex={0}
          aria-label='feature flags devtool'
          sx={{ marginLeft: '10px' }}
        >
          <Typography
            variant='subtitle2'
            style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '8px',
              padding: '8px 16px',
              width: '100%',
              borderBottom: `1px solid ${PangeaColors.EarthBlueDark}`,
            }}
          >
            Feature Flags (7)
          </Typography>
          <Stack
            data-testid='featureFlagDevToolMenu'
            direction='column'
            style={{
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              width: '100%',
              padding: '8px 0',
              marginBottom: '8px',
            }}
          >
            {flagList
              .filter(([key]) =>
                [
                  'hedges',
                  'wallets',
                  'transactions',
                  'bulk-payments',
                  'risk-usd-restriction',
                  'strip-payments',
                  'currency-insights',
                ].includes(key),
              )
              .map(([name, feature]) => (
                <div
                  key={name}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '8px',
                    margin: '0 10px',
                  }}
                >
                  <IOSSwitch
                    checked={feature.enabled}
                    onChange={() =>
                      toggleFeatureFlags({ [name]: !feature.enabled })
                    }
                    inputProps={{ 'aria-label': name }}
                  />
                  <Typography style={{ lineHeight: '1rem' }}>
                    <code
                      style={{
                        lineHeight: '1rem',
                        fontSize: '13px',
                        padding: '2px 4px',
                        borderRadius: '4px',
                        backgroundColor: '#f2f1f1',
                      }}
                    >
                      {name}
                    </code>
                  </Typography>
                  <Tooltip
                    title={<FeatureFlagInfo feature={feature} />}
                    style={{
                      maxWidth: '360px',
                    }}
                  >
                    <IconButton>
                      <InfoOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              ))}
          </Stack>
        </Popover>
      </Stack>
    </Portal>
  );
};

export default FeatureFlagDevTool;
