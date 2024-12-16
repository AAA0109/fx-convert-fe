import ArrowForward from '@mui/icons-material/ArrowForward';
import FilePresent from '@mui/icons-material/FilePresent';
import ListAlt from '@mui/icons-material/ListAlt';
import LockOpen from '@mui/icons-material/LockOpen';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import { ibApplicationsState, userCompanyState } from 'atoms';
import { useRouter } from 'next/router';
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import { CircledPeopleIcon } from '../icons/CircledPeopleIcon';
import { PangeaButton } from '../shared';

export const CompanyCreatedPageContent = () => {
  const router = useRouter();
  const company = useRecoilValue(userCompanyState);
  const refreshIbInfo = useRecoilRefresher_UNSTABLE(ibApplicationsState);
  const handleButtonClick = useEventCallback(() => {
    refreshIbInfo();
    router.push('/activation/details');
  });

  return (
    <Box
      border={`1px solid ${PangeaColors.Gray}`}
      borderRadius='4px'
      sx={{ backgroundColor: PangeaColors.White }}
      justifyContent={'center'}
      mt={6}
      px={3}
      py={4}
      mx={'auto'}
      width='510px'
      textAlign={'center'}
    >
      <CircledPeopleIcon />
      <Typography component='h1' variant='h4' my={4}>
        Company Created
      </Typography>
      <Typography
        mb={2}
        variant='body1'
        color={PangeaColors.BlackSemiTransparent60}
      >
        To activate your account, we&apos;ll need to:
      </Typography>
      <List
        sx={{
          marginBottom: 2,
          '& .MuiListItem-root': {
            borderBottom: `1px solid ${PangeaColors.Gray}`,
          },
        }}
      >
        <ListItem>
          <ListAlt
            sx={{
              color: PangeaColors.BlackSemiTransparent50,
            }}
            fontSize='large'
          />
          <ListItemText
            sx={{ marginLeft: '35px' }}
            primary='1. Gather preliminary information'
            secondary='Details about you and your company.'
          ></ListItemText>
        </ListItem>
        <ListItem>
          <FilePresent
            sx={{
              color: PangeaColors.BlackSemiTransparent50,
            }}
            fontSize='large'
          />
          <ListItemText
            sx={{ marginLeft: '35px' }}
            primary='2. Collect required documents'
            secondary='These are used for verification purposes.'
          ></ListItemText>
        </ListItem>
        <ListItem>
          <LockOpen
            sx={{
              color: PangeaColors.BlackSemiTransparent50,
            }}
            fontSize='large'
          />
          <ListItemText
            sx={{ marginLeft: '35px' }}
            primary='3. Verify your details with InteractiveBrokers (IB)'
            secondary='We use IB to execute FX trades for you.'
          ></ListItemText>
        </ListItem>
      </List>
      <Stack alignItems={'end'}>
        <PangeaButton
          onClick={handleButtonClick}
          disabled={company?.status != 'Active'}
          size='large'
          endIcon={<ArrowForward />}
        >
          Get Started
        </PangeaButton>
      </Stack>
    </Box>
  );
};
export default CompanyCreatedPageContent;
