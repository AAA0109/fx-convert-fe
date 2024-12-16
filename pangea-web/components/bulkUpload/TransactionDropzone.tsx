import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Stack, Typography } from '@mui/material';
import { useTransactionHelpers } from 'hooks';
import { TransactionDropzoneResult } from 'lib';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PangeaColors } from 'styles';

export const TransactionDropzone = ({
  onDataAdded,
}: {
  onDataAdded?: (data: TransactionDropzoneResult) => void;
}) => {
  const { parseTransactionsCsvFileAsync } = useTransactionHelpers();
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      try {
        acceptedFiles.forEach(async (f) => {
          const myRecords = await parseTransactionsCsvFileAsync(f);
          if (onDataAdded) onDataAdded({ ...myRecords });
        });
      } catch (error) {
        console.error(error);
      }
    },
    [parseTransactionsCsvFileAsync, onDataAdded],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
  });
  return (
    <Box {...getRootProps()} width='100%' height='169px'>
      <input {...getInputProps()} />

      <Stack
        direction='column'
        spacing={2}
        justifyContent='center'
        alignItems='center'
        width={'100%'}
        height={'100%'}
      >
        <CloudUploadIcon sx={{ color: PangeaColors.BlackSemiTransparent87 }} />
        {isDragActive ? (
          <Typography
            sx={{
              color: PangeaColors.BlackSemiTransparent87,
              fontFamily: 'SuisseIntlCond',
              fontSize: 16,
              fontWeight: 500,
              lineHeight: '26px',
              letterSpacing: '0.46px',
              textTransform: 'uppercase',
            }}
          >
            Drop files here
          </Typography>
        ) : (
          <>
            <Typography
              sx={{
                color: PangeaColors.BlackSemiTransparent87,
                fontFamily: 'SuisseIntlCond',
                fontSize: 16,
                fontWeight: 500,
                lineHeight: '26px',
                letterSpacing: '0.46px',
                textTransform: 'uppercase',
              }}
            >
              Click to Upload
            </Typography>
            <Typography
              variant='body1'
              color={PangeaColors.BlackSemiTransparent60}
            >
              Or drag and drop .CSV
            </Typography>
          </>
        )}
      </Stack>
    </Box>
  );
};
export default TransactionDropzone;
