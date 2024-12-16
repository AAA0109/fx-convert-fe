import { Alert, AlertTitle } from '@mui/material';
import { useAuthHelper } from 'hooks';
import { UserState, UserStateType } from 'lib';
import Link from 'next/link';

const AlertContent = ({ status }: { status?: UserStateType }) => {
  return (
    <>
      There are additional onboarding tasks still required.{' '}
      <Link href={status?.data?.cta ?? '#'}>Click here</Link> to complete.
    </>
  );
};

export const HedgingDisabledAlert = () => {
  const authData = useAuthHelper();
  return authData.userStatus?.state != UserState.Unknown &&
    !authData.canTrade ? (
    <Alert
      color='error'
      severity='warning'
      sx={{
        marginBottom: 2,
        maxWidth: '1152px',
        marginLeft: 0, // 'calc((100% - 1152px)/2)',
      }}
    >
      <AlertTitle>
        Company not fully activated. Hedging is not yet enabled.
      </AlertTitle>
      <AlertContent status={authData.userStatus} />
    </Alert>
  ) : null;
};

export default HedgingDisabledAlert;
