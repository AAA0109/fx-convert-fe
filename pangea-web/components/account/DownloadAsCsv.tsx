import useEventCallback from '@mui/utils/useEventCallback';
import { GridApiCommon as GridApiPro } from '@mui/x-data-grid-pro';
import { PangeaButton } from 'components/shared';
import { MutableRefObject } from 'react';

export const DownloadAsCsv = ({
  apiRef,
  fileName,
}: {
  apiRef: MutableRefObject<GridApiPro>;
  fileName: string;
}) => {
  const handleDownloadAsCsvClick = useEventCallback(() => {
    if (apiRef.current) {
      apiRef.current.exportDataAsCsv({
        allColumns: true,
        delimiter: ',',
        fileName,
        includeHeaders: true,
        utf8WithBom: true,
      });
    }
  });
  return apiRef.current ? (
    <PangeaButton
      onClick={handleDownloadAsCsvClick}
      title='Download CSV'
      sx={{ width: 128 }}
    >
      Download as CSV
    </PangeaButton>
  ) : null;
};
export default DownloadAsCsv;
