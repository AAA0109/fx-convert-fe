import {
  Stack,
  Typography,
  Button,
  DialogTitle,
  IconButton,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Dialog from '@mui/material/Dialog';

import {
  accountContactOrderState,
  accountContactsState,
  userCompanyState,
} from 'atoms';
import {
  AccountContact,
  ContactPriority,
  CustomerGroup,
  PangeaGroupEnum,
  PangeaUser,
  setAlpha,
} from 'lib';
import { useCallback, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import UserManagementModal from './UserManagementModal';

const PERMISSION_OPTIONS_MAP: Record<
  CustomerGroup,
  Record<'description' | 'label', string>
> = {
  [PangeaGroupEnum.CustomerCreator]: {
    label: 'Creator',
    description:
      'Create/edit hedges to be approved by manager or admin. Cannot manage margin deposits/withdrawals.',
  },
  [PangeaGroupEnum.CustomerViewer]: {
    label: 'Viewer',
    description:
      'View only permissions for cash flows, margin and performance.',
  },
  [PangeaGroupEnum.CustomerManager]: {
    label: 'Manager',
    description:
      'Ability to approve hedges as well as manage margin deposits/withdrawals.',
  },
  [PangeaGroupEnum.CustomerAdmin]: {
    label: 'Admin',
    description:
      'Ability to approve hedges, manage margin deposits/withdrawals, as well as manage users/permissions.',
  },
  [PangeaGroupEnum.CustomerCorpay]: {
    label: 'CorPay',
    description:
      'Ability to ciew cash flows and perform CorPay wallet/payment transactions',
  },
  [PangeaGroupEnum.CustomerIbkr]: {
    label: 'IBKR',
    description: 'Ability to create and manage hedges',
  },
  [PangeaGroupEnum.AdminGroup]: {
    label: 'Approval Admin',
    description: 'Ability to approve and change transaction limits',
  },
  [PangeaGroupEnum.AccountOwnerGroup]: {
    label: 'Approval Owner',
    description: 'Ability to approve company transactions.',
  },
  [PangeaGroupEnum.ManagerGroup]: {
    label: 'Approval Manager',
    description: 'Ability to approve transactions requiring approval.',
  },
};

export function UserManagement() {
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const userCo = useRecoilValue(userCompanyState);

  const priorityContacts = useRecoilValue(accountContactOrderState(userCo?.id));

  const getSortOrder = useCallback(
    (id: number): ContactPriority => {
      const theContact = priorityContacts?.find((contact) => {
        return contact.user === id;
      });
      if (!theContact) {
        return ContactPriority.Tertiary;
      }
      switch (theContact.sort_order) {
        case 0:
          return ContactPriority.Primary;
        case 1:
          return ContactPriority.Secondary;
        default:
          return ContactPriority.Tertiary;
      }
    },
    [priorityContacts],
  );

  const pangeaUsersToAccountContacts = useCallback(
    (users: PangeaUser[]): AccountContact[] => {
      return (
        users?.map((user) => {
          return {
            id: user.id,
            name:
              user.first_name && user.last_name
                ? `${user.first_name} ${user.last_name}`
                : 'NO NAME',
            priorityOrder: getSortOrder(user.id),
            phone: user.phone,
            email: user.email,
            groups: user.groups,
          } as AccountContact;
        }) ?? []
      );
    },
    [getSortOrder],
  );

  const accountContacts = useRecoilValue(
    accountContactsState(userCo?.id),
  ) as PangeaUser[];

  const tableRows = pangeaUsersToAccountContacts(accountContacts);

  function getUserPermission(contact: AccountContact) {
    if (contact.groups && contact.groups.length) {
      if (
        contact.groups[0].name !== PangeaGroupEnum.AdminCustomerSuccess &&
        contact.groups[0].name !== PangeaGroupEnum.AdminReadOnly
      ) {
        return contact.groups[0].name;
      } else {
        return PangeaGroupEnum.CustomerViewer;
      }
    } else {
      return PangeaGroupEnum.CustomerViewer;
    }
  }

  const CustomDialog = styled(Dialog)(() => ({
    '.MuiPaper-root': {
      backgroundColor: PangeaColors.StoryWhiteMedium,
      padding: '1.5rem',
    },
    '& .MuiDialog-paper': {
      width: '440px',
      maxWidth: '100%',
      boxSizing: 'border-box',
    },
  }));

  const [page, setPage] = useState(0);

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const paginatedRows = tableRows.slice(page * 20, page * 20 + 20);

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            stickyHeader
            bgcolor={PangeaColors.White}
            sx={{ border: `1px solid ${PangeaColors.Gray}` }}
            aria-labelledby='tableTitle'
          >
            <TableRow hover tabIndex={-1} key={'contact_user_'}>
              <TableCell align='left' sx={{ fontWeight: 'bolder' }}>
                Name
              </TableCell>
              <TableCell align='left' sx={{ fontWeight: 'bolder' }}>
                Role
              </TableCell>
              <TableCell align='left' sx={{ fontWeight: 'bolder' }}></TableCell>
            </TableRow>

            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow hover tabIndex={-1} key={`user_management_${row.id}`}>
                  <TableCell align='left'>{row.name}</TableCell>
                  <TableCell align='left'>
                    {PERMISSION_OPTIONS_MAP[getUserPermission(row)]?.label ||
                      'No Role'}
                  </TableCell>
                  <TableCell align='right'>
                    <UserManagementModal {...row} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          sx={{
            display: 'flex-end',
            backgroundColor: `${PangeaColors.White}!important`,
            border: `solid 1px ${PangeaColors.Gray}`,
            borderTop: 'none',
          }}
          component='div'
          count={tableRows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={20}
          rowsPerPageOptions={[]}
        />
      </Paper>

      <Button
        onClick={() => setRoleModalOpen(true)}
        startIcon={<InfoOutlinedIcon />}
        sx={{
          backgroundColor: 'transparent',
          boxShadow: 'none',
          color: PangeaColors.SolidSlateMedium,
          ':hover': {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        About Roles
      </Button>

      <CustomDialog
        onClose={() => setRoleModalOpen(false)}
        open={roleModalOpen}
      >
        <DialogTitle
          style={{
            padding: '0px',
          }}
        >
          <Stack
            direction={'row'}
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}
          >
            <Typography variant='h5' component={'h2'}>
              About Roles
            </Typography>
            <IconButton
              aria-label='close'
              onClick={() => setRoleModalOpen(false)}
            >
              <Close
                style={{
                  width: '24px',
                  height: '24px',
                  color: setAlpha(PangeaColors.Black, 0.54),
                }}
              />
            </IconButton>
          </Stack>
        </DialogTitle>

        <Stack mt={2} gap={1}>
          <Typography variant='h6'>Viewer</Typography>
          <Typography variant='body1'>
            View only permissions for cash flows, margin and performance.
          </Typography>
        </Stack>

        <Stack mt={2} gap={1}>
          <Typography variant='h6'>Creator</Typography>
          <Typography variant='body1'>
            Create/edit hedges to be approved by manager or admin. Cannot manage
            margin deposits/withdrawals.
          </Typography>
        </Stack>

        <Stack mt={2} gap={1}>
          <Typography variant='h6'>Manager</Typography>
          <Typography variant='body1'>
            Ability to approve hedges as well as manage margin
            deposits/withdrawals.
          </Typography>
        </Stack>

        <Stack mt={2} gap={1}>
          <Typography variant='h6'>Admin</Typography>
          <Typography variant='body1'>
            Ability to approve hedges, manage margin deposits/withdrawals, as
            well as manage users/permissions.
          </Typography>
        </Stack>

        <Stack mt={2} mb={2} gap={1}>
          <Typography variant='h6'>Account Owner</Typography>
          <Typography variant='body1'>
            Ability to approve company transactions.
          </Typography>
        </Stack>

        <Button
          variant='outlined'
          fullWidth
          size='large'
          onClick={() => setRoleModalOpen(false)}
        >
          Close
        </Button>
      </CustomDialog>
    </Box>
  );
}
