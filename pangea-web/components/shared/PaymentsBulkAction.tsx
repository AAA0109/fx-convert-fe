import AddIcon from '@mui/icons-material/Add';
import { ArrowDropDown } from '@mui/icons-material';
import {
  Alert,
  Box,
  ButtonGroup,
  Chip,
  ClickAwayListener,
  FormControl,
  Grow,
  InputLabel,
  ListSubheader,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { GridApiPro } from '@mui/x-data-grid-pro/models/gridApiPro';
import { PangeaSimpleDialog } from 'components/modals';
import { useWalletAndPaymentHelpers } from 'hooks';
import {
  MutableRefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { PangeaColors } from 'styles';
import PangeaButton from './PangeaButton';
import BeneficaryForm from './BeneficiaryForms/BeneficiaryForm';
import { PangeaBeneficiaryStatusEnum, PangeaPayment } from 'lib';
import BeneficiaryStatusChip from './BeneficiaryStatusChip';
import EmptyAccountItem from './EmptyAccountItem';
import {
  allBulkInitialMarketValueDateState,
  bulkUploadTransactionItemsState,
} from 'atoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';

export const PaymentsBulkAction = ({
  apiRef,
  onDelete,
}: {
  apiRef: MutableRefObject<GridApiPro>;
  onDelete?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState<string>('origin');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const setBulkUploadRows = useSetRecoilState(bulkUploadTransactionItemsState);
  const allPairsMarketData = useRecoilValue(allBulkInitialMarketValueDateState);

  const { allWallets, settlementAccounts } = useWalletAndPaymentHelpers();

  const selectedRows = apiRef.current?.getSelectedRows();
  const numberOfSelectedRows = selectedRows.size;

  const isSelectionValidforOriginModification = useMemo(() => {
    const firstSellCurrency = Array.from(selectedRows.values())[0]
      ?.sell_currency;
    return {
      isValid: Array.from(selectedRows.values()).every((row) => {
        return row.sell_currency === firstSellCurrency;
      }),
      currency: firstSellCurrency,
    };
  }, [selectedRows]);

  const isSelectionValidforDestinationModification = useMemo(() => {
    const firstBuyCurrency = Array.from(selectedRows.values())[0]?.buy_currency;
    const settlementAccount =
      allWallets.find(
        (wallet) =>
          wallet.wallet_id ===
          selectedRows.get(Array.from(selectedRows.keys())[0])
            ?.origin_account_id,
      ) ??
      settlementAccounts.find(
        (account) =>
          account.wallet_id ===
          selectedRows.get(Array.from(selectedRows.keys())[0])
            ?.origin_account_id,
      );
    const settlementBrokerId = settlementAccount?.broker.id;
    return {
      isValid: Array.from(selectedRows.values()).every((row) => {
        return row.buy_currency === firstBuyCurrency;
      }),
      currency: firstBuyCurrency,
      settlementBrokerId,
    };
  }, [allWallets, selectedRows, settlementAccounts]);

  const handleConfirmOrigin = useCallback(
    (originAccount: string) => {
      setOpenModal(false);
      const updatedRows = Array.from(selectedRows.values()).map((row) => ({
        ...row,
        origin_account_id: originAccount,
      }));
      if (apiRef.current) {
        apiRef.current.updateRows(updatedRows);
      }
      const modifiedRows = updatedRows as Array<Partial<PangeaPayment>>;
      setBulkUploadRows((existingRows) => {
        const existingIds = new Set(existingRows.map((row) => row.id));

        const modifiedExistingRows = existingRows.map((existingRow) => {
          const modifiedRow = modifiedRows.find(
            (row) => row.id === existingRow.id,
          );
          return modifiedRow ?? existingRow;
        });

        const newRows = modifiedRows.filter((row) => !existingIds.has(row.id));

        return [...modifiedExistingRows, ...newRows];
      });
    },
    [apiRef, selectedRows, setBulkUploadRows],
  );

  const handleConfirmDestination = useCallback(
    (destinationAccount: string) => {
      setOpenModal(false);
      const updatedRows = Array.from(selectedRows.values()).map((row) => ({
        ...row,
        destination_account_id: destinationAccount,
      }));
      if (apiRef.current) {
        apiRef.current.updateRows(updatedRows);
      }
      const modifiedRows = updatedRows as Array<Partial<PangeaPayment>>;
      setBulkUploadRows((existingRows) => {
        const existingIds = new Set(existingRows.map((row) => row.id));

        const modifiedExistingRows = existingRows.map((existingRow) => {
          const modifiedRow = modifiedRows.find(
            (row) => row.id === existingRow.id,
          );
          return modifiedRow ?? existingRow;
        });

        const newRows = modifiedRows.filter((row) => !existingIds.has(row.id));

        return [...modifiedExistingRows, ...newRows];
      });
    },
    [apiRef, selectedRows, setBulkUploadRows],
  );

  const handleCancelDelete = useCallback(() => {
    setOpenModal(false);
  }, []);

  const handleSelectDelete = useCallback(() => {
    setOpenModal(true);
    setModalType('delete');
  }, []);

  const { modalContent } = useMemo(() => {
    switch (modalType) {
      case 'origin':
        return {
          modalContent: (
            <OriginAccountSelector
              handleConfirm={handleConfirmOrigin}
              isSelectionValid={isSelectionValidforOriginModification}
            />
          ),
        };
      case 'destination':
        return {
          modalContent: (
            <DestinationAccountSelector
              handleConfirm={handleConfirmDestination}
              isSelectionValid={isSelectionValidforDestinationModification}
            />
          ),
        };
      default:
        return {
          modalContent: (
            <DeleteTransactionsDialog
              handleDelete={() => {
                onDelete?.();
                setOpenModal(false);
              }}
              handleCancel={handleCancelDelete}
            />
          ),
        };
    }
  }, [
    handleCancelDelete,
    handleConfirmDestination,
    handleConfirmOrigin,
    isSelectionValidforDestinationModification,
    isSelectionValidforOriginModification,
    modalType,
    onDelete,
  ]);

  const handleClose = useCallback((event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  }, []);
  const handleSelectOrigin = useCallback(() => {
    setOpenModal(true);
    setModalType('origin');
  }, []);
  const handleSelectDestination = useCallback(() => {
    setOpenModal(true);
    setModalType('destination');
  }, []);

  const handleSetAllAvailableSpotDates = useCallback(() => {
    const updatedRows = Array.from(selectedRows.values()).map((row) => ({
      ...row,
      delivery_date:
        allPairsMarketData?.spot_dates.find(
          (data) => data.pair === `${row.buy_currency}${row.sell_currency}`,
        )?.spot_date ?? row.delivery_date,
    }));
    if (apiRef.current) {
      apiRef.current.updateRows(updatedRows);
    }
    const modifiedRows = updatedRows as Array<Partial<PangeaPayment>>;
    setBulkUploadRows((existingRows) => {
      const existingIds = new Set(existingRows.map((row) => row.id));

      const modifiedExistingRows = existingRows.map((existingRow) => {
        const modifiedRow = modifiedRows.find(
          (row) => row.id === existingRow.id,
        );
        return modifiedRow ?? existingRow;
      });
      const newRows = existingRows.filter((row) => !existingIds.has(row.id));
      return [...modifiedExistingRows, ...newRows];
    });
  }, [allPairsMarketData?.spot_dates, apiRef, selectedRows, setBulkUploadRows]);

  return (
    <>
      {numberOfSelectedRows > 1 ? (
        <Typography
          fontWeight={500}
          fontSize='14px'
          textTransform='uppercase'
          fontFamily='SuisseIntlCond'
        >
          {numberOfSelectedRows} Selected:
        </Typography>
      ) : null}
      <ButtonGroup ref={anchorRef}>
        <PangeaButton
          size='medium'
          onClick={() => setOpen(true)}
          color='primary'
          endIcon={<ArrowDropDown />}
          sx={{ maxHeight: '36px' }}
          variant='outlined'
          disabled={numberOfSelectedRows < 2}
        >
          Bulk Action
        </PangeaButton>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 30,
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
                  <MenuItem onClick={handleSelectOrigin}>
                    Select Origin
                  </MenuItem>
                  <MenuItem onClick={handleSelectDestination}>
                    Select Destination
                  </MenuItem>
                  <MenuItem onClick={handleSetAllAvailableSpotDates}>
                    Update to Spot Dates
                  </MenuItem>
                  <MenuItem
                    onClick={handleSelectDelete}
                    sx={{ color: PangeaColors.RiskBerryMedium }}
                  >
                    Delete Transactions
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      <PangeaSimpleDialog
        width='360px'
        minHeight='auto'
        openModal={openModal}
        noButton
        onClose={(_event, reason) => {
          if (reason == 'backdropClick') {
            return;
          }
          setOpenModal(false);
        }}
      >
        {modalContent}
      </PangeaSimpleDialog>
    </>
  );
};

function DeleteTransactionsDialog({
  handleDelete,
  handleCancel,
}: {
  handleDelete: () => void;
  handleCancel: () => void;
}): JSX.Element {
  return (
    <Stack rowGap={3}>
      <Typography variant='h5'>Delete Transactions</Typography>
      <Typography variant='body2'>
        Are you sure you want to delete the selected transactions?
      </Typography>
      <Stack direction='row' justifyContent='flex-end' columnGap={3}>
        <PangeaButton
          onClick={handleCancel}
          variant='text'
          sx={{ minWidth: 'auto' }}
        >
          Cancel
        </PangeaButton>
        <PangeaButton
          sx={{ minWidth: 'auto' }}
          onClick={handleDelete}
          color='error'
        >
          Delete
        </PangeaButton>
      </Stack>
    </Stack>
  );
}

function OriginAccountSelector({
  handleConfirm,
  isSelectionValid,
}: {
  handleConfirm: (value: string) => void;
  isSelectionValid: {
    isValid: boolean;
    currency: string;
  };
}): JSX.Element {
  const [originAccount, setOriginAccount] = useState<string>('');
  const { isLoadingSettlementWallets, allWallets, settlementAccounts } =
    useWalletAndPaymentHelpers();
  return (
    <Stack rowGap={3}>
      <Typography variant='h5'>Origin Account</Typography>
      <Typography variant='body2'>
        Please select an origin account for the selected transactions:
      </Typography>
      {isSelectionValid.isValid ? null : (
        <Alert severity='error'>
          <Typography variant='body2'>
            Selected transactions have different origin(sell) currencies.
          </Typography>
        </Alert>
      )}
      <FormControl>
        <InputLabel id='bulk-origin-selector'>Origin</InputLabel>
        <Select
          labelId='bulk-origin-selector'
          id='origin-account'
          value={originAccount}
          label={isLoadingSettlementWallets ? 'Loading accounts ...' : 'Origin'}
          disabled={
            isLoadingSettlementWallets ||
            isLoadingSettlementWallets ||
            !isSelectionValid.isValid
          }
          onChange={(e) => setOriginAccount(e.target.value as string)}
          MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
        >
          <ListSubheader
            sx={{
              backgroundColor: PangeaColors.SolidSlateDarker,
              color: PangeaColors.LightPrimaryContrast,
            }}
            color='inherit'
          >
            Wallets
          </ListSubheader>

          {allWallets?.length === 0 ? (
            <EmptyAccountItem
              type='wallet'
              currency={isSelectionValid.currency}
            />
          ) : (
            allWallets
              ?.filter(({ currency }) => currency === isSelectionValid.currency)
              .map((wallet) => {
                const { wallet_id, name, broker, latest_balance } = wallet;
                const shouldDisable = latest_balance <= 1;
                return (
                  <MenuItem
                    key={wallet_id}
                    value={wallet_id}
                    disabled={shouldDisable}
                  >
                    <Stack
                      direction='row'
                      justifyContent='space-between'
                      alignItems='center'
                      width='100%'
                    >
                      <Box>
                        {name}:{' '}
                        <span style={{ fontWeight: 700 }}>
                          ${latest_balance}
                        </span>
                      </Box>
                      <Chip
                        label={broker.name}
                        size='small'
                        sx={{
                          borderRadius: '1rem',
                          textTransform: 'capitalize',
                          fontWeight: 400,
                          fontSize: '0.8125rem',
                          lineHeight: '1.125rem',
                          backgroundColor: PangeaColors.EarthBlueMedium,
                          color: PangeaColors.White,
                        }}
                      />
                    </Stack>
                  </MenuItem>
                );
              })
          )}
          <ListSubheader
            sx={{
              backgroundColor: PangeaColors.SolidSlateDarker,
              color: PangeaColors.LightPrimaryContrast,
            }}
            color='inherit'
          >
            Bank Accounts
          </ListSubheader>
          {settlementAccounts?.filter(
            ({ currency }) => currency === isSelectionValid.currency,
          ).length === 0 ? (
            <EmptyAccountItem
              type='settlement'
              currency={isSelectionValid.currency}
            />
          ) : (
            settlementAccounts
              ?.filter(({ currency }) => currency === isSelectionValid.currency)
              .map((account) => {
                const { wallet_id, account_number, name, broker } = account;
                return (
                  <MenuItem key={wallet_id} value={wallet_id}>
                    <Stack
                      direction='row'
                      justifyContent='space-between'
                      alignItems='center'
                      width='100%'
                    >
                      {`${name} (${
                        account_number ? '...' + account_number?.slice(-4) : ''
                      })`}
                      <Chip
                        label={broker.name}
                        size='small'
                        sx={{
                          borderRadius: '1rem',
                          textTransform: 'capitalize',
                          fontWeight: 400,
                          fontSize: '0.8125rem',
                          lineHeight: '1.125rem',
                          backgroundColor: PangeaColors.EarthBlueMedium,
                          color: PangeaColors.White,
                        }}
                      />
                    </Stack>
                  </MenuItem>
                );
              })
          )}
        </Select>
      </FormControl>
      <Stack direction='row' justifyContent='flex-end'>
        <PangeaButton
          onClick={() => handleConfirm(originAccount)}
          disabled={!originAccount}
        >
          Confirm
        </PangeaButton>
      </Stack>
    </Stack>
  );
}
function DestinationAccountSelector({
  handleConfirm,
  isSelectionValid,
}: {
  handleConfirm: (value: string) => void;
  isSelectionValid: {
    isValid: boolean;
    currency: string;
    settlementBrokerId?: number;
  };
}): JSX.Element {
  const [destinationAccount, setDestinationAccount] = useState<string>('');
  const {
    beneficiaryAccounts,
    allWallets,
    isLoadingSettlementWallets,
    isLoadingBeneficiaryAccounts,
  } = useWalletAndPaymentHelpers();
  const [openAddBeneficiaryDialog, setOpenAddBeneficiaryDialog] =
    useState(false);
  return (
    <Stack rowGap={3}>
      <Typography variant='h5'>Destination Account</Typography>
      <Typography variant='body2'>
        Please select a destination account for the selected transactions:
      </Typography>
      {isSelectionValid.isValid ? null : (
        <Alert severity='error'>
          <Typography variant='body2'>
            Selected transactions have different destination(buy) currencies.
          </Typography>
        </Alert>
      )}
      <FormControl sx={{ width: '100%' }}>
        <InputLabel id='bulk-destination-selector'>Destination</InputLabel>
        <Select
          labelId='bulk-destination-selector'
          id='destination-account'
          value={destinationAccount}
          label='Destination'
          onChange={(e) => setDestinationAccount(e.target.value as string)}
          MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
          disabled={
            isLoadingSettlementWallets ||
            isLoadingBeneficiaryAccounts ||
            !isSelectionValid.isValid
          }
        >
          <ListSubheader
            sx={{
              backgroundColor: PangeaColors.SolidSlateDarker,
              color: PangeaColors.LightPrimaryContrast,
            }}
            color='inherit'
          >
            Beneficiaries
          </ListSubheader>
          {beneficiaryAccounts
            ?.filter(
              (account) =>
                account.destination_currency === isSelectionValid.currency,
            )
            .map((beneficiary) => {
              const {
                beneficiary_id,
                beneficiary_name,
                destination_currency,
                bank_name,
                status,
                brokers,
              } = beneficiary;
              const shouldDisable = isSelectionValid.settlementBrokerId
                ? !brokers
                    .map(({ id }) => id)
                    .includes(isSelectionValid.settlementBrokerId) &&
                  ![PangeaBeneficiaryStatusEnum.Synced].includes(status)
                : false;
              return (
                <MenuItem
                  key={beneficiary_id}
                  value={beneficiary_id}
                  disabled={shouldDisable}
                >
                  <Stack
                    direction='row'
                    justifyContent='space-between'
                    width='100%'
                    columnGap={0.5}
                  >
                    <Box
                      sx={{ flex: 1 }}
                    >{`${beneficiary_name} - ${destination_currency} - ${bank_name}`}</Box>
                    <Box display='flex' flexDirection='row' columnGap={0.5}>
                      <BeneficiaryStatusChip status={status} />
                      {brokers.map(({ id, name }) => (
                        <Chip
                          key={id}
                          label={name}
                          size='small'
                          sx={{
                            borderRadius: '1rem',
                            textTransform: 'capitalize',
                            fontWeight: 400,
                            fontSize: '0.8125rem',
                            lineHeight: '1.125rem',
                            backgroundColor: PangeaColors.EarthBlueMedium,
                            color: PangeaColors.White,
                          }}
                        />
                      ))}
                    </Box>
                  </Stack>
                </MenuItem>
              );
            })}
          <MenuItem
            value=''
            key='add_new_beneficiary'
            onClick={() => setOpenAddBeneficiaryDialog(true)}
          >
            <AddIcon /> Add new beneficiary
          </MenuItem>
          <ListSubheader
            sx={{
              backgroundColor: PangeaColors.SolidSlateDarker,
              color: PangeaColors.LightPrimaryContrast,
            }}
            color='inherit'
          >
            Wallets
          </ListSubheader>
          {allWallets
            ?.filter(({ currency }) => currency === isSelectionValid.currency)
            ?.map((wallet) => {
              const { wallet_id, name, broker, latest_balance } = wallet;
              const shouldDisable = isSelectionValid.settlementBrokerId
                ? isSelectionValid.settlementBrokerId !== broker.id
                : false;
              return (
                <MenuItem
                  key={wallet_id}
                  value={wallet_id}
                  disabled={shouldDisable}
                >
                  <Stack
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'
                    width='100%'
                  >
                    <Box>
                      {name}:{' '}
                      <span style={{ fontWeight: 700 }}>${latest_balance}</span>
                    </Box>
                    <Chip
                      label={broker.name}
                      size='small'
                      sx={{
                        borderRadius: '1rem',
                        textTransform: 'capitalize',
                        fontWeight: 400,
                        fontSize: '0.8125rem',
                        lineHeight: '1.125rem',
                        backgroundColor: PangeaColors.EarthBlueMedium,
                        color: PangeaColors.White,
                      }}
                    />
                  </Stack>
                </MenuItem>
              );
            })}
        </Select>
        <BeneficaryForm
          open={openAddBeneficiaryDialog}
          setOpen={setOpenAddBeneficiaryDialog}
        />
      </FormControl>

      <Stack direction='row' justifyContent='flex-end'>
        <PangeaButton
          onClick={() => handleConfirm(destinationAccount)}
          disabled={!destinationAccount}
        >
          Confirm
        </PangeaButton>
      </Stack>
    </Stack>
  );
}

export default PaymentsBulkAction;
