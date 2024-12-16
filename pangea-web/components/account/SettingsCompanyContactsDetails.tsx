import { Skeleton, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {
  accountContactOrderState,
  accountContactsState,
  userCompanyState,
} from 'atoms';
import { RoleBasedAccessCheck } from 'components/shared';
import { useUserGroupsAndPermissions } from 'hooks';
import {
  AccountContact,
  ContactPriority,
  PangeaGroupEnum,
  PangeaUser,
} from 'lib';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import { AccountInviteUserModal } from './AccountInviteUserModal';
import { AccountUserDetailsModal } from './AccountUserDetailsModal';
import { CompanyContactsDialog } from './CompanyContactsDialog';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number,
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function sortContacts(array: readonly AccountContact[]) {
  const initialArray = stableSort(array, getComparator('asc', 'priorityOrder'));
  const primaryContacts = initialArray.filter((contact) => {
    return contact.priorityOrder === ContactPriority.Primary;
  });
  const secondaryContacts = initialArray.filter((contact) => {
    return contact.priorityOrder === ContactPriority.Secondary;
  });
  const tertiaryContacts = initialArray.filter((contact) => {
    return contact.priorityOrder === ContactPriority.Tertiary;
  });

  const sortedArray: AccountContact[] = [];
  sortedArray.push(
    ...stableSort(primaryContacts, getComparator('asc', 'name')),
  );
  sortedArray.push(
    ...stableSort(secondaryContacts, getComparator('asc', 'name')),
  );
  sortedArray.push(
    ...stableSort(tertiaryContacts, getComparator('asc', 'name')),
  );
  return sortedArray;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof AccountContact;
  label: string;
  numeric: boolean;
  cellJustify: Optional<'left' | 'right' | 'inherit' | 'center' | 'justify'>;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name',
    cellJustify: 'left',
  },
  {
    id: 'priorityOrder',
    numeric: true,
    disablePadding: false,
    label: 'Contact Order',
    cellJustify: 'left',
  },
  {
    id: 'details',
    numeric: false,
    disablePadding: false,
    label: 'Details',
    cellJustify: 'right',
  },
];

interface EnhancedTableProps {
  numSelected: number;
  order: Order;
  orderBy: string;
  rowCount: number;
  bgColor: PangeaColors;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, bgColor } = props;

  return (
    <TableHead
      sx={{
        backgroundColor: bgColor,
      }}
    >
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.cellJustify}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export function SettingsCompanyContactsDetails() {
  const { userGroups } = useUserGroupsAndPermissions();
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const order = 'asc';
  const orderBy = 'priorityOrder';
  const selected = [];
  const [tableRows, setTableRows] = useState(
    pangeaUsersToAccountContacts(accountContacts),
  );

  useEffect(() => {
    setTableRows(pangeaUsersToAccountContacts(accountContacts));
  }, [accountContacts, pangeaUsersToAccountContacts]);

  if (!accountContacts) return <Skeleton />;

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty tableRows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableRows.length) : 0;

  return (
    <>
      <Stack>
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <TableContainer>
              <Table
                stickyHeader
                bgcolor={PangeaColors.White}
                sx={{ border: `1px solid ${PangeaColors.Gray}` }}
                aria-labelledby='tableTitle'
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  rowCount={tableRows.length}
                  bgColor={PangeaColors.White}
                />
                <TableBody>
                  {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              tableRows.slice().sort(getComparator(order, orderBy)) */}
                  {sortContacts(tableRows as AccountContact[])
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={`contact_user_${row.id}`}
                        >
                          <TableCell align='left'>{row.name}</TableCell>
                          <TableCell align='left'>
                            {ContactPriority[row.priorityOrder]}
                          </TableCell>
                          <TableCell align='right'>
                            <AccountUserDetailsModal {...row} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
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
              rowsPerPageOptions={[5, 10, 25]}
              component='div'
              count={tableRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
        <RoleBasedAccessCheck
          userGroups={userGroups}
          allowedGroups={[PangeaGroupEnum.CustomerAdmin]}
        >
          <Stack
            direction={'row'}
            spacing={3}
            justifyContent={'left'}
            sx={{ marginBottom: '36px' }}
          >
            <Suspense>
              <AccountInviteUserModal />
            </Suspense>
            <Suspense>
              <CompanyContactsDialog />
            </Suspense>
          </Stack>
        </RoleBasedAccessCheck>
      </Stack>
    </>
  );
}
export default SettingsCompanyContactsDetails;
