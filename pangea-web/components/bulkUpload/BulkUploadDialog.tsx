import OpenInNew from '@mui/icons-material/OpenInNew';
import {
  Link,
  List,
  ListItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { addDays, format } from 'date-fns';
import { PangeaSimpleDialog } from '../modals';
import { PangeaButton } from '../shared';

interface IBulkDialogProps {
  openModal?: boolean;
  onClose?: () => void;
}
const getRandomDate = () =>
  format(addDays(new Date(), 7 + Math.random() * 729), 'MM/dd/yyyy');

export const BulkUploadDialog = (props: IBulkDialogProps) => {
  const { openModal = false, onClose } = props;

  const csv = [
    'Name,Description,Currency,Frequency,Recurrence,End Date,Amount',
    `Commercial building sale,Sold supply warehouse in Mexico City,MXN,onetime,,${getRandomDate()},234223`,
    `Video production contract payout,,AUD,onetime,,${getRandomDate()},-15670`,
    `Import estimated tax payments,,EUR,installments,,${getRandomDate()},-2345`,
    `Import estimated tax payments,,EUR,installments,,${getRandomDate()},-7643`,
    `Import estimated tax payments,,EUR,installments,,${getRandomDate()},-8263`,
    `Import estimated tax payments,,EUR,installments,,${getRandomDate()},-8422`,
    `Import estimated tax payments,,EUR,installments,,${getRandomDate()},-11175`,
    `Salary Payment for Jerry,,GBP,recurring,RRULE:INTERVAL=2;FREQ=WEEKLY;BYDAY=FR;COUNT=16,,-6864`,
    `Salary Payment for Sue,,AUD,recurring,Every month on the 15th,${getRandomDate()},-7050`,
  ];
  const base64String = window.btoa(
    decodeURIComponent(encodeURIComponent(csv.join('\n'))),
  );
  const href = `data:text/csv;base64,${base64String}`;
  return (
    <PangeaSimpleDialog
      title='Formatting your file'
      width={'800px'}
      openModal={openModal}
      onClose={onClose}
    >
      <Typography mb={1}>
        If you would like to upload multiple cash flows at once, you can do so
        by uploading a CSV file. The CSV file must be formatted in a specific
        way.
      </Typography>
      <List
        sx={{
          listStyleType: 'disc',
          pl: 5,
          '& .MuiListItem-root': {
            display: 'list-item',
          },
        }}
      >
        <ListItem>
          <Typography>
            <strong>Name: </strong>
            List the names of your cash flows below &#40;limited to 50
            characters per entry&#41;
          </Typography>
        </ListItem>
        <ListItem>
          <Typography>
            <strong>Description: </strong>A brief description of your cash flow
            &#40;limited to 255 characters per entry&#41;
          </Typography>
        </ListItem>
        <ListItem>
          <Typography>
            <strong>Currency: </strong>
            List the currency mnemonic &#40;e.g. USD, MXN, etc.&#41; that you
            will be sending or receiving.
          </Typography>
        </ListItem>
        <ListItem>
          <Typography>
            <strong>Frequency: </strong>
            List the frequency of this transaction &#40; &quot;onetime&quot; |
            &quot;recurring&quot; | &quot;installments&quot; &#41; If recurring,
            the Recurrence field is required. If installments, the Name field
            will be grouped together to locate other correlated installments.
          </Typography>
        </ListItem>
        <ListItem>
          <Typography>
            <strong>Recurrence: </strong>
            Recurrence - must be parseable text or RRULE syntax. &#40;can test
            here{' '}
            <Link href='https://jakubroztocil.github.io/rrule/' target='_blank'>
              https://jakubroztocil.github.io/rrule/
              <OpenInNew fontSize='small' />
            </Link>
            &#41;. For example &#40; &quot;Every Friday&quot;, &quot;Every 2
            months on the last Friday for 7 times&quot;,
            &quot;FREQ=DAILY;INTERVAL=3;COUNT=10&quot;&#41;
          </Typography>
        </ListItem>
        <ListItem>
          <Typography>
            <strong>End Date: </strong>
            Not required for recurring cashflows, but can be used to set an end
            date for the recurrence. Required for onetime or installments.
          </Typography>
        </ListItem>
        <ListItem>
          <Typography>
            <strong>Amount: </strong>
            This is amount in the foreign currency. If Amount is &lt; 0, then it
            will be a paying cash flow, if &gt; 0 it will be a receiving cash
            flow.
          </Typography>
        </ListItem>
      </List>

      <BasicTable />

      <Stack direction='row' justifyContent='space-evenly' marginTop={2}>
        <PangeaButton onClick={onClose} variant='outlined' size='large'>
          Close
        </PangeaButton>

        <PangeaButton size='large' href={href}>
          Download CSV
        </PangeaButton>
      </Stack>
    </PangeaSimpleDialog>
  );
};

const sampleData = (
  name: string,
  description: string,
  currency: string,
  frequency: string,
  recurrence: string,
  endDate: string,
  amount: string,
) => {
  return {
    name,
    description,
    currency,
    frequency,
    recurrence,
    endDate,
    amount,
  };
};

const rows = [
  sampleData(
    'Coffee Order ',
    'Q4 2022',
    'AUD',
    'onetime',
    '',
    getRandomDate(),
    '-85000',
  ),
  sampleData(
    'Chocolate Order',
    'Q1 2022',
    'EUR',
    'recurring',
    'Monthly on the 1st',
    '',
    '33000',
  ),
  sampleData(
    'Bulk Coffee',
    'Q1 2022',
    'EUR',
    'installments',
    '',
    getRandomDate(),
    '16000',
  ),
  sampleData(
    'Bulk Coffee',
    'Q1 2022',
    'EUR',
    'installments',
    '',
    getRandomDate(),
    '18300',
  ),
];

function BasicTable() {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align='right'>Description</TableCell>
            <TableCell align='right'>Currency</TableCell>
            <TableCell align='right'>Frequency</TableCell>
            <TableCell align='right'>Recurrence</TableCell>
            <TableCell align='right'>End Date</TableCell>
            <TableCell align='right'>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component='th' scope='row'>
                {row.name}
              </TableCell>
              <TableCell align='right'>{row.description}</TableCell>
              <TableCell align='right'>{row.currency}</TableCell>
              <TableCell align='right'>{row.frequency}</TableCell>
              <TableCell align='right'>{row.recurrence}</TableCell>
              <TableCell align='right'>{row.endDate}</TableCell>
              <TableCell align='right'>{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default BulkUploadDialog;
