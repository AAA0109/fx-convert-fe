import * as XLSX from 'xlsx';

export const useCsvTemplate = () => {
  const csvData = [
    [
      'Description',
      'SellCurrency',
      'BuyCurrency',
      'LockSide',
      'Amount',
      'ValueDate',
      'Origin',
      'Destination',
      'PurposeOfPayment',
    ],
    [
      'USDEURUSD1000',
      'USD',
      'EUR',
      'USD',
      '1000',
      '2024-06-15',
      'INCOMING268780_USD',
      '610268780000011003',
      'Invoice Payment',
    ],
    [
      'GBPUSDUSD5000',
      'GBP',
      'USD',
      'USD',
      '5000',
      '2024-06-20',
      'INCOMING268780_GBP',
      '610268780001011002',
      'Investment',
    ],
    [
      'EURJPYEUR1500',
      'EUR',
      'JPY',
      'EUR',
      '1500',
      '2024-07-01',
      'INCOMING268780_EUR',
      '610268780000011042',
      'Service Fees',
    ],
    [
      'AUDCADCAD',
      'AUD',
      'CAD',
      'CAD',
      '2000',
      '2024-07-10',
      '610268780000011011',
      '610268780000011001',
      'Equipment Purchase',
    ],
    [
      'CHFGBPGBP750',
      'CHF',
      'GBP',
      'GBP',
      '750',
      '2024-06-25',
      '610268780000011016',
      '610268780000011004',
      'Consulting Fees',
    ],
    [
      'JPYUSDJPY300000',
      'JPY',
      'USD',
      'JPY',
      '300000',
      '2024-06-30',
      'INCOMING268780_JPY',
      '610268780001011002',
      'Salary Transfer',
    ],
    [
      'CADEURCAD1200',
      'CAD',
      'EUR',
      'CAD',
      '1200',
      '2024-07-05',
      '610268780000011016',
      '610268780000011003',
      'Loan Repayment',
    ],
    [
      'INRAUDAUD10000',
      'INR',
      'AUD',
      'AUD',
      '10000',
      '2024-06-18',
      '610268780000011037',
      '610268780000011011',
      'Construction Costs',
    ],
  ];

  const emptyData = [
    [
      'Description',
      'SellCurrency',
      'BuyCurrency',
      'LockSide',
      'Amount',
      'ValueDate',
      'Origin',
      'Destination',
      'PurposeOfPayment',
    ],
    ['', '', '', '', '', '', '', '', ''],
  ];

  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // Append populated sheet
  const ws1 = XLSX.utils.aoa_to_sheet(csvData);
  XLSX.utils.book_append_sheet(wb, ws1, 'EXAMPLE');

  // Append empty sheet
  const ws2 = XLSX.utils.aoa_to_sheet(emptyData);
  XLSX.utils.book_append_sheet(wb, ws2, 'UPLOAD');

  // Generate XLSX file
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

  // Convert binary string to Blob
  const s2ab = (s: string) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };

  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

  const downloadFile = () => {
    // Create download link and click it
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.target = '_blank';
    a.href = href;
    a.download = 'Bulk_Transactions_CSV_Template.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return { downloadFile };
};

export default useCsvTemplate;
