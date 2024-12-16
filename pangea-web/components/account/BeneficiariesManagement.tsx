import DeleteForever from '@mui/icons-material/DeleteForever';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ModeIcon from '@mui/icons-material/Mode';
import AddIcon from '@mui/icons-material/Add';
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  MenuItemProps,
  Stack,
  Typography,
} from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  DataGridPro,
  GridColDef,
  GridRenderCellParams,
  useGridApiRef,
} from '@mui/x-data-grid-pro';

import KabobIcon from '@mui/icons-material/MoreHoriz';
import { useQueryClient } from '@tanstack/react-query';
import {
  beneficiaryCreatePayloadState,
  beneficiaryValidationSchemaRequestDataState,
  clientApiState,
  pangeaAlertNotificationMessageState,
} from 'atoms';
import { BeneficiaryStatusChip, PangeaLoading } from 'components/shared';
import BeneficaryForm from 'components/shared/BeneficiaryForms/BeneficiaryForm';
import { useCacheableAsyncData, useLoading } from 'hooks';
import {
  PangeaBeneficiary,
  PangeaBeneficiaryAccountTypeEnum,
  PangeaBeneficiaryStatusEnum,
  PangeaPaymentDeliveryMethodEnum,
} from 'lib';
import { isError } from 'lodash';
import { useState } from 'react';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { PangeaColors } from 'styles';
import { styled } from '@mui/material/styles';

const StyledMenuItem = styled(MenuItem)<MenuItemProps>({
  textTransform: 'none',
  '& svg': {
    paddingRight: '1rem',
  },
});

