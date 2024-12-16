import { Skeleton, Stack } from '@mui/material';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import { clientApiState } from 'atoms';
import { useLoading } from 'hooks';
import { PangeaActivity } from 'lib';
import userActivityMap from 'lib/useractivitymap.json';
import { isError, isUndefined } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import DownloadAsCsv from './DownloadAsCsv';

const tokenPattern = /\{([\w_]+)\}/g;

export const DataGridAccountActivity = () => {
  const authHelper = useRecoilValue(clientApiState);
  const apiRef = useGridApiRef();
  const [rowHistoryData, setRowHistoryData] = useState<PangeaActivity[]>();
  const { loadingPromise, loadingState } = useLoading();
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (rowHistoryData) {
      return;
    }
    const generateHistoryAccountActivity = async () => {
      const api = authHelper.getAuthenticatedApiHelper();
      const activitiesResponse = await api.loadHistoryAccountActivityAsync();
      if (activitiesResponse && !isError(activitiesResponse)) {
        setRowHistoryData(activitiesResponse);
      }
    };
    loadingPromise(generateHistoryAccountActivity());
  }, [authHelper, rowHistoryData, loadingPromise]);
  const onPageSizeChange = useCallback(
    (newPageSize: number) =>
      pageSize !== newPageSize && setPageSize(newPageSize),
    [pageSize],
  );
  if (!rowHistoryData) {
    return <Skeleton />;
  }
  return (
    <Stack spacing={2} direction='column'>
      <DataGridPro
        apiRef={apiRef}
        autoHeight={true}
        pagination={true}
        loading={loadingState.isLoading}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        rowsPerPageOptions={[10, 25, 50]}
        getEstimatedRowHeight={() => 100}
        getRowHeight={() => 'auto'}
        sx={{
          '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
            py: '15px',
          },
        }}
        columns={[
          {
            field: 'id',
            type: 'string',
            hide: true,
          },
          {
            field: 'activity_type',
            headerName: 'Description',
            headerAlign: 'left',
            align: 'left',
            type: 'string',
            flex: 3,
            valueFormatter: (params) => {
              if (isUndefined(params.id)) {
                return '';
              }
              const row: PangeaActivity = apiRef.current.getRow(
                params.id,
              ) as PangeaActivity;
              const template: string = userActivityMap[row.activity_type];
              if (!template) return 'Activity not found';
              return template.replace(tokenPattern, (_match, ...args) =>
                Object.hasOwn(row.changes as any, args[0])
                  ? row.changes[args[0]].toString()
                  : '',
              );
            },
          },
          {
            field: 'created',
            headerName: 'Date',
            headerAlign: 'center',
            align: 'right',
            type: 'date',
            flex: 1,
            valueFormatter: (params) =>
              new Date(params.value).toLocaleDateString(),
          },
        ]}
        rows={rowHistoryData.map((row, id) => {
          return { ...row, id };
        })}
      ></DataGridPro>
      <DownloadAsCsv apiRef={apiRef} fileName='Account Activity' />
    </Stack>
  );
};
export default DataGridAccountActivity;
