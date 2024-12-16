import { ExpandLess, ExpandMore, MoreHoriz } from '@mui/icons-material';
import {
  Box,
  ClickAwayListener,
  Grid,
  Grow,
  Link,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
  Typography,
} from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import { hideDashboardState, selectedWalletDetailedActivity } from 'atoms';
import { PangeaButton, PangeaLoading } from 'components/shared';
import {
  PangeaFXBalanceAccountsResponseItem,
  formatAccountName,
  formatCurrency,
} from 'lib';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { PangeaColors } from 'styles';

interface WalletContainerProps {
  displayWallets: PangeaFXBalanceAccountsResponseItem[];
  walletList: PangeaFXBalanceAccountsResponseItem[];
  showBackdrop: boolean;
  setDisplayWallets: React.Dispatch<
    React.SetStateAction<PangeaFXBalanceAccountsResponseItem[]>
  >;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
}

const WalletContainer = (props: WalletContainerProps) => {
  const {
    displayWallets,
    walletList,
    showBackdrop,
    setDisplayWallets,
    searchText,
    setSearchText,
  } = props;
  const setSelectedWalletDetailedActivity = useSetRecoilState(
    selectedWalletDetailedActivity,
  );

  const [open, setOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] =
    useState<PangeaFXBalanceAccountsResponseItem | null>(null);
  const [anchorRef, setAnchorRef] = useState<null | HTMLElement>(null);
  const setShowDashboardState = useSetRecoilState(hideDashboardState);
  const router = useRouter();

  const handleWalletTransferClicked = useEventCallback(() => {
    if (selectedWallet != null) {
      router.push(`/wallets/fx-wallet-transfer/${selectedWallet.id}`);
    }
    setOpen(false);
  });

  const handleSendPaymentClicked = useEventCallback(() => {
    if (selectedWallet != null) {
      router.push(`/wallets/send-payments/${selectedWallet.id}`);
    }
    setOpen(false);
  });

  const handleDepositFundsClicked = useEventCallback(() => {
    router.push(`/wallets/deposit-funds`);
    setOpen(false);
  });

  const handleGoToWalletClicked = useEventCallback(() => {
    setSelectedWalletDetailedActivity(selectedWallet);
    setShowDashboardState(true);
    setOpen(false);
  });
  const options = useMemo(
    () => [
      {
        label: 'Go to Wallet',
        action: () => {
          handleGoToWalletClicked();
        },
      },
      {
        label: 'New FX Wallet Transfer',
        action: () => {
          handleWalletTransferClicked();
        },
      },
      {
        label: `Send ${selectedWallet?.curr} Payment`,
        action: () => {
          handleSendPaymentClicked();
        },
      },
      {
        label: 'Deposit Funds',
        action: () => {
          handleDepositFundsClicked();
        },
      },
    ],
    [
      handleDepositFundsClicked,
      handleGoToWalletClicked,
      handleSendPaymentClicked,
      handleWalletTransferClicked,
      selectedWallet?.curr,
    ],
  );

  const handleShowMore = () => {
    if (displayWallets.length === walletList.length) {
      setDisplayWallets(walletList.slice(0, 6));
    } else {
      setDisplayWallets(walletList);
    }
  };

  const handleToggle = (
    event: React.MouseEvent<HTMLElement>,
    wallet: PangeaFXBalanceAccountsResponseItem,
  ) => {
    setAnchorRef(event.currentTarget);
    setSelectedWallet(wallet);
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = () => {
    setAnchorRef(null);
    setOpen(false);
  };

  return (
    <>
      {showBackdrop ? (
        <PangeaLoading loadingPhrase='Refreshing wallets...' useBackdrop />
      ) : null}
      {displayWallets.length == 0 ? (
        <Box
          sx={{
            width: '100%',
            height: '88px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #0000001F',
          }}
        >
          <Stack direction='row' alignContent='center' justifyContent='center'>
            <Typography
              variant='h4'
              sx={{
                color: PangeaColors.BlackSemiTransparent60,
                fontSize: '14px',
                margin: 'auto',
              }}
            >
              No wallets MATCHING “{searchText}”
            </Typography>
            <PangeaButton
              variant='text'
              color='info'
              onClick={() => setSearchText('')}
              sx={{
                minWidth: '80px',
              }}
            >
              Clear Search
            </PangeaButton>
          </Stack>
        </Box>
      ) : (
        <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={2}>
          {displayWallets.map((wallet: PangeaFXBalanceAccountsResponseItem) => {
            return (
              <Box
                key={wallet.id}
                sx={{
                  height: '88px',
                  borderRadius: '4px',
                  backgroundColor: PangeaColors.White,
                  boxShadow:
                    '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 1px 3px rgba(0, 0, 0, 0.12)',
                  '&:hover': {
                    backgroundColor: '#f6f6f6',
                    cursor: 'pointer',
                  },
                }}
              >
                <Grid
                  container
                  direction='row'
                  justifyContent='center'
                  alignItems='center'
                >
                  <Grid
                    item
                    xs={10.5}
                    onClick={() => {
                      setSelectedWalletDetailedActivity(wallet);
                      setShowDashboardState(true);
                    }}
                  >
                    <Typography
                      variant='h4'
                      sx={{
                        padding: '16px 16px 0px 16px',
                        width: '100%',
                      }}
                    >
                      {formatCurrency(
                        wallet.available_balance,
                        wallet.curr,
                        true,
                        2,
                        2,
                        false,
                      )}
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{
                        color: PangeaColors.BlackSemiTransparent60,
                        fontSize: '14px',
                        padding: '8px 16px 8px 16px',
                      }}
                    >
                      {wallet.curr_text + ' ' + formatAccountName(wallet.text)}
                    </Typography>
                  </Grid>
                  <Grid item xs={1.5}>
                    <PangeaButton
                      onClick={(e) => handleToggle(e, wallet)}
                      variant='text'
                      sx={{
                        minWidth: '24px',
                        minHeight: '24px',
                        height: '40px',
                        borderRadius: '50%',
                        margin: 'auto',
                      }}
                    >
                      <MoreHoriz
                        sx={{
                          color: PangeaColors.BlackSemiTransparent60,
                          fontSize: '24px',
                        }}
                      />
                    </PangeaButton>
                  </Grid>
                </Grid>
              </Box>
            );
          })}
        </Box>
      )}
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id='split-button-menu' autoFocusItem>
                  {options.map((option) => (
                    <MenuItem key={option.label} onClick={option.action}>
                      {option.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

      <Stack
        justifyContent='space-between'
        alignItems='flex-end'
        direction={'row'}
      >
        <Typography
          sx={{ fontSize: '12px', color: PangeaColors.BlackSemiTransparent60 }}
        >
          To set up a new FX wallet,{' '}
          <Link href='/account/help' sx={{ color: PangeaColors.EarthBlueDark }}>
            contact
          </Link>{' '}
          your advisor.
        </Typography>
        {searchText == '' && walletList.length > 6 && (
          <PangeaButton
            size='small'
            sx={{ width: '166px', height: '30px' }}
            variant='outlined'
            endIcon={
              displayWallets.length == walletList.length ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )
            }
            onClick={handleShowMore}
          >
            {displayWallets.length == walletList.length
              ? 'Collapse wallets'
              : `Show all ${walletList.length} wallets`}
          </PangeaButton>
        )}
      </Stack>
    </>
  );
};

export default WalletContainer;
