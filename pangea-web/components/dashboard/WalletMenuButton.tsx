import { ArrowDropDown } from '@mui/icons-material';
import {
  ButtonGroup,
  ClickAwayListener,
  Grow,
  MenuList,
  Paper,
  Popper,
} from '@mui/material';
import { PangeaButton } from 'components/shared';
import { ManageMenuButton } from 'components/summarypanel';
import Image from 'next/image';
import { useRef, useState } from 'react';

const WalletMenuButton = () => {
  const options = [
    {
      label: 'New FX Wallet Transfer',
      subtitle: 'Transfer money across your Pangea FX wallets.',
      href: '/wallets/fx-wallet-transfer',
      icon: (
        <Image
          src='/images/CompareArrowsFilled.svg'
          width={20}
          height={20}
          alt='New FX Wallet Transfer'
        />
      ),
    },
    {
      label: 'Send a Payment',
      subtitle: 'Pay a beneficiary from your FX Wallets.',
      href: '/wallets/send-payments/',
      icon: (
        <Image
          src='/images/FeedFilled.svg'
          width={20}
          height={20}
          alt='Send a Payment'
        />
      ),
    },
    {
      label: 'Deposit Funds',
      subtitle: 'Deposit funds from your bank to an FX Wallets.',
      href: '/wallets/deposit-funds',
      icon: (
        <Image
          src='/images/PostAddFilled.svg'
          width={20}
          height={20}
          alt='Deposit Funds'
        />
      ),
    },
    {
      label: 'Withdraw Funds',
      subtitle: 'Withdraw funds from FX wallets to a bank account.',
      href: '/wallets/withdraw-funds',
      icon: (
        <Image
          src='/images/AccountBalanceFilled.svg'
          width={20}
          height={20}
          alt='Withdraw Funds'
        />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

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
    <>
      <ButtonGroup ref={anchorRef}>
        <PangeaButton
          onClick={handleToggle}
          endIcon={<ArrowDropDown />}
          data-testid='manageMoneyButton'
        >
          Manage Money
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
                  {options.map((option, i) => (
                    <ManageMenuButton
                      icon={option.icon}
                      key={option.label}
                      href={option.href}
                      title={option.label}
                      description={option.subtitle}
                      isDivider={i !== options.length - 1}
                      containerStackSpacing={0}
                    />
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default WalletMenuButton;
