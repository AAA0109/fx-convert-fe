import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DoNotDisturbOnOutlinedIcon from '@mui/icons-material/DoNotDisturbOnOutlined';
import Refresh from '@mui/icons-material/Refresh';
import { IconButton, Stack, Typography } from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  DataGridPro,
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid-pro';
import { joinRequestsState } from 'atoms';
import { PangeaButton } from 'components/shared';
import { ClientAuthHelper } from 'lib';
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from 'recoil';
export const AccountJoinRequests = () => {
  const requests = useRecoilValue(joinRequestsState);
  const refreshRequests = useRecoilRefresher_UNSTABLE(joinRequestsState);
  const handleApproveDeclineClick = useEventCallback(
    async (id: number, companyId: number, approve: boolean) => {
      const api = ClientAuthHelper.getInstance().getAuthenticatedApiHelper();
      approve
        ? await api.approveJoinRequestAsync(id, companyId)
        : await api.declineJoinRequestAsync(id, companyId);
      refreshRequests();
    },
  );
  const rows =
    requests?.map((r) => ({
      first_name: r.requestor?.first_name,
      last_name: r.requestor?.last_name,
      email: r.requestor?.email,
      phone: r.requestor?.phone,
      id: r.id,
      company_id: r.company_id,
      request: r,
    })) ??
    [
      // {
      //   first_name: 'Patrick',
      //   last_name: 'Creehan',
      //   company_id: 1,
      //   email: 'patrick@servant.io',
      //   id: 19,
      //   phone: '+18045642155',
      // },
    ];
  const columns = [
    { field: 'first_name', headerName: 'First Name' },
    { field: 'last_name', headerName: 'Last Name' },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'phone', headerName: 'Phone', flex: 1.5 },
    {
      field: 'actions',
      headerName: '',
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction='row' spacing={1}>
          <IconButton
            onClick={async () =>
              await handleApproveDeclineClick(
                params.row.id,
                params.row.company_id,
                true,
              )
            }
            title='Approve Request'
          >
            <CheckCircleOutlineIcon color='success' />
          </IconButton>
          <IconButton
            onClick={async () =>
              await handleApproveDeclineClick(
                params.row.id,
                params.row.company_id,
                false,
              )
            }
            title='Decline Request'
          >
            <DoNotDisturbOnOutlinedIcon color='error' />
          </IconButton>
        </Stack>
      ),
    },
  ] as GridColDef[];
  return (
    <Stack mt={2} spacing={2}>
      {rows.length > 0 ? (
        <Typography variant='body2'>
          The people below are requesting to join your company. Approve or
          decline their requests using the buttons on the right of the row.
        </Typography>
      ) : null}
      {rows.length > 0 ? (
        <DataGridPro
          autoHeight
          autoPageSize
          rows={rows}
          columns={columns}
        ></DataGridPro>
      ) : (
        <Typography variant='body2'>There are no requests pending.</Typography>
      )}
      <PangeaButton
        onClick={refreshRequests}
        startIcon={<Refresh />}
        fullWidth={false}
        sx={{ maxWidth: 150, alignSelf: 'flex-end' }}
      >
        Refresh
      </PangeaButton>
    </Stack>
  );
};
export default AccountJoinRequests;
