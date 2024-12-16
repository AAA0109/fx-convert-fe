import { Box, Stack, Typography } from '@mui/material';
import { pangeaTwoFactorAuthBackupCodes } from 'atoms';
import DownloadAsTxt from 'components/account/DownloadAsTxt';
import { useRecoilValue } from 'recoil';

export const BackupAuthCodes = () => {
  const backupCodes = useRecoilValue(pangeaTwoFactorAuthBackupCodes) || [];

  const backupFormater = (code: string) => {
    return code.match(/.{1,6}/g)?.join(' ');
  };

  return (
    <Box>
      <Stack
        direction='column'
        justifyContent='center'
        alignItems='center'
        spacing={2}
        style={{ padding: '16px 24px 16px' }}
      >
        <Typography>Backup verification codes</Typography>
        <Typography
          variant='body1'
          style={{
            textAlign: 'center',
          }}
        >
          With 2FA enabled for your account, you’ll need these backup codes if
          you ever lose your device. Without your device or a backup code,
          you’ll have to contact Pangea support to recover your account.
        </Typography>
        <Typography variant='body1'>
          We recommend you print them to keep in a safe place.
        </Typography>
        <Stack
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 0',
          }}
          spacing={3}
        >
          {backupCodes.map((code) => {
            return (
              <Typography
                key={code}
                component='h2'
                sx={{
                  fontWeight: 600,
                  fontSize: '24px',
                }}
              >
                {backupFormater(code)}
              </Typography>
            );
          })}
        </Stack>
        <DownloadAsTxt
          fileName={'Pangea_Backup_Codes.txt'}
          fileContent={backupCodes}
        />
      </Stack>
    </Box>
  );
};

export default BackupAuthCodes;