const GridActionsMenu = ({
  id,
  account,
  status,
}: {
  id: number;
  account: PangeaBeneficiary;
  status?: PangeaBeneficiaryStatusEnum;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const api = useRecoilValue(clientApiState);
  const setPangeaNotification = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const setValidationSchemaRequest = useSetRecoilState(
    beneficiaryValidationSchemaRequestDataState,
  );
  const setBeneficiaryCreateRequest = useSetRecoilState(
    beneficiaryCreatePayloadState,
  );
  const queryClient = useQueryClient();
  const apiHelper = api.getAuthenticatedApiHelper();
  const {
    loadingPromise: modifyAccountPromise,
    loadingState: modifyAccountLoadingState,
  } = useLoading();

  const buttonsDisabled = modifyAccountLoadingState.isLoading;
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEdit = useEventCallback(() => {
    handleClose();
    setOpenEditModal(true);
    setValidationSchemaRequest({
      destination_country: account.destination_country,
      bank_country: account.bank_country,
      bank_currency: account.destination_currency,
      payment_method: account.preferred_method
        ? (account.preferred_method as unknown as PangeaPaymentDeliveryMethodEnum)
        : PangeaPaymentDeliveryMethodEnum.Local,
      beneficiary_account_type: PangeaBeneficiaryAccountTypeEnum.Individual,
    });
    setBeneficiaryCreateRequest({ ...account });
  });

  const handleActivateAccount = useEventCallback(async () => {
    modifyAccountPromise(
      (async () => {
        const activateAccountResponse =
          await apiHelper.activateSettlementBeneficiaryAsync({
            identifier: id as unknown as string,
          });
        if (isError(activateAccountResponse)) {
          setPangeaNotification({
            text: 'Error occurred while activating account',
            severity: 'error',
            timeout: 5000,
          });
          return;
        }
        setPangeaNotification({
          text: 'Account activated successfully',
          severity: 'success',
          timeout: 5000,
        });
        queryClient.invalidateQueries({
          queryKey: ['allBeneficiaries'],
        });
      })(),
    );
  });
  const handleDeleteAccount = useEventCallback(async () => {
    modifyAccountPromise(
      (async () => {
        const deleteSettlementAccountResponse =
          await apiHelper.deleteSettlementBeneficiaryAsync(
            id as unknown as string,
          );
        if (isError(deleteSettlementAccountResponse)) {
          setPangeaNotification({
            text: 'Error occurred while deleting account',
            severity: 'error',
            timeout: 5000,
          });
          return;
        }
        setPangeaNotification({
          text: 'Account deleted successfully',
          severity: 'success',
          timeout: 5000,
        });
        queryClient.invalidateQueries({
          queryKey: ['allBeneficiaries'],
        });
      })(),
    );
  });
  return (
    <>
      <IconButton
        aria-label='more'
        id='long-button'
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        onClick={handleClick}
      >
        <KabobIcon />
      </IconButton>
      <Menu
        id='long-menu'
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {(() => {
          if (status && [PangeaBeneficiaryStatusEnum.Draft].includes(status)) {
            return (
              <StyledMenuItem
                onClick={handleActivateAccount}
                disabled={buttonsDisabled}
              >
                <ToggleOnIcon />
                Activate Account
              </StyledMenuItem>
            );
          }
        })()}
        <StyledMenuItem disabled={buttonsDisabled} onClick={handleEdit}>
          <ModeIcon />
          Edit Account
        </StyledMenuItem>
        {(() => {
          if (
            status &&
            ![
              PangeaBeneficiaryStatusEnum.PendingDelete,
              PangeaBeneficiaryStatusEnum.Deleted,
            ].includes(status)
          ) {
            return (
              <StyledMenuItem
                onClick={handleDeleteAccount}
                disabled={buttonsDisabled}
              >
                <DeleteForever />
                Delete Account
              </StyledMenuItem>
            );
          }
        })()}
      </Menu>
      <BeneficaryForm
        open={openEditModal}
        setOpen={setOpenEditModal}
        editMode
      />
    </>
  );
};

const BeneficiaryList = (): JSX.Element => {
  const api = useRecoilValue(clientApiState);
  const apiHelper = api.getAuthenticatedApiHelper();

  const { data, isLoading } = useCacheableAsyncData(
    'allBeneficiaries',
    async () => {
      return await apiHelper.getAllBeneficiariesAsync();
    },
  );
  const gridApiRef = useGridApiRef();
  const columns: GridColDef<PangeaBeneficiary>[] = [
    {
      field: 'beneficiary_name',
      headerName: 'Beneficiary Details',
      flex: 3,
      renderCell: ({
        row: { beneficiary_name, destination_currency, bank_account_number },
      }) => (
        <Stack spacing={1}>
          <Typography variant='body1'>{beneficiary_name}</Typography>
          <Typography variant='body2' color='grey'>
            {destination_currency} (...{bank_account_number?.slice(-4)})
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'status',
      flex: 1.5,
      headerName: 'Account Status',
      renderCell: ({ row: { status } }) => (
        <BeneficiaryStatusChip status={status} />
      ),
    },
    {
      field: 'actions',
      headerName: '',
      filterable: false,
      flex: 0.1,
      renderCell: (params: GridRenderCellParams<PangeaBeneficiary>) => (
        <GridActionsMenu
          status={params.row.status}
          id={params.row.beneficiary_id}
          account={params.row}
        />
      ),
    },
  ];

  if (isLoading) {
    return (
      <PangeaLoading centerPhrase loadingPhrase='Loading beneficiaries ...' />
    );
  }
  if (isError(data) || !data) {
    return <Typography>There was an error loading beneficiaries</Typography>;
  }
  return (
    <>
      <DataGridPro
        apiRef={gridApiRef}
        columns={columns}
        rows={data}
        rowHeight={80}
        rowsPerPageOptions={[5, 10, 20, 50]}
        pagination={data.length > 5}
        disableSelectionOnClick
        disableColumnSelector
        disableColumnPinning
        getRowId={(row) => row.beneficiary_id}
      />
    </>
  );
};

export const BeneficiariesManagement = (): JSX.Element => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const resetValidationSchemaRequest = useResetRecoilState(
    beneficiaryValidationSchemaRequestDataState,
  );
  return (
    <Stack spacing={3}>
      <Stack direction={'row'} spacing={2} justifyContent='space-between'>
        <Typography variant='h5'>Beneficiaries</Typography>
        <Button
          variant='text'
          sx={{
            color: PangeaColors.EarthBlueMedium,
            fontFamily: 'SuisseIntlCond',
            fontSize: 16,
            fontWeight: 500,
            justifyContent: 'center',
          }}
          onClick={() => {
            setIsAddModalOpen(true);
            resetValidationSchemaRequest();
          }}
        >
          <AddIcon /> Add Beneficiary
        </Button>
      </Stack>
      <Stack sx={{ minHeight: '25rem' }}>
        <BeneficiaryList />
      </Stack>
      <BeneficaryForm open={isAddModalOpen} setOpen={setIsAddModalOpen} />
    </Stack>
  );
};

export default BeneficiariesManagement;
