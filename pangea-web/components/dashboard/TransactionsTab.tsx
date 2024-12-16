import { ArrowDropDown } from '@mui/icons-material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PaymentsIcon from '@mui/icons-material/Payments';
import {
  Box,
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
  Typography,
} from '@mui/material';
import { FeatureFlag, PangeaButton, PangeaLoading } from 'components/shared';
import { useRouter } from 'next/router';
import { Suspense, memo, useRef, useState } from 'react';
import TransactionsGrid from './TransactionsGrid';
import { bulkUploadTransactionItemsState, existingPaymentIdState } from 'atoms';
import { useResetRecoilState } from 'recoil';

export const TransactionsTab = memo(function TransactionsTab() {
  const router = useRouter();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const resetExistingPaymentId = useResetRecoilState(existingPaymentIdState);
  const resetBulkPaymentsUpload = useResetRecoilState(
    bulkUploadTransactionItemsState,
  );

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };
  return (
    <FeatureFlag name={['transactions']} fallback={<>Feature unavailable</>}>
      <Stack>
        <Box sx={{ width: '100%' }}>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <Stack
              direction='column'
              justifyContent='center'
              spacing={1}
              mb='1rem'
            >
              <Typography
                variant='h4'
                component='h1'
                style={{ paddingTop: '40px' }}
              >
                Activity
              </Typography>
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'
                spacing={0}
                sx={{ paddingBottom: '8px' }}
              >
                <Typography variant='body2' component='p'>
                  Your completed and scheduled transactions.
                </Typography>
              </Stack>
            </Stack>
            <Stack direction='row' columnGap={2}>
              <Button variant='text' href='/account/settings/beneficiaries'>
                Beneficiaries
              </Button>
              <ButtonGroup ref={anchorRef}>
                <PangeaButton
                  onClick={handleToggle}
                  endIcon={<ArrowDropDown />}
                  data-testid='manageMoneyButton'
                >
                  Book Transaction(s)
                </PangeaButton>
              </ButtonGroup>
              <Popper
                sx={{
                  zIndex: 1,
                }}
                open={open}
                anchorEl={anchorRef.current}
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
                        <MenuList
                          id='split-button-menu'
                          autoFocusItem
                          data-testid='manageMoneyMenu'
                        >
                          <MenuItem
                            onClick={() => {
                              resetExistingPaymentId();
                              resetBulkPaymentsUpload();
                              router.push('/transactions/payments');
                            }}
                          >
                            <PaymentsIcon sx={{ mr: 1 }} /> Book Transaction
                          </MenuItem>
                          <FeatureFlag name={'bulk-payments'}>
                            <MenuItem
                              onClick={() => {
                                resetExistingPaymentId();
                                resetBulkPaymentsUpload();
                                router.push('/transactions/payments/bulk');
                              }}
                            >
                              <ListAltIcon sx={{ mr: 1 }} /> Bulk Upload with
                              CSV
                            </MenuItem>
                          </FeatureFlag>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Stack>
          </Stack>
          <Suspense
            fallback={<PangeaLoading loadingPhrase='Initializing...' />}
          >
            <TransactionsGrid />
          </Suspense>
        </Box>
      </Stack>
    </FeatureFlag>
  );
});

export default TransactionsTab;
