import { Box, Stack, Typography } from '@mui/material';
import { userCompanyState } from 'atoms';
import { useRecoilValue } from 'recoil';
import { countries } from 'lib';

export const AccountCompanyDetailsSimple = () => {
  const companyDetailsReceivedData = useRecoilValue(userCompanyState);

  const country = countries.find(
    (country) => country.value === companyDetailsReceivedData?.country,
  );

  return (
    <>
      <Typography variant='h5'>{companyDetailsReceivedData?.name}</Typography>
      <Stack rowGap={0}>
        <Stack direction='row' justifyContent='space-between'>
          <Typography variant='dataLabel'>Legal Name</Typography>
          <Typography variant='dataBody'>
            {companyDetailsReceivedData?.legal_name}
          </Typography>
        </Stack>
        <Stack direction='row' justifyContent='space-between'>
          <Typography variant='dataLabel'>Country (Legal Domicile)</Typography>
          <Typography variant='dataBody'>{country?.display_name}</Typography>
        </Stack>
        <Stack direction='row' justifyContent='space-between'>
          <Typography variant='dataLabel'>Reporting Currency</Typography>
          <Typography variant='dataBody'>
            {companyDetailsReceivedData?.currency}
          </Typography>
        </Stack>
        <Stack direction='row' justifyContent='space-between'>
          <Typography variant='dataLabel'>
            EIN / Identifying Corporate Number
          </Typography>
          <Typography variant='dataBody'>
            {companyDetailsReceivedData?.ein || 'N/A'}
          </Typography>
        </Stack>
        <Stack direction='row' justifyContent='space-between'>
          <Typography variant='dataLabel'>Address </Typography>
          <Box textAlign='right'>
            <Typography variant='dataBody'>
              {companyDetailsReceivedData?.address_1}
            </Typography>
            <br />
            {companyDetailsReceivedData?.address_2 && (
              <>
                <Typography variant='dataBody'>
                  {companyDetailsReceivedData?.address_2}
                </Typography>
                <br />
              </>
            )}
            <Typography variant='dataBody'>
              {companyDetailsReceivedData?.city},{' '}
              {companyDetailsReceivedData?.state ??
                companyDetailsReceivedData?.region}{' '}
              {companyDetailsReceivedData?.zip_code ??
                companyDetailsReceivedData?.postal}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </>
  );
};
