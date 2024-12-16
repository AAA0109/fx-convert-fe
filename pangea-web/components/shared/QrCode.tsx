import { Box } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';
import { PangeaColors } from 'styles';

interface QrCodeProps {
  url: string;
}

const QrCode = (props: QrCodeProps) => {
  const { url } = props;

  return (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      sx={{
        width: 250,
        height: 250,
        backgroundColor: PangeaColors.White,
      }}
    >
      <QRCodeCanvas id='qrCode' value={url} size={200} />
    </Box>
  );
};

export default QrCode;
