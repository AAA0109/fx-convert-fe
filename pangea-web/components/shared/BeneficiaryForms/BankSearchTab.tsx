import { Box, FormControl, Stack, TextField, Typography } from '@mui/material';
import {
  DataGridPro,
  GridSelectionModel,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import {
  bankSearchListDataState,
  bankSearchPayloadState,
  corPayAddBeneficiaryRequestDataState,
} from 'atoms';
import { PangeaButton, PangeaLoading } from 'components/shared';
import { PangeaListBankResponse, PangeaListBankRow } from 'lib';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';

export const BankSearchTab = (): JSX.Element => {
  const [bankSearchPayload, setBankSearchPayload] = useRecoilState(
    bankSearchPayloadState,
  );
  const [bankSearchQuery, setBankSearchQuery] = useState('');
  const apiRef = useGridApiRef();
  const [pageSize, setPageSize] = useState<number>(100);
  const [beneficiaryDetails, setBeneficiaryDetails] = useRecoilState(
    corPayAddBeneficiaryRequestDataState,
  );
  const bankSearchListDataLoadable = useRecoilValueLoadable<
    Nullable<PangeaListBankResponse>
  >(bankSearchListDataState);
  const isLoadingBanks = bankSearchListDataLoadable.state === 'loading';
  const hasBankList = bankSearchListDataLoadable.state === 'hasValue';
  const bankSearchResults = useMemo(
    () =>
      !isLoadingBanks && hasBankList
        ? bankSearchListDataLoadable.getValue()
        : null,
    [bankSearchListDataLoadable, hasBankList, isLoadingBanks],
  );
  const bankSearchListData = bankSearchResults?.data.rows ?? [];
  const paginationData = useMemo(
    () =>
      bankSearchResults?.data.pagination ?? {
        total: 0,
        skip: 0,
        take: 0,
      },
    [bankSearchResults?.data.pagination],
  );
  const [rowCountState, setRowCountState] = useState(paginationData.total);
  const handlePageChange = useCallback(
    (page: number) => {
      setBankSearchPayload((payload) => ({
        ...payload,
        skip: page * pageSize,
        take: pageSize,
      }));
    },
    [pageSize, setBankSearchPayload],
  );
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);

  const handleSelectionModelChange = useCallback(
    (newSelectionModel: GridSelectionModel) => {
      const selectedId = newSelectionModel[newSelectionModel.length - 1];
      setSelectionModel(newSelectionModel.length === 0 ? [] : [selectedId]);
      const selectedRow = apiRef.current?.getRow(selectedId);

      if (selectedRow) {
        setBeneficiaryDetails((payload: any) => ({
          ...payload,
          swift_bic_code: selectedRow.swift_bic,
          bank_name: selectedRow.institution_name,
          bank_country: selectedRow.country_iso,
          bank_city: selectedRow.city,
          bank_address_line1: selectedRow.address1,
          bank_address_line2: selectedRow.address2,
          bank_postal: selectedRow.postal_code,
          iban_digits: '',
          iban_enabled: false,
          bank_region: selectedRow.region,
          routing_code: selectedRow.national_bank_code,
          local_routing_code: selectedRow.national_bank_code,
        }));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apiRef, setBeneficiaryDetails],
  );
  const onPageSizeChange = useCallback(
    (newPageSize: number) =>
      pageSize !== newPageSize && setPageSize(newPageSize),
    [pageSize],
  );
  const handleBankSearch = useCallback(() => {
    setBankSearchPayload((payload) => ({
      ...payload,
      query: bankSearchQuery,
      country: beneficiaryDetails.destination_country,
    }));
  }, [
    bankSearchQuery,
    beneficiaryDetails.destination_country,
    setBankSearchPayload,
  ]);

  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      paginationData.total !== undefined
        ? paginationData.total
        : prevRowCountState,
    );
  }, [paginationData.total, setRowCountState]);

  return (
    <>
      <Stack direction='row' spacing={1} alignItems='center'>
        <FormControl sx={{ width: '60%' }}>
          <TextField
            id='bank-search-input'
            fullWidth
            label='Search Banks'
            value={bankSearchQuery}
            variant='filled'
            onChange={(event) => setBankSearchQuery(event.target.value)}
          />
        </FormControl>
        <FormControl sx={{ width: '20%' }}>
          <TextField
            id='bank-country-input'
            fullWidth
            label='Bank Country'
            value={bankSearchPayload.country}
            variant='filled'
            disabled
          />
        </FormControl>
        <PangeaButton
          sx={{ width: '20%', minWidth: 'auto' }}
          onClick={handleBankSearch}
        >
          Search
        </PangeaButton>
      </Stack>
      <Stack
        spacing={1}
        sx={{ minHeight: '20rem', marginTop: '32px', width: '100%' }}
      >
        {isLoadingBanks && (
          <Box sx={{ width: '100%', minHeight: '20rem', display: 'flex' }}>
            <PangeaLoading centerPhrase loadingPhrase='Loading bank list...' />
          </Box>
        )}
        {!isLoadingBanks && hasBankList && (
          <DataGridPro
            apiRef={apiRef}
            columns={[
              {
                field: 'institution_name',
                headerName: 'Name',
                flex: 1,
                renderCell: (params: any) => (
                  <Typography variant='small'>{params.value}</Typography>
                ),
              },
              {
                field: 'address1',
                headerName: 'Address',
                flex: 1,
                renderCell: (params: any) => (
                  <Typography variant='small'>{params.value}</Typography>
                ),
              },
              {
                field: 'swift_bic',
                headerName: 'SWIFT',
                flex: 1,
                renderCell: (params: any) => (
                  <Typography variant='small'>{params.value}</Typography>
                ),
              },
              {
                field: 'national_bank_code',
                headerName: 'Routing',
                flex: 1,
                renderCell: (params: any) => (
                  <Typography variant='small'>{params.value}</Typography>
                ),
              },
            ]}
            rowCount={rowCountState}
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
            paginationMode='server'
            onPageChange={handlePageChange}
            rowsPerPageOptions={[50, 100, 150]}
            rows={bankSearchListData}
            getRowId={(row: PangeaListBankRow) => row.primary_key}
            checkboxSelection
            disableMultipleSelection
            pagination
            selectionModel={selectionModel}
            onSelectionModelChange={handleSelectionModelChange}
          />
        )}
      </Stack>
    </>
  );
};

export default BankSearchTab;
